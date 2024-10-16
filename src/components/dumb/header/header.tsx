'use client';

import { useAuthContext } from "@/context/auth/AuthContext";
import styles from './header.module.scss';
import { AppBar, Avatar, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import AdbIcon from '@mui/icons-material/Adb';
import React from 'react';
import { Colors } from "@/app/assets/theme/colors";
import { HOME_ROUTES, LOGIN_ROUTES } from "@/utils/routes";
import { useRouter } from "next/navigation";

const pages = ['home', 'agendamento', 'contato'];
const settings = ['meus dados', 'meus agendamentos', 'notificações'];

export default function Header() {
  const router = useRouter();
  const {userAuth, logout} = useAuthContext();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    userAuth ? setAnchorElUser(event.currentTarget) : router.push(LOGIN_ROUTES);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleLogout = () => {
    setAnchorElNav(null);
    logout();
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return(
    <header className={styles.header}>
      <AppBar position="static" sx={{boxShadow: 'none', background:'none', color: Colors.primary}}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href={HOME_ROUTES}
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              LOGO
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
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
                sx={{ display: { xs: 'block', md: 'none' } }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography 
                      sx={{ 
                        textAlign: 'center',
                        textDecoration: 'none',
                        textTransform: 'capitalize',
                        color: Colors.primary 
                      }} 
                      noWrap
                      component="a"
                      href={page === 'home' ? '/' : '/' + page}>
                        {page}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href={HOME_ROUTES}
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              LOGO
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: Colors.primary, display: 'block' }}
                >
                  {page}
                </Button>
              ))}
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar 
                    alt={userAuth ? userAuth.displayName : ''} 
                    src={userAuth ? userAuth.photoURL : 'L'} 
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-user"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography 
                      sx={{ 
                      textAlign: 'center',
                      textDecoration: 'none',
                      textTransform: 'capitalize',
                      color: Colors.primary 
                      }}
                      component="a"
                      href={'/' + setting.replace(/[- ]/g, "-")}
                    >{setting}</Typography>
                  </MenuItem>
                ))}
                <MenuItem key='sair' onClick={handleLogout}>
                  <Typography 
                    sx={{ 
                    textAlign: 'center',
                    textDecoration: 'none',
                    textTransform: 'capitalize',
                    color: Colors.primary 
                    }}
                  > Sair</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </header>
  );
}