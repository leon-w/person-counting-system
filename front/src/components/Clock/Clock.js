import { Typography } from "@mui/material";
import * as React from "react";

class Clock extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            time : getTime()
        }
    }

    componentDidMount(){
        this.interval = setInterval(()=>{
            this.setState({time: getTime()})
        }, 60000)
    }

    componentWillUnmount(){
        clearInterval(this.interval);
    }

    render() {
        return (
            <Typography variant="h4">
                {this.state.time.hour+" : "+this.state.time.min} 
            </Typography>
        );
    }
}

function getTime(){
    let date = new Date();

    return {hour: toTwoDigit(date.getHours()), min: toTwoDigit(date.getMinutes())}
}

function toTwoDigit(number){
    return ("0"+String(number)).slice(-2);
}

export default Clock;