import * as React from 'react';
import { Container, Box, Typography, Button, Card } from '@mui/material';
import Clock from '../../components/Clock/Clock';
import { OccupationCircle } from '../../components/OccupationComponents/OccupationCircle';
import { OccupationProportion } from '../../components/OccupationComponents/OccupatonProportion';
import SignStop from '../../assets/sign_stop.png';
import SignOk from '../../assets/sign_ok.png';
import SignMask from '../../assets/sign_mask.png';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import './EntraceScreen.css';
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import OccupationService from '../../services/OccupationService';
import OccupationContext from '../../services/OccupationContext';



export class EntranceScreen extends React.Component{

    constructor(props){
        super(props);
        
        this.state = {
            person: 0,
            maxPerson: 100,
            welcomeMessage: "Welcome",// to the Museu Nacional d'Art de Catalunya",
            maskForgotten: false
        }

        this.currentMaskForgotten = 0;
    }

    static contextType = OccupationContext;

    componentDidMount(){
        const callbackCustomerChange = (current_customer_count, maximal_customer_count)=>{
            this.setState({
                person: current_customer_count,
                maxPerson: maximal_customer_count
            });
        };

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
         this.occupationServiceCallback = [];
         this.occupationServiceCallback.push(this.occupationService.addCallbackCustomerChange(callbackCustomerChange));
         this.maskCallback = [];
         this.maskCallback.push(this.occupationService.addCallbackMask(callbackMask));

    }

    componentWillUnmount(){
        this.occupationServiceCallback.forEach((index)=> this.occupationService.removeCallbackCustomerChange(index))
        this.maskCallback.forEach((index)=> this.occupationService.removeCallbackMask(index))
    }


    render(){
        return (
        <Container>
            <FullScreenBox>
                <Box sx={{display: "flex", justifyContent: "space-between", flexWrap:"wrap", mb:3}}>
                    <Box sx={{display: "flex"}}>
                        <Typography variant="h5" component="div">
                            {this.state.welcomeMessage}
                        </Typography>
                    </Box>
                    <Box sx={{display: {xs: "none", md: "flex"}}}>
                        <Clock/>
                    </Box>
                </Box>
                <Typography variant="h6">Occupation</Typography>

                <Box sx={{display:"flex",justifyContent: "center", alignItems: "center", flexWrap:"wrap", mb:3, gap:20}}>
                    <OccupationCircle person={this.state.person} maxPerson={this.state.maxPerson} width={350}/>
                    <OccupationProportion person={this.state.person} maxPerson={this.state.maxPerson}/>
                </Box>

                <Sign canEnter={!this.isFull()}/>
                <Box sx={{display:this.isFull()?"none": "none", justifyContent: "center", alignItems:"center", gap:2}}>
                    <QueryBuilderIcon sx={{ fontSize: 70 }}></QueryBuilderIcon>
                    <Typography variant="h5">Please wait approximately {3} minutes</Typography>
                </Box>

                <Box sx={{display:"flex", alignItems: "center", flexWrap:"wrap", justifyContent: "center", gap:2, mb:3}}>
                    <img src={SignMask} alt="sign_mask" width="90"/>
                    <Box sx={{display:this.maskForgotten()?"none":"flex"}}>
                        <Typography variant="h5"> For our safety, please wear a mask and respect social distancing.</Typography>
                    </Box>
                    <Box sx={{display:this.maskForgotten()?"flex":"none"}}>
                        <Typography variant="h3" color="error" className="blink"> Attention, you forgot to wear your mask !</Typography>
                    </Box>
                </Box>
            </FullScreenBox>
        </Container>
        );
    }

    isFull(){
        return this.state.person >= this.state.maxPerson;
    }

    maskForgotten(){
        return this.state.maskForgotten;
    }
}

function Sign(props){
    
    let sign = props.canEnter ? SignOk : SignStop;
    let message = props.canEnter ? "Please enter": "It is full, sorry...";

    return (
        <Box sx={{display: "flex", justifyContent: "center", alignItems:"center", gap:2, mb:3}}>
                <img src={sign} alt="sign" width="160"/>
                <Typography variant="h2"> {message} </Typography>
        </Box>
    );
}

function FullScreenBox({ children }){
    const handleFullScreen = useFullScreenHandle();

    return (
        <div>
            <Box sx={{display: "flex", p:2, justifyContent: "right"}}>
                <Button onClick={handleFullScreen.enter}
                    variant="outlined">
                    Show in fullscreen
                </Button>
            </Box> 
            <Card sx={{p: 2, mb: 3}}>
                <FullScreen handle={handleFullScreen}>
                    <Box>
                        { children }
                    </Box>
                </FullScreen>
            </Card>
        </div>
      );

}

export default EntranceScreen;