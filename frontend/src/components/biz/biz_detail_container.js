import { connect } from 'react-redux';
import { fetchBizById } from '../../actions/biz_actions';
import { current } from '../../actions/session_actions';

import BizDetail from './biz_detail';

const mapStateToProps = (state, ownProps) => ({
  loggedIn: state.session.isAuthenticated,
  currentUser: state.session.user,
  biz: state.entities.biz[ownProps.match.params.bizId]
});

const mapDispatchToProps = dispatch => ({
  fetchBizById: bizId => dispatch(fetchBizById(bizId)),
  fetchCurrentUser: () => dispatch(current())
})


export default connect(mapStateToProps, mapDispatchToProps)(BizDetail);