import { combineReducers } from "redux";
// import usersReducer from './users_reducer';
// import channelsReducer from "./channels_reducer";
// import MessagesReducer from "./messages_reducer";
// import postLikesReducer from './post_likes_reducer';
// import commentsReducer from './comments_reducer';

import bizReducer from './biz_reducer';

const entitiesReducer = combineReducers({
  biz: bizReducer
  // channels: channelsReducer,
  // messages: MessagesReducer
  // users: usersReducer,
  // postLikes: postLikesReducer,
  // comments: commentsReducer
});

export default entitiesReducer;
