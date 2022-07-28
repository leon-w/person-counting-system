import cv2
import numpy as np

from mask_detector import MaskStatus
from yolov5.utils.plots import Annotator as YoloAnnotator

COLOR_INSIDE = (0, 255, 255)
COLOR_OUTSIDE = (0, 0, 255)
PATH_HISTORY_LENGTH = 25


class Annotator:
    def __init__(self, img):
        self.img = img
        self._yolo_annotator = YoloAnnotator(img, line_width=2)

    def draw_customer(self, bbox, label, center_history, inside, mask_bbox=None, mask_status=None):
        c = COLOR_INSIDE if inside else COLOR_OUTSIDE
        self._yolo_annotator.box_label(bbox, label, color=c, txt_color=(0, 0, 0))
        
        if mask_bbox:
            mask_label = "Valid Mask" if mask_status == MaskStatus.MASK_VALID else "! NO MASK !"
            c_mask = c if mask_status == MaskStatus.MASK_VALID else (74, 109, 249)
            self._yolo_annotator.box_label(mask_bbox, mask_label, color=c_mask, txt_color=(0, 0, 0))

        if len(center_history) >= 2:
            cv2.polylines(self.img, [np.array(center_history[-PATH_HISTORY_LENGTH:], dtype=np.int32)], False, c, 3)

    def result(self):
        return self._yolo_annotator.result()

    def draw_customer_count(self, count):
        cv2.putText(self.img, f"[{count}]", (30, 220), 0, 5, (242, 4, 20), thickness=7, lineType=cv2.LINE_AA)
