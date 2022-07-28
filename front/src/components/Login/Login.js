import * as React from "react";
import { FormGroup,TextField, Box, Card, FormControl, Typography, Grid, Button} from "@mui/material";
import './Login.css'
import {useAuth} from '../../auth/auth.js'
import { useNavigate, useLocation } from 'react-router-dom'
import Logo from '../../assets/Logo.svg'


function Login(){

    const navigate = useNavigate();
    const auth = useAuth();
    let location = useLocation();
    let from = location.state?.from?.pathname || "/";
    if (from==="login") from = "/"
    const handleLogin = () => {
        auth.signin(() => {
            // Send them back to the page they tried to visit when they were
            // redirected to the login page. Use { replace: true } so we don't create
            // another entry in the history stack for the login page.  This means that
            // when they get to the protected page and click the back button, they
            // won't end up back on the login page, which is also really nice for the
            // user experience.
            navigate(from, { replace: true });
          });
    };

    return (
        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height:500, m:2}}>
            <Card id="login-card">
                <Typography variant="h3" noWrap component="div"> Sign in </Typography>
                <Box>
                    <img src={Logo} alt="logo" height="150px"/>
                </Box>
                <FormControl fullWidth={true}>
                    <FormGroup >
                        <TextField required label="Login" variant="outlined" sx={{m:1}}></TextField>
                        <TextField required label="Password" variant="outlined" sx={{m:1}}
                        type="password"></TextField>
                    </FormGroup>
                </FormControl>
                <Grid container sx={{justifyContent: 'center',m:1}}>
                    <Grid item>
                        <Button type='submit' variant="contained" color="primary" onClick={handleLogin}>Login</Button>
                    </Grid>
                </Grid>
            </Card>
        </Box>
    );
}

export default Login