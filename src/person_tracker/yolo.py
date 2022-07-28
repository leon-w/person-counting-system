from yolov5.models.experimental import attempt_load
from yolov5.utils.general import non_max_suppression


class Yolo:
    def __init__(self, weights_path, conf_thres=0.4, iou_thres=0.5):
        self.conf_thres = conf_thres
        self.iou_thres = iou_thres
        self._model = attempt_load(weights_path)

    def get_stride(self):
        return int(self._model.stride.max())

    def detect(self, img):
        pred = self._model(img)[0]
        pred = non_max_suppression(pred, self.conf_thres, self.iou_thres, classes=[0])
        return pred[0]
