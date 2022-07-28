
import os
from enum import Enum

import cv2
import numpy as np
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array


class MaskStatus(Enum):
    MASK_VALID = 1
    MASK_INVALID = -1
    MASK_UNKNOWN = 0


class MaskDetector:
    def __init__(self, weights_face, weights_mask, resolution=(150, 150)):
        prototxtPath = os.path.sep.join(["face_detector", "deploy.prototxt"])
        self.faceNet = cv2.dnn.readNet(prototxtPath, weights_face)
        self.maskNet = load_model(weights_mask)
        self.minConfidence = 0.5
        self.resolution = resolution

    def _predict_mask(self, frame):
        # grab the dimensions of the frame and then construct a blob
        # from it
        (h, w) = frame.shape[:2]
        blob = cv2.dnn.blobFromImage(frame, 1.0, self.resolution, (104.0, 177.0, 123.0))

        # pass the blob through the network and obtain the face detections
        self.faceNet.setInput(blob)
        detections = self.faceNet.forward()

        # initialize our list of faces, their corresponding locations,
        # and the list of predictions from our face mask network
        faces = []
        locs = []
        preds = []

        # loop over the detections
        for i in range(0, detections.shape[2]):
            # extract the confidence (i.e., probability) associated with
            # the detection
            confidence = detections[0, 0, i, 2]

            # filter out weak detections by ensuring the confidence is
            # greater than the minimum confidence
            if confidence > self.minConfidence:
                # compute the (x, y)-coordinates of the bounding box for
                # the object
                box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
                (startX, startY, endX, endY) = box.astype("int")

                # ensure the bounding boxes fall within the dimensions of
                # the frame
                (startX, startY) = (max(0, startX), max(0, startY))
                (endX, endY) = (min(w - 1, endX), min(h - 1, endY))

                # extract the face ROI, convert it from BGR to RGB channel
                # ordering, resize it to 224x224, and preprocess it
                face = frame[startY:endY, startX:endX]
                if face.any():
                    face = cv2.cvtColor(face, cv2.COLOR_BGR2RGB)
                    face = cv2.resize(face, (224, 224))
                    face = img_to_array(face)
                    face = preprocess_input(face)

                    # add the face and bounding boxes to their respective
                    # lists
                    faces.append(face)
                    locs.append([startX, startY, endX, endY])

        # only make a predictions if at least one face was detected
        if len(faces) > 0:
            # for faster inference we'll make batch predictions on *all*
            # faces at the same time rather than one-by-one predictions
            # in the above `for` loop
            faces = np.array(faces, dtype="float32")
            preds = self.maskNet.predict(faces, batch_size=32)

        # return a 2-tuple of the face locations and their corresponding
        # locations
        return locs, preds
    
    def detect_mask(self, frame):
        # detect faces in the frame and determine if they are wearing a
	    # face mask or not
        locs, preds = self._predict_mask(frame)
        
        mask_status = MaskStatus.MASK_UNKNOWN
        mask_bbox = None

        if len(locs) > 0 and len(preds) > 0:
            mask_bbox = locs[0]
            conf_mask, conf_no_mask = preds[0]

            mask_status = MaskStatus.MASK_VALID if conf_mask > conf_no_mask else MaskStatus.MASK_INVALID

        return mask_status, mask_bbox
