import React, { useState, useEffect } from "react";
import HomeIcon from "@material-ui/icons/Home";
import SearchBar from '../search/search_bar';

import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, IconButton, Link,
  Menu, MenuItem
} from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle'


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
}));

export default function NavBar({city, state, c, loggedIn, logout, openModal, currentUser}) {
  const classes = useStyles();
  const history = useHistory();

  const getLinks = () => {
    if (loggedIn) {
      return (
        <div>
          {/*<Button onClick={() => props.logout()} color="inherit">*/}
          {/*  Logout*/}
          {/*</Button>*/}
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={open}
            onClose={handleClose}
          >
            <MenuItem
              key="username"
              disabled
            >
              {currentUser.name}
            </MenuItem>
            <MenuItem
              key="logout"
              onClick={() => {
                setAnchorEl(null)
                logout()
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </div>
      );
    } else {
      return (
        <div>
          <Button
            // href="#/login"
            color="inherit"
            onClick={() => openModal('login')}
          >
            Login
          </Button>
          <Button
            // href="#/signup"
            color="inherit"
            onClick={() => openModal('signup')}
          >
            Register
          </Button>
        </div>
      );
    };
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  };

  const handleClose = () => {
    setAnchorEl(null)
  };

  const handleHomeClick = () => {
    history.push("/");
  };

  return (
    <div className={classes.root}>
      <AppBar color="transparent" position="sticky">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={handleHomeClick}
          >
            <HomeIcon />
          </IconButton>
          {/* <Typography variant="h6" className={classes.title}>
            News
          </Typography> */}
          <SearchBar city={city} state={state} c={c} />
          {/* <Button color="inherit">Login</Button> */}
          {getLinks()}
        </Toolbar>
      </AppBar>
    </div>
  );
}