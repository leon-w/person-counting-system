# Person Counting System

System to automatically track the number of people inside a closed space.
Optionally also detect (missing) masks.


![Sample Detection](https://github.com/user-attachments/assets/b346235a-debf-4212-8f2f-a695608742e8)
![Home Page](https://user-images.githubusercontent.com/29836160/181562785-5e400e27-c34b-40ef-84a5-8adb767d92db.png)
![Admin Screen](https://user-images.githubusercontent.com/29836160/181562767-a1c53a06-90c5-4819-9c67-97adea05e984.png)
![Statistics](https://user-images.githubusercontent.com/29836160/181562748-50aea75f-c070-4f6b-a929-fbaf08ab3343.png)
![Entrance Screen](https://user-images.githubusercontent.com/29836160/181562721-cf3ccea6-b646-4bf0-855a-f442d7113331.png)
![Settings](https://user-images.githubusercontent.com/29836160/181562672-ddc176c2-3135-4a0b-b0f2-971d61d74a0d.png)

## Backend REST API

-   The REST API is located at `http://127.0.0.1:9000/api/xxx`

### GET `/api/get_customer_count`

```json
{
    "current_customer_count": 10,
    "maximal_customer_count": 50
}
```

### POST `/api/set_maximal_customer_count?maximal_customer_count=11`

```json
{
    "success": true,
    "new_maximal_customer_count": 11
}
```

### POST `/api/set_customer_count_override?customer_count=0`

Override the customers inside, will also trigger the websocket broadcast.

```json
{
    "success": true,
    "new_customer_count": 0
}
```

### GET `/api/video_stream`

[image stream, use as value for src attribute of img tag, NOT video!]

```html
<img src="/api/video_stream" />
```

### GET `/api/camera_image`

[jpg image of the camera without any annotations, used as the background for the barrier selection]

```html
<img src="/api/camera_image" />
```

### GET `/api/get_barrier`

```json
{
    "p1_x": 0,
    "p1_y": 1,
    "p2_x": 1,
    "p2_y": 1,
    "side_switched": false
}
```

### POST `/api/set_barrier?p1_x=0&p1_y=1&p2_x=1&p2_y=1&side_switched=false`

```json
{
    "success": true,
    "p1_x": 0,
    "p1_y": 1,
    "p2_x": 1,
    "p2_y": 1,
    "side_switched": false
}
```

### POST `/api/mask_detection`

Check if mask detection is enabled.

```json
{
    "enabled": true
}
```

### POST `/api/set_mask_detection?enabled=true`

Enable/Disable mask detection.

```json
{
    "success": true,
    "enabled": true
}
```

### GET `/api/get_customer_time_spent_inside`

Amount of time users spent inside (in seconds).

```json
{
    "average": 749.0221,
    "history": [
        123.1023,
        923.9201,
        ...
    ]
}
```

## Websocket

-   The websocket can be accessed via `ws://127.0.0.1:9001`

The websocket does not require any special initialization, it will simply broadcast all messages to any connected client.

Types of messages:

### `customer_count_change`

```json
{
    "message_type": "customer_count_change",
    "content": {
        "current_customer_count": 11,
        "maximal_customer_count": 50
    }
}
```

### `missing_mask_detected`

Notify the frontend that a missing mask was detected so a reminder can be displayed for a short moment.

```json
{
    "message_type": "missing_mask_detected",
    "content": {}
}
```
