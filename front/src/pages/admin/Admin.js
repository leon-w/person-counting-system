import * as React from 'react';
import { Grid, Container } from '@mui/material';
import AdminCardCamera from './AdminCardCamera';
import AdminCardOccupation from './AdminCardOccupation';
import AdminCardMask from './AdminCardMask';

function Admin(){
    return (
        <Container fixed sx={{p: 3}}>
            <Grid container xs="auto" direction="row">
                <Grid item sx={{width: "60%"}}>
                    <AdminCardCamera/>
                </Grid>
                <Grid container item direction="column" sx={{width: "40%"}}>
                        <AdminCardOccupation/>
                        <AdminCardMask/>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Admin;