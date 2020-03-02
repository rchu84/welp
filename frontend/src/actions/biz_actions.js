import { 
  getBizById,
  getBizByCityState
} from '../util/biz_api_util';

export const RECEIVE_SINGLE_BIZ = "RECEIVE_SINGLE_BIZ";
export const RECEIVE_BIZ_LIST = "RECEIVE_BIZ_LIST";

export const receiveSingleBiz = (bizId, biz) => ({
  type: RECEIVE_SINGLE_BIZ,
  bizId,
  biz
});

export const receiveBizList = results => ({
  type: RECEIVE_BIZ_LIST,
  results
});

export const fetchBizById = bizId => dispatch => (
  getBizById(bizId)
    .then(biz => dispatch(receiveSingleBiz(bizId, biz)))
    .catch(err => console.log(err))
);

export const fetchBizByCityState = (category, city, state, page, prices, sort) => dispatch => (
  getBizByCityState(category, city, state, page, prices, sort)
    .then(result => dispatch(receiveBizList(result)))
    .catch(err => console.log(err))
);