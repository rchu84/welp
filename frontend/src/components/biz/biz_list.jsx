import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Link as RouterLink } from "react-router-dom";
import NavBarContainer from '../navbar/navbar_container';

import queryString from "query-string";
import {
  Grid, Card, CardContent, Box, Link, CardActionArea, CardMedia,
  List, ListItem, ListItemText, Menu, MenuItem, Button
} from '@material-ui/core';
import {
  Rating, Pagination
} from "@material-ui/lab";

import Carousel from "react-material-ui-carousel";

import RoomOutlinedIcon from "@material-ui/icons/RoomOutlined";
import RoomRoundedIcon from "@material-ui/icons/RoomRounded";
import BusinessOutlinedIcon from "@material-ui/icons/BusinessOutlined";
import CheckBoxOutlineBlankOutlinedIcon from "@material-ui/icons/CheckBoxOutlineBlankOutlined";
import CheckBoxOutlinedIcon from "@material-ui/icons/CheckBoxOutlined";
import RadioButtonCheckedOutlinedIcon from "@material-ui/icons/RadioButtonCheckedOutlined";
import RadioButtonUncheckedOutlinedIcon from "@material-ui/icons/RadioButtonUncheckedOutlined";

import GoogleMapReact from "google-map-react";

const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    width: "100%",
    // maxWidth: 960,
    // height: "100vh",
    margin: "auto"
  },

  bullet: {
    display: "inline-block",
    margin: "0 5px",
    transform: "scale(0.8)"
  },
  reviewRoot: {
    width: 200,
    display: "flex",
    alignItems: "center"
  },

  bizListRoot: {
    flexGrow: 1,
    margin: "0 40px",
    overflow: "auto"
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

  paginationRoot: {
    "& > *": {
      marginTop: theme.spacing(2)
    },
    marginBottom: "20px"
  },

  priceRangeMenuRoot: {
    width: "100%",
    maxWidth: 150,
    // backgroundColor: theme.palette.background.paper
  },

  sortMenuRoot: {
    width: "100%",
    maxWidth: 200,
    // backgroundColor: theme.palette.background.paper
  }
}));

