import { Card, Container, Box, Typography } from '@mui/material';
import * as React from 'react';
import CameraConfiguration from '../../components/Settings/CameraConfiguration/CameraConfiguration';
import GeneralConfiguration from '../../components/Settings/GeneralConfiguration/GeneralConfiguration';

function Settings(){
    return(
    <Container sx={{justifyContent: "center", mt: "10px"}}>
        <Typography variant="h4">
            Settings
        </Typography>
        <Box sx={{display: "flex", justifyContent: "center", m:"10px"}}>
            <Card sx={{width:"100%", p:2}}>
                <Typography variant="h6"> General configuration</Typography>
                <GeneralConfiguration/>
            </Card>
        </Box>
        <Box sx={{display: "flex", justifyContent: "center", m:"10px"}}>
            <Card sx={{width:"100%", p:2}}>
                <Typography variant="h6"> Camera configuration</Typography>
                <CameraConfiguration/>
            </Card>
        </Box>
    </Container>
    );
}

export default Settings;