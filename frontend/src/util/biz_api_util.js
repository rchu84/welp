import axios from 'axios';

export const getBizById = bizId => (
  axios.get(`/api/biz/${bizId}`)
);

export const getBizByCityState = (category, city, state, page, prices, sort) => (
  axios.get('/api/biz/city', {
    params: {
      category,
      city,
      state,
      page,
      prices,
      sort
    }
  })
);

export const getReviewsByBizId = (bizId, page) => (
  axios.get(`/api/biz/${bizId}/reviews`, {
    params: {
      page
    }
  })
);

export const postReviewByBizId = (bizId, data) => (
  axios.post(`/api/biz/${bizId}/reviews`, data)
);