const dollarSign = range => {
  switch (range) {
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

const priceRanges = [
  '$', '$$', '$$$', '$$$$'
];

const sortBy = [
  'Default', 'Rating', 'Most Reviewed'
];

const AnyReactComponent = ({ text }: any) => <img src={text} />;

export default function BizList(props) {
  // console.log(props.location);
  const classes = useStyles();
  const values = queryString.parse(props.location.search);
  const [city, state] = values.loc.split(",");
  const bull = <span className={classes.bullet}>•</span>;

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndices, setSelectedIndices] = useState([false, false, false, false]);

  const [anchorElSort, setAnchorElSort] = useState(null);
  const [selectedIndexSort, setSelectedIndexSort] = useState(0);

  const handleClickListItem = event => {
    if (!anchorEl) setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event, index) => {
    let newArr = selectedIndices.slice();
    newArr[index] = !newArr[index];
    setSelectedIndices(newArr);
    // setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
    fetchNewList(1);
  };

  const handleClickListItemSort = event => {
    setAnchorElSort(event.currentTarget);
  };

  const handleMenuItemClickSort = (event, index) => {
    setSelectedIndexSort(index);
    setAnchorElSort(null);
    // fetchNewList(1);
  };

  const handleCloseSort = () => {
    setAnchorElSort(null);
    // fetchNewList(1);
  };

  const [page, setPage] = useState(1);
  const [pagingCounter, setPagingCounter] = useState(1);
  const [map, setMap] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [bizList, setBizList] = useState([]);
  const [hover, setHover] = useState(null);

  const fetchNewList = page => {
    let category = values.c;
    // let [city, state] = values.loc.split(",");
    let prices = [];

    if (selectedIndices.some(el => el)) selectedIndices.forEach((el, i) => {
      if (el) prices.push(i + 1);
    });

    props
      .fetchBizByCityState(category, city, state, page, prices.join(","), selectedIndexSort)
      .then(results => {
        // console.log(results);
        setPagingCounter(results.results.data.pagingCounter);
        setTotalPages(results.results.data.totalPages);
        setBizList(results.results.data.docs);
      })
      .catch(err => console.log(err));
  };

  const handleCategoryClick = url => e => {
    e.stopPropagation();
    props.history.push(url);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    fetchNewList(value);
  };

  const handleMapChange = map => {
    console.log(map.bounds);
    setMap(map);
  };

  useEffect(() => {
    fetchNewList(1);
  }, [props.location.search, selectedIndexSort]);

  const handleMouseEnter = idx => e => {
    setHover(idx);
  };

  const handleMouseLeave = idx => e => {
    setHover(null);
  };

  // if (bizList.length === 0) return null;

  return (
    <React.Fragment>
      <NavBarContainer city={city} state={state} />

      <div className={classes.root}>
        <div className={classes.bizListRoot}>
          <Typography
            variant="h4"
            style={{ marginTop: 20, fontWeight: 700 }}
            gutterBottom
          >
            {/* All Results */}
            {`${values.c} in ${city}, ${state}`}
          </Typography>

          <Box display="flex" flexDirection="row" alignItems="center">
            <div>
              <Typography
                variant="h6"
                style={{ fontWeight: 700, marginRight: 10 }}
              >
                Filters:
              </Typography>
            </div>

            <div className={classes.sortMenuRoot}>
              <List component="nav" aria-label="sort">
                <ListItem
                  button
                  aria-haspopup="true"
                  aria-controls="lock-menu"
                  aria-label="sort"
                  onClick={handleClickListItemSort}
                >
                  <ListItemText
                    primary={`Sort: ${sortBy[selectedIndexSort]}`}
                    // secondary={options[selectedIndex]}
                  />
                </ListItem>
              </List>
              <Menu
                id="lock-menu"
                anchorEl={anchorElSort}
                keepMounted
                open={Boolean(anchorElSort)}
                onClose={handleCloseSort}
                variant="menu"
              >
                {sortBy.map((option, index) => (
                  <MenuItem
                    style={{ width: 200 }}
                    key={option}
                    // disabled={index === 0}
                    selected={index === selectedIndexSort}
                    onClick={(event) => handleMenuItemClickSort(event, index)}
                  >
                    {index === selectedIndexSort ? (
                      <RadioButtonCheckedOutlinedIcon />
                    ) : (
                      <RadioButtonUncheckedOutlinedIcon />
                    )}
                    {option}
                  </MenuItem>
                ))}
              </Menu>
            </div>

            <div className={classes.priceRangeMenuRoot}>
              <List component="nav" aria-label="Price">
                <ListItem
                  button
                  aria-haspopup="true"
                  aria-controls="lock-menu"
                  aria-label="price range"
                  onClick={handleClickListItem}
                >
                  <ListItemText
                    primary={
                      selectedIndices.some((index) => index)
                        ? selectedIndices
                            .map((el, i) =>
                              el ? dollarSign((i + 1).toString()) : el
                            )
                            .filter((el) => el)
                            .reduce((prev, curr) => [prev, ", ", curr])
                        : "Price"
                    }
                    // secondary={options[selectedIndex]}
                  />
                </ListItem>
              </List>
              <Menu
                id="lock-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                variant="menu"
              >
                {priceRanges.map((priceRange, index) => (
                  <MenuItem
                    style={{ width: 150 }}
                    key={priceRange}
                    // disabled={index === 0}
                    selected={selectedIndices[index]}
                    onClick={(event) => handleMenuItemClick(event, index)}
                  >
                    {selectedIndices[index] ? (
                      <CheckBoxOutlinedIcon />
                    ) : (
                      <CheckBoxOutlineBlankOutlinedIcon />
                    )}{" "}
                    {priceRange}
                  </MenuItem>
                ))}
              </Menu>
            </div>
          </Box>

          {/* {bizList.length === 0 ? (
          <Typography variant="h5">No results found</Typography>
        ) : (
          ""
        )} */}

          {bizList.map((biz, idx) => (
            <div key={biz._id}>
              {/* {console.log(props.bizList[bizId])} */}
              <Grid
                container
                spacing={4}
                onMouseEnter={handleMouseEnter(idx)}
                onMouseLeave={handleMouseLeave(idx)}
                onClick={() => props.history.push(`/biz/${biz._id}`)}
              >
                {/* <Grid item xs={2}>
                <Carousel>
                  {biz.photos.map(photo => (
                    <CardMedia
                      style={{ width: 200, height: 200 }}
                      image={
                        process.env.PUBLIC_URL + `/photos/${photo._id}.jpg`
                      }
                    />
                  ))}
                </Carousel>
              </Grid> */}

                <Grid item xs={12}>
                  <Card variant="outlined" style={{ background: "#f5f5f5" }}>
                    <CardContent>
                      <Box display="flex" flexDirection="row">
                        <Box>
                          {biz.photos.length > 0 ? (
                            <Carousel
                              autoPlay={false}
                              indicators={false}
                              // animation="slide"
                            >
                              {biz.photos.map((photo) => (
                                <CardMedia
                                  key={photo._id}
                                  style={{
                                    width: 150,
                                    height: 150,
                                    borderRadius: 5,
                                    marginRight: 16,
                                  }}
                                  image={
                                    process.env.REACT_APP_GCS_URL +
                                    `/photos/${photo._id}.jpg`
                                  }
                                />
                              ))}
                            </Carousel>
                          ) : (
                            <BusinessOutlinedIcon
                              style={{
                                width: 150,
                                height: 150,
                                borderRadius: 5,
                                marginRight: 16,
                              }}
                            />
                          )}
                        </Box>
                        <CardActionArea>
                          <Box flexGrow={1}>
                            <Box display="flex">
                              <Box flexGrow={1}>
                                <Typography
                                  variant="h5"
                                  style={{ fontWeight: 700 }}
                                >
                                  {`${pagingCounter + idx}. ${biz.name}`}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography variant="caption">
                                  {biz.address}
                                </Typography>
                              </Box>
                            </Box>

                            <Box borderColor="transparent">
                              <div className={classes.ratingRoot}>
                                <Rating
                                  name="read-only"
                                  value={biz.stars}
                                  precision={0.5}
                                  readOnly
                                />
                                <Box ml={2}>
                                  <Typography component="legend">
                                    {biz.review_count} reviews
                                  </Typography>
                                </Box>
                              </div>
                            </Box>

                            <Box borderColor="transparent">
                              <div className={classes.categoriesRoot}>
                                {biz.attributes &&
                                biz.attributes.RestaurantsPriceRange2 ? (
                                  <Typography variant="subtitle1" gutterBottom>
                                    {dollarSign(
                                      biz.attributes.RestaurantsPriceRange2
                                    )}
                                    {bull}
                                  </Typography>
                                ) : (
                                  ""
                                )}
                                <Typography variant="subtitle2" gutterBottom>
                                  {biz.categories
                                    .slice(0, 2)
                                    .map((category) => (
                                      // <Link
                                      //   key={category}
                                      //   href={`/#/c/${biz.city.toLowerCase()}/${category.toLowerCase()}`}
                                      // >
                                      <Link
                                        key={category}
                                        underline="none"
                                        component={RouterLink}
                                        to={
                                          "/search?c=" +
                                          encodeURIComponent(category) +
                                          "&loc=" +
                                          encodeURIComponent(`${city},${state}`)
                                        }
                                        onClick={handleCategoryClick(
                                          "/search?c=" +
                                            encodeURIComponent(category) +
                                            "&loc=" +
                                            encodeURIComponent(
                                              `${city},${state}`
                                            )
                                        )}
                                      >
                                        {category}
                                      </Link>
                                    ))
                                    .reduce((prev, curr) => [prev, ", ", curr])}
                                </Typography>
                              </div>
                            </Box>
                          </Box>
                        </CardActionArea>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </div>
          ))}

          {bizList.length === 0 ? (
            ""
          ) : (
            <div className={classes.paginationRoot}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
              />
            </div>
          )}
        </div>

        <div
          style={{
            height: "95vh",
            width: "315px",
            position: "sticky",
            top: 0,
          }}
        >
          <GoogleMapReact
            bootstrapURLKeys={{ key: googleMapsApiKey }}
            defaultCenter={{
              lat:
                bizList.length > 0
                  ? (Math.min(...bizList.map((biz) => biz.latitude)) +
                      Math.max(...bizList.map((biz) => biz.latitude))) /
                    2.0
                  : 33.4942,
              lng:
                bizList.length > 0
                  ? (Math.min(...bizList.map((biz) => biz.longitude)) +
                      Math.max(...bizList.map((biz) => biz.longitude))) /
                    2.0
                  : -111.9261,
              // lat: 33.4942, //props.biz.latitude,
              // lng: -111.9261 //props.biz.longitude
            }}
            defaultZoom={11}
            // yesIWantToUseGoogleMapApiInternals
            // onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
            // options={createMapOptions}
            onChange={handleMapChange}
          >
            {bizList.map((biz, idx) =>
              // <AnyReactComponent
              //   key={biz._id}
              //   lat={biz.latitude}
              //   lng={biz.longitude}
              //   text="https://yelp-images.s3.amazonaws.com/assets/map-markers/annotation_32x43.png"
              // />
              hover === idx ? (
                <RoomOutlinedIcon
                  key={biz._id}
                  lat={biz.latitude}
                  lng={biz.longitude}
                  fontSize="large"
                />
              ) : (
                <RoomRoundedIcon
                  key={biz._id}
                  lat={biz.latitude}
                  lng={biz.longitude}
                  fontSize="large"
                />
              )
            )}
          </GoogleMapReact>
        </div>
      </div>
    </React.Fragment>
  );
}
