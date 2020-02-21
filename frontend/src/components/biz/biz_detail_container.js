import { connect } from 'react-redux';
import { fetchBizById } from '../../actions/biz_actions';

import BizDetail from './biz_detail';

const mapStateToProps = (state, ownProps) => ({
  biz: state.entities.biz[ownProps.match.params.bizId]
});

const mapDispatchToProps = dispatch => ({
  fetchBizById: bizId => dispatch(fetchBizById(bizId))
})


export default connect(mapStateToProps, mapDispatchToProps)(BizDetail);