import { Container, Box, Typography } from '@mui/material';
import * as React from 'react';
import AttendanceChart from '../../components/Charts/AttendanceChart';

class Statistics extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            averageTimeSpent : 65
        }
        this.backend = "http://127.0.0.1:9000/api"
    }

    componentDidMount(){
        this.updateAverageTime();

        this.averageTimeout = setTimeout(()=> {this.updateAverageTime()},60000);
    }

    componentWillUnmount(){
        clearTimeout(this.averageTimeout)
    }

    render(){
        return (
            <Container>
                <Typography variant="h6">General</Typography>
                <Box sx={{m:10, display: "flex", gap:4, alignItems:"center", justifyContent: "center"}}>
                    <Typography variant="h3"> {Math.floor(this.state.averageTimeSpent/60)} min {Math.floor(this.state.averageTimeSpent%60)} s</Typography>
                    <Typography> spent in average by passers-by.</Typography>
                </Box>
                <Typography variant="h6">Attendance</Typography>
                <Box sx={{mr:10,ml:10, mb:10}}>
                    <AttendanceChart/>
                </Box>
            </Container>
            )
    }

    updateAverageTime(){
        fetch(this.backend+'/get_customer_time_spent_inside').then(res => res.json())
        .then(
          (result) => {
            this.setState({
                averageTimeSpent: result.average
            })
            console.log(result);
          },
          (error) => {
            console.log("Error from server : ", error)
            this.setState({
                //strongError: error
            });
          }
        )
    }
}

export default Statistics;