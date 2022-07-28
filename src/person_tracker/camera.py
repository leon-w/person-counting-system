import numpy as np

from yolov5.utils.datasets import LoadImages, LoadStreams


class WebcamCamera:
    def __init__(self, path="0", img_size=320, stride=32):
        self._stream = LoadStreams(path, img_size=img_size, stride=stride)

    def __iter__(self):
        # returns the scaled and original image from the camera
        for _path, img, im0s, _vid_cap in self._stream:
            yield img, im0s[0]


class VideoFileCamera:
    def __init__(self, path, img_size=320, stride=32):
        self._stream = LoadImages(path, img_size=img_size, stride=stride)

    def __iter__(self):
        # returns the scaled and original image from the camera
        for _path, img, im0s, _vid_cap in self._stream:
            if len(img.shape) == 3:
                img = img[np.newaxis]
            yield img, im0s
