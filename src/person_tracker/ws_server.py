import json

from websocket_server import WebsocketServer


class WSServer:
    def __init__(self, person_counter, port=9001):
        self._wss = WebsocketServer(port=port)
        self.person_counter = person_counter

        self.person_counter.deepsort.customer_count_change_callback = self.publish_customer_count
        self.person_counter.missing_mask_callback = self.publish_missing_mask
    
    def start(self):
        self._wss.run_forever(threaded=True)

    def publish_customer_count(self):
        payload = {
            "message_type": "customer_count_change",
            "content": {
                "current_customer_count": self.person_counter.deepsort.customers_inside,
                "maximal_customer_count": self.person_counter.max_customer_count,
            }
        }
        self._wss.send_message_to_all(json.dumps(payload))
    
    def publish_missing_mask(self):
        payload = {
            "message_type": "missing_mask_detected",
            "content": {}
        }
        self._wss.send_message_to_all(json.dumps(payload))
