import { Box } from "@mui/system";
import * as React from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';

ChartJS.register(
CategoryScale,
LinearScale,
PointElement,
LineElement,
Title,
Tooltip,
Legend
);


export const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'chartArea',
      },
      title: {
        display: true,
        text: 'Today attendance',
      },
    },
  };
  
  const labels = ["0h", "1h", "2h", "3h", "4h", "5h", "6h", "7h", "8h", "9h","10h" ,"11h","12h","13h","14h","15h","16h","17h","18h","19h","20h","21h","22h","23h","00h"]
  
  export const data = {
    labels,
    datasets: [
      {
        label: 'Today',
        data: [0,0,0,0,0,0,0,0,2,5,8,20,18,10,17,28,26,29],//labels.map(() => 10),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.6,
        fill:true,
      },
      {
        label: 'Expectation',
        data: [0,0,0,0,0,0,0,0,3,5,11,18,20,22,24,26,25,23,20,18,10,5,0,0,0],
        fill:true,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.6
      },
    ],
  };

class AttendanceChart extends React.Component{
    
    constructor(props){
        super(props)
        this.state = {
            attendanceData : {}
        }
    }

    render(){

        return(
            <Box>
                <Line
                data={data}
                options={options}
                ></Line>
            </Box>
        )
    }
}

export default AttendanceChart;