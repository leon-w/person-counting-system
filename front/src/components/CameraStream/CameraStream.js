import * as React from 'react';

class CameraStream extends React.Component {

    render(){
        return <img src="http://127.0.0.1:9000/api/video_stream" alt="stream" style={{maxWidth: "100%"}}/>
    }
}

export default CameraStream;