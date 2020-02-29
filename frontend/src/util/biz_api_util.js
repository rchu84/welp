import axios from 'axios';

export const getBizById = bizId => (
  axios.get(`/api/biz/${bizId}`)
);

export const getBizByCityState = (category, city, state, page) => (
  axios.get('/api/biz/city', {
    params: {
      category,
      city,
      state,
      page
    }
  })
)