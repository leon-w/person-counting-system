import itertools

import cv2

import annotator


class LinearBarrier():
    def __init__(self, p1, p2, side_switched=False):
        # Coordonates between 0 and 1
        self.p1 = p1
        self.p2 = p2
        self.side_switched = side_switched

    def is_inside(self, x, y):
        # determine if a point is in a side or an other side of the barrier
        determinant = ((self.p2[0] - self.p1[0]) * (y - self.p1[1]) - (self.p2[1] - self.p1[1]) * (x - self.p1[0])) >= 0
        is_right = determinant if not self.side_switched else not determinant
        return is_right

    def draw(self, img, color=(0, 255, 0)):
        # draw decision barrier
        h, w = img.shape[:2]
        cv2.line(img, (int(self.p1[0] * w), int(self.p1[1] * h)), (int(self.p2[0] * w), int(self.p2[1] * h)), color, 5)

        # draw labels in all corners to indicate inside and outside
        for x, y in itertools.product([20, w - 90], [50, h - 30]):
            if self.is_inside(x / w, y / h):
                label = "IN"
                c = annotator.COLOR_INSIDE
            else:
                label = "OUT"
                c = annotator.COLOR_OUTSIDE

            cv2.putText(img, label, (x, y), 0, 1, c, thickness=2, lineType=cv2.LINE_AA)
        
    def to_dict(self):
        return {
            "p1_x": self.p1[0],
            "p1_y": self.p1[1],
            "p2_x": self.p2[0],
            "p2_y": self.p2[1],
            "side_switched": self.side_switched
        }

    def update(self, p1, p2, side_switched):
        self.p1 = p1
        self.p2 = p2
        self.side_switched = side_switched
