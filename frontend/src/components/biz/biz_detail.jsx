import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import Divider from "@material-ui/core/Divider";


import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
// import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import MuiTableCell from "@material-ui/core/TableCell";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";

import EmojiObjectsIcon from "@material-ui/icons/EmojiObjects";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import MoodIcon from "@material-ui/icons/Mood";

import GoogleMapReact from 'google-map-react';

const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
// https://yelp-images.s3.amazonaws.com/assets/map-markers/annotation_32x43.png

// https://s3-media0.fl.yelpcdn.com/assets/public/stars.yelp_design_web.yji-9bec2045845c24d3bff3ddb582884eda.png

// https://maps.googleapis.com/maps/api/staticmap?scale=1&center=37.767634%2C-122.388865&language=en&zoom=15&markers=scale%3A1%7Cicon%3Ahttps%3A%2F%2Fyelp-images.s3.amazonaws.com%2Fassets%2Fmap-markers%2Fannotation_32x43.png%7C37.767634%2C-122.388865&client=gme-yelp&sensor=false&size=315x150&signature=83JEyZuvp5kUsD_skcWdYKUQAQ4=

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: 800,
    margin: "auto"
  },

  galleryRoot: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper
  },

  gridList: {
    width: "100%"
  },

  locationRoot: {
    flexGrow: 1
  },

  reviewRoot: {
    width: 200,
    display: "flex",
    alignItems: "center"
  },

  ratingRoot: {
    display: "flex",
    alignItems: "center"
  },

  addressCard: {
    maxWidth: 315
  },
  addressCardMedia: {
    height: 150
  },
  bullet: {
    display: "inline-block",
    margin: "0 5px",
    transform: "scale(0.8)"
  },
  paper: {
    padding: theme.spacing(2),
    margin: "auto"
  }
}));

const TableCell = withStyles({
  root: {
    borderBottom: "none"
  }
})(MuiTableCell);

const googleMapsStaticURL = (lat, lng, apiKey) => (
  "https://maps.googleapis.com/maps/api/staticmap?scale=1&center=" +
  lat +
  "," +
  lng +
  "&language=en&zoom=15&markers=scale:1|icon:https://yelp-images.s3.amazonaws.com/assets/map-markers/annotation_32x43.png|" +
  lat +
  "," +
  lng + "&sensor=false&size=315x150&key=" +
  apiKey
);

const dollarSign = range => {
  switch(range) {
    case "1":
      return "$";
    case "2":
      return "$$";
    case "3":
      return "$$$";
    case "4":
      return "$$$$";
    default:
      return "";
  }
};

// default 315 width 150 height

const AnyReactComponent = ({text}: any) => <img src={text} />;

