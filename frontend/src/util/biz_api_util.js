import axios from 'axios';

export const getBizById = bizId => (
  axios.get(`/api/biz/${bizId}`)
);