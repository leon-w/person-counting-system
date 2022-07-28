import { Box, Button, Skeleton } from '@mui/material';
import * as React from 'react';
import { Navigate } from "react-router-dom";

class CameraConfiguration extends React.Component{

    constructor(props) {
        super(props);
        this.state = { 
            x1: 100, y1: 200, x2: 130, y2: 700,
            isRightDirection: true,
            isEdition: false,
            isFirstPoint: true,
            dimensions: {width:800,height:500},
            isLoaded: true,
            error: null,
            strongError: null,
        };
        this.barrerPoint = null;
        this.onImgLoad = this.onImgLoad.bind(this);
        this.canvas =  React.createRef();
        this.camera =  React.createRef();
        this.backend = "http://127.0.0.1:9000/api"
    }

    componentDidMount() {
        // Draw on the canvas
        this.ctx = this.canvas.current.getContext("2d");
        // call the api for the barrier points + Left/Right
        fetch(this.backend+'/get_barrier').then(res => res.json())
        .then(
          (result) => {
            const {width, height} = this.state.dimensions;
            this.setState({
                x1: result.p1_x * width, y1: result.p1_y * height,
                x2: result.p2_x * width, y2: result.p2_y * height,
                isRightDirection: result.side_switched,
                isLoaded: true,

            })
            console.log(result);
            this.drawFrontier()
          },
          (error) => {
            console.log("Error from server : ", error)
            this.setState({
                //strongError: error
            });
          }
        )
        this.drawFrontier();
    }

    render(){
        if (this.state.strongError) return <Navigate to={"/error"} />
        const {width, height} = this.state.dimensions;
        //console.log(width,height);
        this.drawFrontier();
        return (
            <Box>
                
                <Box sx={{display: this.state.isLoaded?"flex":"none", justifyContent: "center", m:2}}>
                    <Box sx={{position: "absolute", zIndex: 1}}>
                        <img ref={this.camera} onLoad={this.onImgLoad} src={this.backend+"/camera_image"} alt="stream" style={{maxWidth: "100%", width: 800}}/>
                    </Box>
                    <canvas ref={this.canvas} width={width} height={height} style={{border:"1px solid #000000", zIndex: 2}}
                    onClick={this.onMouseClick.bind(this)}></canvas>
                </Box>
                <Box sx={{display: this.state.isLoaded?"none":"flex", justifyContent: "center", m:2}}>
                    <Skeleton variant="rectangular" width={800} height={500} />
                </Box>
                
                <Box sx={{display: "flex", gap:5, justifyContent: "space-between", alignItems: "center"}}>

                    <Box sx={{display: this.state.isEdition ? 'block': 'none'}}>
                        <Button variant="outlined"  onClick={()=> this.onClickCancel()}>{'Cancel'}</Button>
                    </Box>

                    <Box>
                        <Button variant="outlined" sx={{display: this.state.isEdition ? 'block': 'none'}} onClick={()=> this.onClickValidate()}>{'Validate'}</Button>
                        <Button variant="outlined" sx={{display: this.state.isEdition ? 'none': 'block'}} onClick={()=> this.onClickEdition()}>{'Edit'}</Button>
                    </Box>

                    <Box>
                        <Button sx={{display: this.state.isEdition ? "block":"none"}} variant="outlined" onClick={()=> this.onClickSwitchArea()}>Switch area</Button>
                    </Box>
                    
                    <Box>
                        <Box sx={{backgroundColor: 'rgb(14, 0, 255,0.3)', border: "1px solid black",
                                display: "flex", justifyContent: "center", alignItems: "center", p: "5px"}}>
                            Inside
                        </Box>
                        <Box sx={{border: "1px solid black", display: "flex", justifyContent: "center", alignItems: "center", p: "5px"}}>
                            Outside
                        </Box>
                    </Box>
                </Box>
            </Box>
        );
    }

    onImgLoad(event) {
        console.log("IMAGE LOADED")
        this.setState(
            {dimensions:
                {width: event.target.offsetWidth,
                height: event.target.offsetHeight,
                }
            });
    }

    /**
     * Active the edition of the frontier
     */
    onClickEdition(){
        this.savedValue = {x1: this.state.x1, y1: this.state.y1, x2: this.state.x2, y2: this.state.y2,
        isRightDirection: this.state.isRightDirection}
        this.setState({isEdition: true, isFirstPoint: true});
    }

