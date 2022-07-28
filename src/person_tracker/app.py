import sys

sys.path.insert(0, "./yolov5")

import argparse
import threading

import cv2
from flask import Flask
from flask_cors import CORS

import backend_api
from person_counter import PersonCounter
from ws_server import WSServer

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    # file/folder, 0 for webcam
    parser.add_argument("--source", type=str, default="0", help="source")

    parser.add_argument("--image_size", type=int, default=640, help="inference size (pixels)")
    parser.add_argument("--conf_thres", type=float, default=0.4, help="object confidence threshold")
    parser.add_argument("--iou_thres", type=float, default=0.5, help="IOU threshold for NMS")

    parser.add_argument("--show_vid", action="store_true", help="display tracking video results")

    parser.add_argument("--detect_masks", action="store_true", help="detect masks")
    args = parser.parse_args()

    person_counter = PersonCounter(args, detect_masks=args.detect_masks)


    app = Flask(__name__)
    cors = CORS()
    cors.init_app(app)

    backend_api.setup_rest_api(app, person_counter)
    
    # start webserver on new thread
    threading.Thread(target=lambda: app.run(port=9000, debug=True, use_reloader=False)).start()
    

    ws_server = WSServer(person_counter, port=9001)
    ws_server.start()


    if args.show_vid:
        window_title = "Person Counter | v1.0"
        cv2.namedWindow(window_title, cv2.WINDOW_NORMAL)
        cv2.setWindowTitle(window_title, window_title)
    
    # detection main loop
    while True:
        frame = person_counter.process_next_frame()

        if args.show_vid:
            cv2.imshow(window_title, frame)
            cv2.waitKey(1)

