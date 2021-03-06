import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Grid, TextField, Button, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Autocomplete } from '@material-ui/lab'
import { useHistory } from 'react-router-dom';

export default function SearchBar(props) {

  const [city, setCity] = useState(props.city);
  const [state, setState] = useState(props.state);
  const [c, setC] = useState(props.c);

  const [openFind, setOpenFind] = useState(false);
  const [optionsFind, setOptionsFind] = useState([]);
  const loadingFind = openFind && optionsFind.length === 0;

  const [openNear, setOpenNear] = useState(false);
  const [optionsNear, setOptionsNear] = useState([]);
  const loadingNear = openNear && optionsNear.length === 0;

  const history = useHistory();

  const handleSearch = () => {
    console.log(`${c}, ${city}, ${state}`);
    history.push(
      "/search?c=" +
        encodeURIComponent(c) +
        "&loc=" +
        encodeURIComponent(`${city},${state}`)
    );
  };

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
  }, [loadingFind, loadingFind.length]);

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
  }, [loadingNear, loadingNear.length]);

  useEffect(() => {
    if (c && city && state) handleSearch();
  }, [c, city, state]);

  return (
    <Grid container spacing={1} style={{ marginTop: 10, marginBottom: 10 }}>
      <Grid item xs={12} md={8}>
        <Autocomplete
          size="small"
          id="search-category"
          open={openFind}
          onOpen={() => {
            setOpenFind(true);
          }}
          onClose={() => {
            setOpenFind(false);
          }}
          getOptionSelected={(option, value) => option === value}
          getOptionLabel={option => option}
          options={optionsFind}
          onChange={(e, v) => setC(v)}
          loading={loadingFind}
          renderInput={params => (
            <TextField
              style={{ width: "100%" }}
              {...params}
              label="Restaurants, Spa..."
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
                )
              }}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <Autocomplete
          size="small"
          id="search-city-state"
          open={openNear}
          onOpen={() => {
            setOpenNear(true);
          }}
          onClose={() => {
            setOpenNear(false);
          }}
          getOptionSelected={(option, value) => option === value}
          getOptionLabel={option => option}
          options={optionsNear}
          loading={loadingNear}
          onChange={(e, v) => {
            // console.log(v);
            if (v) {
              let vals = v.split(", ");
              setCity(vals[0]);
              setState(vals[1]);
            }
          }}
          value={`${city}, ${state}`}
          renderInput={params => (
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
                )
              }}
            />
          )}
        />
      </Grid>
      {/* <Grid item xs={1}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleSearch}
          style={{ height: 40 }}
          disabled={!(c && city && state)}
        >
          Find
        </Button>
      </Grid> */}
    </Grid>
  );
}