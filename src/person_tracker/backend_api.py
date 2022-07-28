import time

import cv2
from flask import Response
from flask_restful import Api, Resource, reqparse


def clamp(x, _min, _max):
    return min(max(x, _min), _max)

def setup_rest_api(app, person_counter):
    class VideoStream(Resource):
        def get(self):
            def gen_frames():
                while True:
                    yield b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + person_counter.last_frame + b'\r\n'
                    time.sleep(1/25)
            return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')
    

    class CameraImage(Resource):
        def get(self):
            flag, encoded_frame = cv2.imencode(".jpg", person_counter.last_plain_frame)
            if flag:
                img = encoded_frame.tobytes()
            else:
                img = b''
            return Response(img, mimetype='image/jpg')
    
    class GetCustomerCount(Resource):
        def get(self):
            result = {
                "current_customer_count": person_counter.deepsort.customers_inside,
                "maximal_customer_count": person_counter.max_customer_count
            }
            return result
    
    class SetMaximalCustomerCount(Resource):
        def post(self):
            parser = reqparse.RequestParser()
            parser.add_argument('maximal_customer_count', required=True, type=int)
            args = parser.parse_args()

            maximal_customer_count = args["maximal_customer_count"]

            maximal_customer_count = clamp(maximal_customer_count, 1, 999)
            person_counter.max_customer_count = maximal_customer_count

            result = {
                "success": True,
                "new_maximal_customer_count": maximal_customer_count,
            }
            return result
    
    class SetCustomerCountOverride(Resource):
        def post(self):
            parser = reqparse.RequestParser()
            parser.add_argument('customer_count', required=True, type=int)
            args = parser.parse_args()

            customer_count = args["customer_count"]

            customer_count = clamp(customer_count, 0, 999)
            person_counter.deepsort.customers_inside = customer_count

            if person_counter.deepsort.customer_count_change_callback:
                person_counter.deepsort.customer_count_change_callback()

            result = {
                "success": True,
                "new_customer_count": customer_count,
            }
            return result
    
    class MaskDetection(Resource):
        def get(self):
            result = {
                "enabled": person_counter.detect_masks,
            }
            return result
    
    class SetMaskDetection(Resource):
        def post(self):
            parser = reqparse.RequestParser()
            parser.add_argument('enabled', required=True, type=str)
            args = parser.parse_args()
            
            enabled = args["enabled"] == "true"

            person_counter.detect_masks = enabled

            result = {
                "success": True,
                "enabled": person_counter.detect_masks,
            }
            return result
    
    class GetBarrier(Resource):
        def get(self):
            result = person_counter.barrier.to_dict()
            return result
    
    class SetBarrier(Resource):
        def post(self):
            parser = reqparse.RequestParser()
            parser.add_argument('p1_x', required=True, type=float)
            parser.add_argument('p1_y', required=True, type=float)
            parser.add_argument('p2_x', required=True, type=float)
            parser.add_argument('p2_y', required=True, type=float)
            parser.add_argument('side_switched', required=True, type=str)
            args = parser.parse_args()

            p1_x = clamp(args["p1_x"], 0, 1)
            p1_y = clamp(args["p1_y"], 0, 1)
            p2_x = clamp(args["p2_x"], 0, 1)
            p2_y = clamp(args["p2_y"], 0, 1)
            side_switched = args["side_switched"] == "true"

            person_counter.barrier.update((p1_x, p1_y), (p2_x, p2_y), side_switched)

            result = {
                "success": True,
                **person_counter.barrier.to_dict()
            }
            return result

    class GetCustomerTimeSpentInside(Resource):
        def get(self):
            history = person_counter.deepsort.customer_time_spent
            if len(history) == 0:
                average = float("nan")
            else:
                average = sum(history) / len(history)
            result = {
                "average": average,
                "history": history,
            }
            return result


    api = Api(app)
    
    api.add_resource(VideoStream, '/api/video_stream')
    api.add_resource(CameraImage, '/api/camera_image')
    api.add_resource(GetCustomerCount, '/api/get_customer_count')
    api.add_resource(SetMaximalCustomerCount, '/api/set_maximal_customer_count')
    api.add_resource(SetCustomerCountOverride, '/api/set_customer_count_override')
    api.add_resource(MaskDetection, '/api/mask_detection')
    api.add_resource(SetMaskDetection, '/api/set_mask_detection')
    api.add_resource(GetBarrier, '/api/get_barrier')
    api.add_resource(SetBarrier, '/api/set_barrier')
    api.add_resource(GetCustomerTimeSpentInside, '/api/get_customer_time_spent_inside')
    