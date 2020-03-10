import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import { Rating, Pagination } from '@material-ui/lab';
import { 
  Box, Divider, Grid, Paper, Table, TableBody, TableContainer, TableHead,
  Card, CardActionArea, CardActions, CardContent, CardMedia, Link, TextField,
  Button, GridList, GridListTile, TableRow, TableCell as MuiTableCell
} from '@material-ui/core';

import { Link as RouterLink } from "react-router-dom";
import EmojiObjectsIcon from "@material-ui/icons/EmojiObjects";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import MoodIcon from "@material-ui/icons/Mood";
import StarsIcon from "@material-ui/icons/Stars";
import PeopleIcon from "@material-ui/icons/People";

import { getReviewsByBizId, postReviewByBizId } from '../../util/biz_api_util';

import NavBarContainer from '../navbar/navbar_container';

// https://yelp-images.s3.amazonaws.com/assets/map-markers/annotation_32x43.png

// https://s3-media0.fl.yelpcdn.com/assets/public/stars.yelp_design_web.yji-9bec2045845c24d3bff3ddb582884eda.png

// https://maps.googleapis.com/maps/api/staticmap?scale=1&center=37.767634%2C-122.388865&language=en&zoom=15&markers=scale%3A1%7Cicon%3Ahttps%3A%2F%2Fyelp-images.s3.amazonaws.com%2Fassets%2Fmap-markers%2Fannotation_32x43.png%7C37.767634%2C-122.388865&client=gme-yelp&sensor=false&size=315x150&signature=83JEyZuvp5kUsD_skcWdYKUQAQ4=

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: 960,
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
    width: 400,
    display: "flex",
    alignItems: "center"
  },

  ratingRoot: {
    display: "flex",
    alignItems: "center"
  },

  categoriesRoot: {
    display: "flex",
    alignItems: "center",
    margin: "0 4px"
  },

  addressCard: {
    maxWidth: 315
  },

  hoursTable: {
    maxWidth: 250
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
  },
  pos: {
    marginBottom: 12
  },
  locationPos: {
    marginBottom: 12
  },
  paginationRoot: {
    "& > *": {
      marginTop: theme.spacing(2)
    },
    marginBottom: "20px"
  },
  photosRoot: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
    marginTop: 10,
    marginBottom: 10,
    width: "100vw",
    marginLeft: "calc(-50vw + 49%)",
    marginRight: "calc(-50vw + 49%)",
  },
  photosGridList: {
    flexWrap: "nowrap",
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: "translateZ(0)"
  },
  photosTitle: {
    color: theme.palette.primary.light
  },
  photosTitleBar: {
    background:
      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)"
  },
  reviewBodyRoot: {
    '& .MuiTextField-root': {
      // margin: theme.spacing(1),
      width: "100%",
    },
  },
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

const labels = {
  1: 'Eek! Methinks not.',
  2: "Meh. I've experienced better.",
  3: 'A-OK.',
  4: "Yay! I'm a fan.",
  5: 'Woohoo! As good as it gets!',
};

const reviewPlaceholder = "Doesn’t look like much when you walk past, but I was practically dying of hunger so I popped in. The definition of a hole-in-the-wall. I got the regular hamburger and wow…  there are no words. A classic burger done right. Crisp bun, juicy patty, stuffed with all the essentials (ketchup, shredded lettuce, tomato, and pickles). There’s about a million options available between the menu board and wall full of specials, so it can get a little overwhelming, but you really can’t go wrong. Not much else to say besides go see for yourself! You won’t be disappointed.";

// default 315 width 150 height

const AnyReactComponent = ({text}: any) => <img src={text} />;

