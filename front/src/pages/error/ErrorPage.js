import { Container, Typography, Box } from '@mui/material';
import * as React from 'react';

function ErrorPage(){
    return (
    <Container sx={{m:5}}>
        <Box sx={{display: "flex", justifyContent: "center"}}>
            <Typography variant="h1" sx={{color: "#002845"}}>Server Error</Typography>
        </Box>
        <Box sx={{display: "flex", justifyContent: "center"}}>
            <Typography variant="h5"> Sorry, something went wrong... Please try to restart the server</Typography>
        </Box>
        
    </Container>
    )
}

export default ErrorPage;