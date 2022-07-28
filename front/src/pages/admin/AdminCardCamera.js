import * as React from 'react';
import CameraStream from '../../components/CameraStream/CameraStream';
import { Card, Typography,Box } from '@mui/material';

class AdminCardCamera extends React.Component{
    
    render(){

        return (
            <Card sx={{p: 1, m:1}}>
                <Typography variant="h5">
                    Security Camera
                </Typography>
                <Box sx={{p: 1}}>
                    <CameraStream/>
                </Box>
            </Card>
        )
    }
}

export default AdminCardCamera;