export default function BizDetail(props) {
  const classes = useStyles();
  const [zoom, setZoom] = useState(15);
  const bull = <span className={classes.bullet}>•</span>;

  const [page, setPage] = useState(1);
  const [pagingCounter, setPagingCounter] = useState(1);
  // const [map, setMap] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [reviews, setReviews] = useState([]);

  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(-1);

  const [reviewBody, setReviewBody] = useState("");

  // const currentUserReview = props.currentUser.reviewed_bizIds.includes(
  //   props.match.params.bizId
  // ) ? : null;

  const handleChangeReviewBody = e => {
    setReviewBody(e.currentTarget.value);
  };

  const createMapOptions = maps => ({
    disableDefaultUI: true,
    draggable: false
  });

  const fetchReviews = page => {
    getReviewsByBizId(props.match.params.bizId, page)
      .then(results => {
      setPagingCounter(results.data.pagingCounter);
      setTotalPages(results.data.totalPages);
      setReviews(results.data.docs);
    })
      .catch(err => console.log(err));
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    fetchReviews(value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log("clicked submit");
    let reviewData = {
      stars: rating,
      text: reviewBody
    };
    postReviewByBizId(props.match.params.bizId, reviewData)
      .then(review => {
        setReviewBody("");
        setRating(null);
        props.fetchCurrentUser();
        fetchReviews(1);
      });
  };

  useEffect(() => {
    props.fetchBizById(props.match.params.bizId)
  }, []);

  useEffect(() => {
    fetchReviews(1);
  }, []);

  if (!props.biz) return null;

  

  return (
    <React.Fragment>
      <NavBarContainer city={props.biz.city} state={props.biz.state} />

      <div className={classes.root}>
        {/* <div className={classes.galleryRoot}>
        <GridList cellHeight="auto" cols={4} className={classes.gridList}>
          {props.biz.photos.map(photo => (
            <GridListTile cols={4} key={photo._id}>
              <img src={process.env.PUBLIC_URL + `/photos/${photo._id}.jpg`} />
            </GridListTile>
          ))}
        </GridList>
      </div> */}

        <div className={classes.photosRoot}>
          <GridList
            className={classes.photosGridList}
            cols={props.biz.photos.length < 4 ? props.biz.photos.length : 4.5}
          >
            {props.biz.photos.map(photo => (
              <GridListTile key={photo._id}>
                <img
                  src={process.env.PUBLIC_URL + `/photos/${photo._id}.jpg`}
                />
                {/* <GridListTileBar
                title={tile.title}
                classes={{
                  root: classes.photosTitleBar,
                  title: classes.photosTitle
                }}
                actionIcon={
                  <IconButton aria-label={`star ${tile.title}`}>
                    <StarBorderIcon className={classes.photosTitle} />
                  </IconButton>
                }
              /> */}
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

        <Typography variant="h3" style={{ fontWeight: 700 }}>
          {props.biz.name}
        </Typography>

        <Box borderColor="transparent">
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

        <Box borderColor="transparent">
          <div className={classes.categoriesRoot}>
            {props.biz.attributes &&
            props.biz.attributes.RestaurantsPriceRange2 ? (
              <Typography variant="subtitle1" gutterBottom>
                {dollarSign(props.biz.attributes.RestaurantsPriceRange2)}
                {bull}
              </Typography>
            ) : (
              ""
            )}

            <Typography variant="subtitle2" gutterBottom>
              {props.biz.categories
                .map(category => (
                  <Link
                    key={category}
                    underline="none"
                    component={RouterLink}
                    to={
                      "/search?c=" +
                      encodeURIComponent(category) +
                      "&loc=" +
                      encodeURIComponent(`${props.biz.city},${props.biz.state}`)
                    }
                  >
                    {category}
                  </Link>
                ))
                .reduce((prev, curr) => [prev, ", ", curr])}
            </Typography>
          </div>
        </Box>

        <Divider />

        <Typography variant="h6" style={{ fontWeight: 700 }}>
          Location & Hours
        </Typography>

        <div className={classes.locationRoot}>
          <Grid
            container
            spacing={2}
            justify="center"
            className={classes.locationPos}
          >
            <Grid item xs={6}>
              <Card className={classes.addressCard} variant="outlined">
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

            {props.biz.hours ? (
              <Grid item xs={6}>
                <TableContainer>
                  <Table
                    size="small"
                    aria-label="simple table"
                    className={classes.hoursTable}
                  >
                    <TableBody>
                      {Object.keys(props.biz.hours).map(key => (
                        <TableRow key={key}>
                          <TableCell component="th" scope="row">
                            <Box fontWeight="fontWeightBold">
                              {key.slice(0, 3)}
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            {props.biz.hours[key]
                              .split("-")
                              .every((val, i, arr) => val === arr[0])
                              ? "24 hours"
                              : props.biz.hours[key]
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
            ) : (
              ""
            )}
          </Grid>
        </div>

        {/* <img
        src={googleMapsStaticURL(
          props.biz.latitude,
          props.biz.longitude,
          googleMapsApiKey
        )}
      /> */}

        <Divider />

        <Typography variant="h6" style={{ fontWeight: 700 }}>
          Reviews
        </Typography>

        {props.loggedIn ? (
          <div key="write-review">
            <Grid container justify="center" spacing={0}>
              <Grid item xs={2}>
                <Card elevation={0}>
                  <CardContent style={{ background: "#f5f5f5" }}>
                    <Box
                      fontWeight="fontWeightBold"
                      style={{ marginTop: 5, marginBottom: 5 }}
                    >
                      {props.currentUser.name}
                    </Box>
                    <Typography
                      variant="caption"
                      className={classes.ratingRoot}
                    >
                      <StarsIcon style={{ fontSize: 16 }} />
                      <Box ml={1}>
                        {`${props.currentUser.review_count}`} reviews
                      </Box>
                    </Typography>
                    <Typography
                      variant="caption"
                      className={classes.ratingRoot}
                    >
                      <PeopleIcon style={{ fontSize: 16 }} />
                      <Box ml={1}>
                        {`${props.currentUser.friends.split(", ").length}`}{" "}
                        friends
                      </Box>
                    </Typography>
                  </CardContent>
                </Card>
                {/* <Paper className={classes.paper} elevation={0}>
              
            </Paper> */}
              </Grid>

              <Grid item xs={10}>
                <Card elevation={0} style={{ background: "#f5f5f5" }}>
                  <CardContent>
                    <div className={classes.reviewRoot}>
                      <Rating
                        name="select-rating"
                        value={rating}
                        style={{ marginBottom: 3 }}
                        onChange={(e, v) => {
                          setRating(v);
                        }}
                        onChangeActive={(e, v) => {
                          setHover(v);
                        }}
                      />
                      {rating !== null && (
                        <Box ml={2}>
                          {labels[hover !== -1 ? hover : rating]}
                        </Box>
                      )}
                    </div>

                    <form
                      onSubmit={handleSubmit}
                      className={classes.reviewBodyRoot}
                    >
                      <TextField
                        style={{ marginBottom: 10 }}
                        id="outlined-multiline-static"
                        // label="Multiline"
                        multiline
                        rows="6"
                        value={reviewBody}
                        onChange={handleChangeReviewBody}
                        placeholder={reviewPlaceholder}
                        variant="outlined"
                      />
                      <Button
                        variant="contained"
                        color="secondary"
                        type="submit"
                      >
                        Post Review
                      </Button>
                    </form>

                  </CardContent>
                  
                </Card>
              </Grid>
            </Grid>

            <Divider />
          </div>
        ) : (
          ""
        )}

        {reviews.map(review => (
          <div key={review._id}>
            <Grid container justify="center" spacing={0}>
              <Grid item xs={2}>
                <Card elevation={0}>
                  <CardContent style={{ background: "#f5f5f5" }}>
                    <Box
                      fontWeight="fontWeightBold"
                      style={{ marginTop: 5, marginBottom: 5 }}
                    >
                      {review.user_id.name}
                    </Box>
                    <Typography
                      variant="caption"
                      className={classes.ratingRoot}
                    >
                      <StarsIcon style={{ fontSize: 16 }} />
                      <Box ml={1}>
                        {`${review.user_id.review_count}`} reviews
                      </Box>
                    </Typography>
                    <Typography
                      variant="caption"
                      className={classes.ratingRoot}
                    >
                      <PeopleIcon style={{ fontSize: 16 }} />
                      <Box ml={1}>
                        {`${review.user_id.friends.split(", ").length}`} friends
                      </Box>
                    </Typography>
                  </CardContent>
                </Card>
                {/* <Paper className={classes.paper} elevation={0}>
              
            </Paper> */}
              </Grid>

              <Grid item xs={10}>
                <Card elevation={0} style={{ background: "#f5f5f5" }}>
                  <CardContent>
                    <div className={classes.reviewRoot}>
                      <Rating
                        name="read-only"
                        value={review.stars}
                        precision={0.5}
                        readOnly
                        style={{ marginBottom: 3 }}
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
                  <CardActions className={classes.pos}>
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

            <Divider />
          </div>
        ))}

        <div className={classes.paginationRoot}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
          />
        </div>

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
    </React.Fragment>
  );
};
