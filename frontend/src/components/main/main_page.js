import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import { Link as RouterLink } from "react-router-dom";
import SearchBar from '../search/search_bar';
import axios from "axios";

import { 
  Grid, Paper, Link, TextField, CircularProgress, Button, useMediaQuery
 } from "@material-ui/core";

import Autocomplete from "@material-ui/lab/Autocomplete";


import RestaurantIcon from "@material-ui/icons/Restaurant";
import ShoppingBasketIcon from "@material-ui/icons/ShoppingBasket";
import LocalBarIcon from "@material-ui/icons/LocalBar";
import RowingIcon from "@material-ui/icons/Rowing";
import SpaIcon from "@material-ui/icons/Spa";
import DriveEtaIcon from "@material-ui/icons/DriveEta";
import HomeIcon from "@material-ui/icons/Home";
import FlightTakeoffIcon from "@material-ui/icons/FlightTakeoff";

import GoogleMapReact from "google-map-react";

const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const categories = {
  "Restaurants": <RestaurantIcon />,
  "Shopping": <ShoppingBasketIcon />,
  "Nightlife": <LocalBarIcon />,
  "Active Life": <RowingIcon />,
  "Beauty & Spas": <SpaIcon />,
  "Automotive": <DriveEtaIcon />,
  "Home Services": <HomeIcon />,
  "Hotels & Travel": <FlightTakeoffIcon />
};

const fixedEncodeURIComponent = str => {
  return encodeURIComponent(str).replace(/[!'()*]/g, c => {
    return "%" + c.charCodeAt(0).toString(16);
  });
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 960,
    margin: "auto",
    marginTop: 20,
    marginBottom: 20,
    overflowX: "hidden",
  },

  searchRoot: {
    [theme.breakpoints.down("sm")]: {
      marginLeft: 8,
      marginRight: 8,
    },
  },

  categoriesRoot: {
    flexGrow: 1,
    marginBottom: 20,
    [theme.breakpoints.down("sm")]: {
      marginLeft: 8,
      marginRight: 8,
    },
  },

  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.primary,
  },
}));