    /**
     * 
     * Validate the edition and send to the backend
     */
    onClickValidate(){
        this.setState({isEdition: false});
        const {width, height} = this.state.dimensions;
        let x1 = this.barrerPoint.x1 / width;
        let x2 = this.barrerPoint.x2 / width;
        let y1 = this.barrerPoint.y1 / height;
        let y2 = this.barrerPoint.y2 / height;
        console.log(x2)
        // Send the value to babck end with API
        let url = this.backend + `/set_barrier?p1_x=${x1}&p1_y=${y1}&p2_x=${x2}&p2_y=${y2}&side_switched=${this.state.isRightDirection}`;
        fetch(url, {method: "POST"}).then(res => res.json())
        .then(
          (result) => {
            //TODO : If not valid
            console.log(result);
          },
          (error) => {
              //console.log("Error from server : ", error)
            // this.setState({
            //   strongError: error
            // });
          }
        )
    }

    /**
     * 
     * Cancel the edition and reload initals value
     */
     onClickCancel(){
        this.setState({isEdition: false});
        // Replace the barrer corectly
        this.setState({x1: this.savedValue.x1, y1: this.savedValue.y1, x2: this.savedValue.x2, y2: this.savedValue.y2,
            isRightDirection: this.savedValue.isRightDirection,})
    }
    
    /**
     * Switch the two different area
     */
     onClickSwitchArea(){
        this.setState({isRightDirection: !this.state.isRightDirection})
    }

    /**
     * Click on the canvas to change the frontier if the edition is activated
     * @param {*} event 
     * @returns 
     */
    onMouseClick(event){
        if (!this.state.isEdition) return;
        let x = "x1";
        let y = "y1";
        if (!this.state.isFirstPoint){
            x = "x2";
            y="y2";
        }
        this.setState({[x]: event.nativeEvent.offsetX, [y]: event.nativeEvent.offsetY, isFirstPoint: !this.state.isFirstPoint})
    }

    /**
     * Draw the frontier inside the canvas
     * @returns 
     */
    drawFrontier(){
        if (!this.ctx) return;

        const x1 = this.state.x1;
        const y1 = this.state.y1;
        const x2 = this.state.x2; //(this.state.x2 === this.state.x1)&&(this.state.y2 === this.state.y1)?0: this.state.x2;
        const y2 = this.state.y2;
        const {width, height} = this.state.dimensions;
        const isRightDirection = this.state.isRightDirection;

        
        let sides = [
            {x1:0,y1:0, x2: width, y2: 0},
            {x1:width,y1:0, x2: width, y2: height},
            {x1:width,y1:height, x2: 0, y2: height},
            {x1:0,y1:height, x2: 0, y2: 0}];
        
        let intersections = []

        for (const side of sides){
            const intersection = this.intersection(x1,y1, x2, y2, side.x1, side.y1, side.x2, side.y2);
            if (intersection !== null) intersections.push(intersection);
        }
        this.barrerPoint = {x1: intersections[0].x,y1: intersections[0].y,x2: intersections[1].x,y2: intersections[1].y};

        this.ctx.clearRect(0,0,width,height);
        this.ctx.beginPath()
        console.log(x1,y1,x2,y2)
        console.log(intersections)
        this.ctx.moveTo(intersections[0].x, intersections[0].y);
        this.ctx.lineTo(intersections[1].x, intersections[1].y);
        this.ctx.stroke();

        const isInsideSide = (point,side) => {
            return ((Math.abs(side.x1 - point.x)<0.001 && Math.abs(side.x1 - side.x2)<0.001)||(Math.abs(side.y1 - point.y)<0.001 && Math.abs(side.y1 - side.y2)<0.001))
        };
        let indexFirstSide = 0;
        let indexLastSide = 0;
        let firstIntersection = intersections[isRightDirection?0:1];
        let lastIntersection = intersections[isRightDirection?1:0];

        
        for (let [index, side] of sides.entries()){
            if (isInsideSide(firstIntersection, side)) indexFirstSide = index;
            if (isInsideSide(lastIntersection, side)) indexLastSide = index;
        }

        this.ctx.beginPath();
        this.ctx.moveTo(firstIntersection.x, firstIntersection.y);
        for (let i = indexFirstSide; i%4 !== indexLastSide; i++){
            this.ctx.lineTo(sides[i%4].x2, sides[i%4].y2);
        }
        this.ctx.lineTo(lastIntersection.x, lastIntersection.y);
        this.ctx.fillStyle = 'rgb(14, 0, 255,0.3)';
        this.ctx.fill();
    }

    /**
     * Calculate the coordinates of the intersection between the line AB and the segment CD
     * @returns coordinates of the intersection
     */
    intersection(xa, ya, xb, yb, xc, yc, xd, yd){
        let det = (xb - xa)*(yc - yd) - (xc - xd)*(yb - ya)
        if (det === 0) return null;

        let t1 = ((xc - xa)*(yc - yd) - (xc - xd)*(yc - ya))/det;
        let t2 = ((xb - xa)*(yc - ya) - (xc - xa)*(yb - ya))/det;

        if (t2<0 || t2>1) return null;
        
        return ({x: xa+t1*(xb-xa), y: ya+t1*(yb-ya)});
    }
}

export default CameraConfiguration;