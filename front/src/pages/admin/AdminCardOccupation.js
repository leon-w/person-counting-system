import * as React from 'react';
import { Card, Typography,Box, Fab, Button } from '@mui/material';
import { OccupationCircle } from '../../components/OccupationComponents/OccupationCircle';
import { OccupationProportion } from '../../components/OccupationComponents/OccupatonProportion';
/** import OccupationService from '../../services/OccupationService'; */
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import OccupationContext from '../../services/OccupationContext';



class AdminCardOccupation extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            person: 0,
            maxPerson: 100,
            isModificationOpen: false,
            newPerson: 0
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
            <Card sx={{p: 3, m:1}}>
                <Typography variant="h5">
                    Occupation
                </Typography>
                <Box sx={{display: "flex", p: 2, justifyContent: "space-around", alignItems: "center"}}>
                    <OccupationCircle person={this.state.person} maxPerson={this.state.maxPerson} width={180}/>
                    <OccupationProportion person={this.state.person} maxPerson={this.state.maxPerson}/>
                </Box>
                <Box sx={{display: "flex", gap:2, justifyContent:"end"}}>
                    <Box sx={{display: this.state.isModificationOpen?"flex":"none", gap:1}}>
                        <Button variant="outlined" onClick={()=>{this.validateModificationOccupation()}}>OK</Button>
                        <Button variant="outlined" onClick={()=>{this.cancelModificationOccupation()}}>Cancel</Button>
                    </Box>
                    <Box sx={{display: this.state.isModificationOpen?"flex":"none", gap:2, justifyContent: "center", alignItems: "center"}}>
                        Change to {this.state.newPerson} ?
                    </Box>
                    <Box sx={{display: "flex", gap:2}}>
                        <Fab color="primary" aria-label="plus" onClick={()=>{this.modifyOccupation(1)}}>
                            <AddIcon />
                        </Fab>
                        <Fab color="secondary" aria-label="less" onClick={()=>{this.modifyOccupation(-1)}}>
                            <RemoveIcon />
                        </Fab>
                    </Box>
                    
                </Box>
            </Card>
        )
    }
    /**
     * Modify locally the number of person
     * @param {*} personToAdd 
     */
    modifyOccupation(personToAdd){
        if(this.state.isModificationOpen){
            this.setState({newPerson: Math.max(0, this.state.newPerson + personToAdd)});
        }else{
            this.setState({newPerson: this.state.person + personToAdd, isModificationOpen: true})
        }
    }
    /**
     * validate the new number of person to the server
     */
    validateModificationOccupation(){
        this.occupationService.overrideCounter(this.state.newPerson);
        this.setState({isModificationOpen: false});
    }
    /**
     * Cancel the local new number of person
     */
    cancelModificationOccupation(){
        this.setState({isModificationOpen: false});
    }
}

export default AdminCardOccupation;