export default function Main(props) {
  const classes = useStyles();
  const [map, setMap] = useState(null)
  // const [zoom, setZoom] = useState(13);
  // const [lat, setLat] = useState(37.7758);
  // const [lng, setLng] = useState(-122.435);

  const [city, setCity] = useState("Scottsdale");
  const [state, setState] = useState("AZ");
  const [c, setC] = useState(null);

  const [openFind, setOpenFind] = useState(false);
  const [optionsFind, setOptionsFind] = useState([]);
  const loadingFind = openFind && optionsFind.length === 0;

  const [openNear, setOpenNear] = useState(false);
  const [optionsNear, setOptionsNear] = useState([]);
  const loadingNear = openNear && optionsNear.length === 0;

  useEffect(() => {
    let active = true;

    if (!loadingFind) {
      return undefined;
    }

    if (optionsFind.length === 0) {
      (async () => {
        // axios.get(`/api/biz/${bizId}`);
        const response = await axios.get("/api/biz/categories");
        console.log(response);
        const categories = response.data;

        if (active) {
          setOptionsFind(categories);
        }
      })();
    }

    return () => {
      active = false;
    };
  }, [loadingFind]);

  useEffect(() => {
    let active = true;

    if (!loadingNear) {
      return undefined;
    }

    if (optionsNear.length === 0) {
      (async () => {
        const response = await axios.get("/api/biz/cities");
        console.log(response);
        const cities = response.data.map(
          datum => `${datum._id.city}, ${datum._id.state}`
        );

        if (active) {
          setOptionsNear(cities);
        }
      })();
    }

    return () => {
      active = false;
    };
  }, [loadingNear]);

  // useEffect(() => {
  //   if (!openFind) {
  //     setOptionsFind([]);
  //   }
  // }, [openFind]);

  // useEffect(() => {
  //   if (!openNear) {
  //     setOptionsNear([]);
  //   }
  // }, [openNear]);

  // const handleApiLoaded = (map, maps) => {
  //   // use map and maps objects
  //   console.log(map);
  //   console.log(maps);
  // };

  const handleMapChange = map => {
    console.log(map.bounds);
    setMap(map);
  };

  const handleSearch = () => {
    console.log(`${c}, ${city}, ${state}`);
    props.history.push(
      "/search?c=" +
        encodeURIComponent(c) +
        "&loc=" +
        encodeURIComponent(`${city},${state}`)
    );
  };

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <div className={classes.root}>
      <Typography variant={matches ? "h2" : "h4"} align="center" gutterBottom>
        Welp - Inspired by Yelp
      </Typography>

      {/* <div
        style={{ height: 600, width: "80%", margin: "auto", marginBottom: 40 }}
      >
        <GoogleMapReact
          bootstrapURLKeys={{ key: googleMapsApiKey }}
          defaultCenter={{
            lat: 33.4942, //props.biz.latitude,
            lng: -111.9261 //props.biz.longitude
          }}
          defaultZoom={13}
          // yesIWantToUseGoogleMapApiInternals
          // onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
          // options={createMapOptions}
          onChange={handleMapChange}
        >
          <AnyReactComponent
            lat={props.biz.latitude}
            lng={props.biz.longitude}
            text="https://yelp-images.s3.amazonaws.com/assets/map-markers/annotation_32x43.png"
          />
        </GoogleMapReact>
      </div> */}

      <Grid container spacing={1} style={{ marginBottom: 20 }}>
        <Grid item xs={12} md={8} className={classes.searchRoot}>
          <Autocomplete
            id="search-category"
            open={openFind}
            onOpen={() => {
              setOpenFind(true);
            }}
            onClose={() => {
              setOpenFind(false);
            }}
            getOptionSelected={(option, value) => option === value}
            getOptionLabel={(option) => option}
            options={optionsFind}
            onChange={(e, v) => setC(v)}
            loading={loadingFind}
            renderInput={(params) => (
              <TextField
                style={{ width: "100%" }}
                {...params}
                label="Restaurants, Spas, Shopping..."
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {loadingFind ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={3} className={classes.searchRoot}>
          <Autocomplete
            id="search-city-state"
            open={openNear}
            onOpen={() => {
              setOpenNear(true);
            }}
            onClose={() => {
              setOpenNear(false);
            }}
            getOptionSelected={(option, value) => option === value}
            getOptionLabel={(option) => option}
            options={optionsNear}
            loading={loadingNear}
            onChange={(e, v) => {
              console.log(v);
              if (v) {
                let vals = v.split(", ");
                setCity(vals[0]);
                setState(vals[1]);
              }
            }}
            value={`${city}, ${state}`}
            renderInput={(params) => (
              <TextField
                style={{ width: "100%" }}
                {...params}
                label="City, State"
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {loadingNear ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={1} className={classes.searchRoot}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSearch}
            style={{ height: 56 }}
            fullWidth
            disabled={!(c && city && state)}
          >
            Find
          </Button>
        </Grid>
      </Grid>

      {/* <SearchBar city={"Scottsdale"} state={"AZ"} c={null} /> */}

      <div className={classes.categoriesRoot}>
        <Grid container spacing={matches ? 3 : 1}>
          {Object.keys(categories).map((category) => (
            <Grid item xs={6} md={3} key={category}>
              <Link
                underline="none"
                component={RouterLink}
                to={
                  "/search?c=" +
                  encodeURIComponent(category) +
                  "&loc=" +
                  encodeURIComponent(`${city},${state}`)
                }
              >
                <Paper className={classes.paper}>
                  {categories[category]}
                  <Typography>{category}</Typography>
                </Paper>
              </Link>
            </Grid>
          ))}
        </Grid>
      </div>

      {/* <footer>Copyright &copy; 2020</footer> */}
    </div>
  );
}


// export default Main;