export default function BizDetail(props) {
  const classes = useStyles();
  const [zoom, setZoom] = useState(15);
  const bull = <span className={classes.bullet}>•</span>;

  const createMapOptions = maps => ({
    disableDefaultUI: true,
    draggable: false
  });

  useEffect(() => {
    props.fetchBizById(props.match.params.bizId);
  }, []);

  if (!props.biz) return null;

  

  return (
    <div className={classes.root}>
      <div className={classes.galleryRoot}>
        <GridList cellHeight="auto" cols={4} className={classes.gridList}>
          {props.biz.photos.map(photo => (
            <GridListTile cols={4} key={photo._id}>
              <img src={process.env.PUBLIC_URL + `/photos/${photo._id}.jpg`} />
            </GridListTile>
          ))}
        </GridList>
      </div>

      {/* <Grid container spacing={2}>
        {props.biz.photos.map(photo => (
          <Grid item xs={3} key={photo._id}>
            <img src={process.env.PUBLIC_URL + `/photos/${photo._id}.jpg`} />
          </Grid>
        ))}
      </Grid> */}

      <Typography variant="h3" gutterBottom>
        {props.biz.name}
      </Typography>

      <Box mb={1} borderColor="transparent">
        <div className={classes.ratingRoot}>
          <Rating
            name="read-only"
            value={props.biz.stars}
            precision={0.5}
            readOnly
          />
          <Box ml={2}>
            <Typography component="legend">
              {props.biz.review_count} reviews
            </Typography>
          </Box>
        </div>
      </Box>

      <Box mb={1} borderColor="transparent">
        <div className={classes.ratingRoot}>
          <Typography variant="subtitle1" gutterBottom>
            {dollarSign(props.biz.attributes.RestaurantsPriceRange2)}
            {bull}
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            {props.biz.categories
              .map(category => (
                <Link
                  key={category}
                  href={`/#/c/${props.biz.city.toLowerCase()}/${category.toLowerCase()}`}
                >
                  {category}
                </Link>
              ))
              .reduce((prev, curr) => [prev, ", ", curr])}
          </Typography>
        </div>
      </Box>

      <Divider variant="middle" />

      <Typography variant="h6" gutterBottom>
        Location & Hours
      </Typography>

      <div className={classes.locationRoot}>
        <Grid container spacing={2} justify="center">
          <Grid item xs={6}>
            <Card className={classes.addressCard}>
              {/* <CardActionArea> */}
              <CardMedia
                className={classes.addressCardMedia}
                image={process.env.PUBLIC_URL + "/staticmap.png"}
                title="Contemplative Reptile"
              />
              <CardContent>
                <Typography variant="body2" component="p">
                  {props.biz.address}
                </Typography>
                <Typography variant="body2" component="p">
                  {props.biz.city}, {props.biz.state} {props.biz.postal_code}
                </Typography>
              </CardContent>
              {/* </CardActionArea> */}
            </Card>
          </Grid>
          <Grid item xs={6}>
            <TableContainer>
              <Table size="small" aria-label="simple table">
                <TableBody>
                  {Object.keys(props.biz.hours).map(key => (
                    <TableRow key={key}>
                      <TableCell component="th" scope="row">
                        <Box fontWeight="fontWeightBold">{key}</Box>
                      </TableCell>
                      <TableCell align="right">
                        {props.biz.hours[key]
                          .split("-")
                          .map(time =>
                            new Date(
                              null,
                              null,
                              null,
                              ...time.split(":")
                            ).toLocaleTimeString(navigator.language, {
                              hour: "2-digit",
                              minute: "2-digit"
                            })
                          )
                          .reduce((prev, curr) => [prev, " - ", curr])}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </div>

      {/* <img
        src={googleMapsStaticURL(
          props.biz.latitude,
          props.biz.longitude,
          googleMapsApiKey
        )}
      /> */}

      <Divider variant="middle" />

      {props.biz.reviews.map(review => (
        <Grid container justify="center" spacing={0} key={review._id}>
          <Grid item xs={4}>
            <Paper className={classes.paper} elevation={0}>
              {review.user_id}
            </Paper>
          </Grid>

          <Grid item xs={8}>
            <Card elevation={0}>
              <CardContent>
                <div className={classes.reviewRoot}>
                  <Rating
                    name="read-only"
                    value={review.stars}
                    precision={0.5}
                    readOnly
                  />
                  {/* <Typography variant="caption"> */}
                  <Box ml={2}>
                    <Typography variant="body2">
                      {new Date(review.date).toLocaleDateString()}
                    </Typography>
                  </Box>
                  {/* </Typography> */}
                </div>

                <Typography variant="body2" component="p">
                  {review.text}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<EmojiObjectsIcon />}
                >
                  Useful{review.useful > 0 ? ` ${review.useful}` : ""}
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<EmojiEmotionsIcon />}
                >
                  Funny{review.funny > 0 ? ` ${review.funny}` : ""}
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<MoodIcon />}
                >
                  Cool{review.cool > 0 ? ` ${review.cool}` : ""}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      ))}

      {/* <div style={{ height: "315px", width: "315px" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: googleMapsApiKey }}
          defaultCenter={{
            lat: props.biz.latitude,
            lng: props.biz.longitude
          }}
          defaultZoom={zoom}
          options={createMapOptions}
        >
          <AnyReactComponent
            lat={props.biz.latitude}
            lng={props.biz.longitude}
            text="https://yelp-images.s3.amazonaws.com/assets/map-markers/annotation_32x43.png"
          />
        </GoogleMapReact>
      </div> */}
    </div>
  );
};
