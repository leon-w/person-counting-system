import cv2
import numpy as np
import torch

from annotator import Annotator
from barrier import LinearBarrier
from camera import VideoFileCamera, WebcamCamera
from customer_tracking_deep_sort import CustomerTrackingDeepSort
from mask_detector import MaskDetector, MaskStatus
from yolo import Yolo
from yolov5.utils.general import check_img_size, scale_coords, xyxy2xywh
from yolov5.utils.torch_utils import time_sync


class PersonCounter:
    def __init__(self, opt, detect_masks=True, max_customer_count=50):
        self.detect_masks = detect_masks
        self.max_customer_count = max_customer_count
        
        self.barrier = LinearBarrier((0.5, 0), (0.5, 1), side_switched=True)
        self.deepsort = CustomerTrackingDeepSort("../../weights/deepsort_parameters.t7", self.barrier)
        self.model = Yolo("../../weights/yolov5n.pt", opt.conf_thres, opt.iou_thres)
        self.mask_detector = MaskDetector("../../weights/face_detector.caffemodel", "../../weights/mask_detector.model")

        stride = self.model.get_stride()  # model stride
        # the image size must be a multiple of the stride
        image_size = check_img_size(opt.image_size, s=stride)

        # initialize the camera
        if opt.source in ("0", "1"):
            self.camera = WebcamCamera(opt.source, img_size=image_size, stride=stride)
        else:
            self.camera = VideoFileCamera(opt.source, img_size=image_size, stride=stride)
        
        self.camera_iter = iter(self.camera)
        self.last_frame = None
        self.last_plain_frame = None

        self.missing_mask_callback = None
    
    @torch.no_grad()
    def process_next_frame(self):
        img, orig_img = next(self.camera_iter)
        self.last_plain_frame = orig_img
        img = torch.div(torch.from_numpy(img), 255.0)
        orig_img = orig_img.copy()

        # Inference
        t1 = time_sync()
        det = self.model.detect(img)
        t2 = time_sync()

        annotator = Annotator(orig_img)

        if det is not None and len(det):
            # Rescale boxes from img_size to im0 size
            det[:, :4] = scale_coords(img.shape[2:], det[:, :4], orig_img.shape).round()

            xywhs = xyxy2xywh(det[:, 0:4])
            confs = det[:, 4]
            clss = det[:, 5]

            # pass detections to deepsort
            outputs = self.deepsort.update(xywhs, confs, clss, orig_img)

            contains_missing_mask = False

            # draw boxes for visualization
            if len(outputs) > 0:
                for output, center_history, conf in zip(*outputs, confs):
                    cx_norm, cy_norm = np.divide(center_history[-1], orig_img.shape[1::-1])
                    is_inside = self.barrier.is_inside(cx_norm, cy_norm)

                    bbox = output[0:4]
                    id = output[4]

                    label = f"#{id} ({conf*100:.0f}%) >>> {'IN' if is_inside else 'OUT'}"
                    bbox_mask = None
                    mask_status = MaskStatus.MASK_UNKNOWN

                    if self.detect_masks:
                        cropped_image = orig_img[bbox[1]:bbox[3], bbox[0]:bbox[2]]
                        mask_status, bbox_mask = self.mask_detector.detect_mask(cropped_image)

                        if bbox_mask:
                            bbox_mask[0] += bbox[0]
                            bbox_mask[1] += bbox[1]
                            bbox_mask[2] += bbox[0]
                            bbox_mask[3] += bbox[1]

                        if mask_status == MaskStatus.MASK_UNKNOWN:
                            label += f" ? Mask ?"
                        elif mask_status == MaskStatus.MASK_INVALID:
                            label += f" ! No Mask !"
                            contains_missing_mask = True
                        elif mask_status == MaskStatus.MASK_VALID:
                            label += f" ^ Wears Mask ^"

                    annotator.draw_customer(bbox, label, center_history, is_inside, bbox_mask, mask_status)

            if self.missing_mask_callback and contains_missing_mask:
                self.missing_mask_callback()

        else:
            self.deepsort.increment_ages()

        # render results
        self.barrier.draw(orig_img)
        annotator.draw_customer_count(self.deepsort.customers_inside)

        result = annotator.result()
        flag, encoded_frame = cv2.imencode(".jpg", result)
        if flag:
            self.last_frame = encoded_frame.tobytes()

        return result
