import * as React from 'react';
import { Card, Typography,Box, Button } from '@mui/material';
import SignMask from "../../assets/sign_mask.png"
import OccupationContext from '../../services/OccupationContext';
import './AdminCardMask.css'

class AdminCardMask extends React.Component{

    constructor(props){
        super(props);
        this.state = {maskForgotten: false};
        this.currentMaskForgotten = 0;
    }

    static contextType = OccupationContext;

    componentDidMount(){

        const callbackMask = () => {
            this.currentMaskForgotten ++; 
            this.setState({maskForgotten: true});

            setTimeout(()=>{
                this.currentMaskForgotten--;
                if (this.currentMaskForgotten===1){
                    this.setState({maskForgotten: false});
                }
            }, 2000)
        }

         /** @type {OccupationService} */
         this.occupationService = this.context;
         this.maskCallback = [];
         this.maskCallback.push(this.occupationService.addCallbackMask(callbackMask));
    }

    componentWillUnmount(){
        this.maskCallback.forEach((index)=> this.occupationService.removeCallbackMask(index))
    }

    render(){

        return (
            <Card sx={{p: 3, m:1}}>
                <Typography variant="h5">
                    Mask
                </Typography>
                <Box sx={{display: "flex", p: 2, justifyContent: "space-around", alignItems: "center", flexWrap:"wrap", alignContent:"center", gap:1}}>
                    <img src={SignMask} width="80" alt="mask"/>
                    <Box sx={{display: this.state.maskForgotten ? "flex" : "none", alignItems: "center", gap: 2}}>
                        <Typography color="error" className="blink" >Someone detected without mask</Typography> 
                    </Box>
                    <Box sx={{display: this.state.maskForgotten ? "none" : "flex", alignItems: "center", gap: 2}}>
                        <Typography >No one without mask is detected.</Typography> 
                    </Box>
                </Box>
            </Card>
        )
    }
}

export default AdminCardMask;