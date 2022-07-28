import * as React from 'react'
import { Box, Typography } from '@mui/material'
export class OccupationProportion extends React.Component{

    render(){
        return (
        <Box sx={{display: "flex", height: '8em', m: 2}}>
                <Typography variant="h3" sx={{fontWeight:"light"}}>{this.props.person}</Typography>
                <Box style={{
                    height: "8rem", 
                    width: 2, 
                    backgroundColor: "black",
                    transform: "rotate(30deg)"
                    }}></Box>
                <Typography variant="h3" sx={{
                    fontWeight:"light", 
                    transform: "translate(0, 4rem)"}}
                >{this.props.maxPerson}</Typography>
                <Typography sx={{
                    fontWeight:"light", 
                    transform: "translate(0, 5.5rem)",
                    ml: 1}}
                >of occupation</Typography>
        </Box>
        )
    }
}