import * as React from 'react'
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";

export class OccupationCircle extends React.Component{

    render(){
        let percent = Math.floor(100*this.props.person/this.props.maxPerson);
        let status = "ok";
        if (percent >= 80){
            status = "full";
        }else if (percent>=60){
            status = "half"
        }
        return (
            <Progress 
            type="circle"
            percent={percent}
            width = {this.props.width}
            status= {status}
            theme = {{
                full:{
                    symbol: percent + '%',
                    trailColor: '#F08080',
                    color: 'red'
                },
                half:{
                    symbol: percent + '%',
                    trailColor: 'yellow',
                    color: 'orange'
                },
                ok:{
                    symbol: percent + '%',
                    trailColor: '#ADD8E6',
                    color: 'blue'
                }
                
            }}
            
            />
        )
    }
}