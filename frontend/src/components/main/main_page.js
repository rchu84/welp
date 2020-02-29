import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Link as RouterLink } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link"

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

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: 960,
    margin: "auto",
    marginTop: 20,
    marginBottom: 20
  },

  categoriesRoot: {
    flexGrow: 1
  },

  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.primary,
  },

}));

export default function Main() {
  const classes = useStyles();
  const [map, setMap] = useState(null)
  // const [zoom, setZoom] = useState(13);
  // const [lat, setLat] = useState(37.7758);
  // const [lng, setLng] = useState(-122.435);

  const [city, setCity] = useState("Scottsdale");
  const [state, setState] = useState("AZ");

  // const handleApiLoaded = (map, maps) => {
  //   // use map and maps objects
  //   console.log(map);
  //   console.log(maps);
  // };

  const handleMapChange = map => {
    console.log(map.bounds);
    setMap(map);
  };

  const handleCategoryClick = () => {

  };

  return (
    <div className={classes.root}>
      <Typography variant="h2" align="center" gutterBottom>
        Welp - A Yelp Clone
      </Typography>

      <div
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
          {/* <AnyReactComponent
            lat={props.biz.latitude}
            lng={props.biz.longitude}
            text="https://yelp-images.s3.amazonaws.com/assets/map-markers/annotation_32x43.png"
          /> */}
        </GoogleMapReact>
      </div>

      <div className={classes.categoriesRoot}>
        <Grid container spacing={3}>
          {Object.keys(categories).map(category => (
            <Grid item xs={3} key={category}>
              <Link
                underline="none"
                component={RouterLink}
                to={`/search?c=${encodeURIComponent(category)}&loc=${encodeURIComponent(`${city},${state}`)}`}
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
