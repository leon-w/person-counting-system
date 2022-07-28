import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
// import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom' 
import { useAuth } from '../../auth/auth.js';
import Logo from '../../assets/Logo2.svg';
import SettingsIcon from '@mui/icons-material/Settings';


const pages = [{name: 'Home', route:'/'}
              ,{name :'Admin Screen', route:'/admin'},
              {name: 'Statistics', route: '/statistics'}, 
              {name: 'Entrance screen', route:'/entrance-screen'}];

function Banner(props) {

  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = (route) => {
    navigate(route)
    setAnchorElNav(null);
  };

    return (
        <AppBar position="static">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Box sx={{ mr:2, display: { xs: 'none', md: 'flex' } }}>
                <img src={Logo} alt="logo" height="80px"/>
              </Box>
    
              <Box sx={{ flexGrow: 2, display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: 'block', md: 'none' },
                  }}
                >
                  {pages.map((page) => (
                    <MenuItem key={page.name} onClick={()=>{handleCloseNavMenu(page.route)}}>
                      <Typography textAlign="center">{page.name}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
              <Box sx={{flexGrow: 2, display: { xs: 'flex', md: 'none' }, justifyContent:"center" }}>
                <img src={Logo} alt="logo" height="80px"/>
              </Box>
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                {pages.map((page) => (
                  <Button
                    key={page.name}
                    onClick={()=>{handleCloseNavMenu(page.route)}}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                  >
                    {page.name}
                  </Button>
                ))}
              </Box>
              
            <RightMenu/>
              
            </Toolbar>
          </Container>
        </AppBar>
      );
};

function RightMenu(){
  let navigate = useNavigate();
  let auth = useAuth();

  if (!auth.user){
    return (
        <Box sx={{ flexGrow: 1, marginLeft: 2, justifyContent: "end",display: "flex"}}>
          <Button color="inherit" variant="outlined"
            onClick={()=>navigate("/login")}>Log In</Button>
        </Box>
      );
  }else{
    return (
      <Box sx={{ flexGrow: 1, marginLeft: 2, justifyContent: "end", display: "flex", gap:1}}>
        <IconButton onClick={()=>{navigate("/settings")}}>
          <SettingsIcon sx={{color: "white"}}></SettingsIcon>
        </IconButton>
        <Button color="inherit" variant="outlined"
          onClick={()=>{auth.signout(()=>{navigate("/")})}}>Log Out</Button>
      </Box>
    );   
  }
  
}

export default Banner