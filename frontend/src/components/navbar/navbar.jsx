import React, { useState, useEffect } from "react";
import HomeIcon from "@material-ui/icons/Home";
import SearchBar from '../search/search_bar';

import { makeStyles } from "@material-ui/core/styles";

import {
  AppBar, Toolbar, Typography, Button, IconButton
} from '@material-ui/core';

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

export default function NavBar({city, state, c}) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar color="transparent" position="sticky">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <HomeIcon />
          </IconButton>
          {/* <Typography variant="h6" className={classes.title}>
            News
          </Typography> */}
          <SearchBar city={city} state={state} c={c} />
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}