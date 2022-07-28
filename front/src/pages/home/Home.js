import * as React from 'react';
import { Container, Box, Typography } from '@mui/material';
import Clock from '../../components/Clock/Clock';
import { OccupationCircle } from '../../components/OccupationComponents/OccupationCircle';
import { OccupationProportion } from '../../components/OccupationComponents/OccupatonProportion';
import AttendanceChart from '../../components/Charts/AttendanceChart';
import OccupationContext from '../../services/OccupationContext';

export class Home extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            person: 30,
            maxPerson: 50,
            welcomeMessage: "Welcome to the Museu Nacional d'Art de Catalunya"
        }
    }

    static contextType = OccupationContext;

    componentDidMount(){
        const callbackCustomerChange = (current_customer_count, maximal_customer_count)=>{
            this.setState({
                person: current_customer_count,
                maxPerson: maximal_customer_count
            });
        };

         /** @type {OccupationService} */
         this.occupationService = this.context;
         this.occupationServiceCallback = [];
         this.occupationServiceCallback.push(this.occupationService.addCallbackCustomerChange(callbackCustomerChange));
    }

    componentWillUnmount(){
        this.occupationServiceCallback.forEach((index)=> this.occupationService.removeCallbackCustomerChange(index))
    }

    render(){
        return (
        <Container>
            <Box sx={{display: "flex", justifyContent: "space-between", flexWrap:"wrap", mb:3, mt:3}}>
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
            <Box>
                <Box sx={{display:"flex",flexDirection: "column"}}>
                    <Box sx={{display:"flex",justifyContent: "space-around", alignItems: "center", flexWrap:"wrap"}}>
                        <OccupationCircle person={this.state.person} maxPerson={this.state.maxPerson} width={300}/>
                        <OccupationProportion person={this.state.person} maxPerson={this.state.maxPerson}/>
                    </Box>
                    
                </Box>
            </Box>
            <Typography variant="h6">Attendance</Typography>
            <Box sx={{mr:10,ml:10, mb:10}}>
                <AttendanceChart/>
            </Box>
        </Container>
        );
    }
}

export default Home;