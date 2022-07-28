import time

import numpy as np
from scipy import spatial

from deep_sort_pytorch.deep_sort import DeepSort
from deep_sort_pytorch.utils.parser import get_config


class CustomerTrackingDeepSort:
    def __init__(self, weights_path, barrier):
        cfg = get_config('deep_sort_pytorch/configs/deep_sort.yaml')
        self._deep_sort_impl = DeepSort(
            weights_path,
            max_dist=cfg.DEEPSORT.MAX_DIST,
            min_confidence=cfg.DEEPSORT.MIN_CONFIDENCE,
            max_iou_distance=cfg.DEEPSORT.MAX_IOU_DISTANCE,
            max_age=cfg.DEEPSORT.MAX_AGE,
            n_init=cfg.DEEPSORT.N_INIT,
            nn_budget=cfg.DEEPSORT.NN_BUDGET,
            use_cuda=True,
        )

        self.barrier = barrier
        self.customers_inside = 0
        self.customer_features = {}
        self.customer_time_spent = []

        self.customer_count_change_callback = None

    def update(self, bbox_xywh, confidences, classes, ori_img):
        outputs = self._deep_sort_impl.update(bbox_xywh, confidences, classes, ori_img)

        for output, center_history, features in zip(*outputs):
            if len(center_history) >= 2:
                xy = ori_img.shape[1::-1]
                inside_before = self.barrier.is_inside(*np.divide(center_history[-2], xy))
                inside_now = self.barrier.is_inside(*np.divide(center_history[-1], xy))
                customer_id = output[4]

                customer_count_changed = False

                # enter
                if inside_now and not inside_before:
                    self.customers_inside += 1
                    self.customer_features[customer_id] = features, time.time()
                    customer_count_changed = True

                # leave
                if not inside_now and inside_before:
                    self.customers_inside -= 1
                    customer_count_changed = True

                    if self.customers_inside < 0:
                        print("[WARNING] negative customer number")
                        self.customers_inside = 0
                    else:
                        max_similarity = -1
                        match_id = None
                        for k in self.customer_features.keys():
                            if features is not None and self.customer_features[k][0] is not None:
                                score = 1 - spatial.distance.cosine(self.customer_features[k][0], features)
                                if score > max_similarity:
                                    match_id = k
                                    max_similarity = score

                        if match_id is not None:                        
                            time_customer_spend_in_shop = time.time() - self.customer_features[match_id][1]
                            self.customer_features.pop(match_id)

                            # TODO handle event
                            print(f"Customer {customer_id} left after", time_customer_spend_in_shop)
                            self.customer_time_spent.append(time_customer_spend_in_shop)
                
                if self.customer_count_change_callback and customer_count_changed:
                    self.customer_count_change_callback()

        return outputs[:-1]

    def increment_ages(self):
        self._deep_sort_impl.increment_ages()
