import { 
  RECEIVE_SINGLE_BIZ,
  RECEIVE_BIZ_LIST
} from "../actions/biz_actions";

const BizReducer = (state = {}, action) => {
  Object.freeze(state);
  let newState = Object.assign({}, state);

  switch(action.type) {
    case RECEIVE_SINGLE_BIZ:
      newState[action.bizId] = action.biz.data;
      return newState;
    case RECEIVE_BIZ_LIST:
      action.results.data.docs.forEach(biz => {
        newState[biz._id] = biz;
      });
      return newState;
    default:
      return state;
  }
};

export default BizReducer;