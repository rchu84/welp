import { RECEIVE_SINGLE_BIZ } from "../actions/biz_actions";

const BizReducer = (state = {}, action) => {
  Object.freeze(state);
  let newState = Object.assign({}, state);

  switch(action.type) {
    case RECEIVE_SINGLE_BIZ:
      newState[action.bizId] = action.biz.data;
      return newState;
    default:
      return state;
  }
};

export default BizReducer;