import { getBizById } from '../util/biz_api_util';

export const RECEIVE_SINGLE_BIZ = "RECEIVE_SINGLE_BIZ";

export const receiveSingleBiz = (bizId, biz) => ({
  type: RECEIVE_SINGLE_BIZ,
  bizId,
  biz
});

export const fetchBizById = bizId => dispatch => (
  getBizById(bizId)
    .then(biz => dispatch(receiveSingleBiz(bizId, biz)))
    .catch(err => console.log(err))
);