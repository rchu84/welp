import { connect } from "react-redux";
import { fetchBizByCityState } from "../../actions/biz_actions";

import BizList from "./biz_list";

const mapStateToProps = (state, ownProps) => ({
  bizList: state.entities.biz
});

const mapDispatchToProps = dispatch => ({
  fetchBizByCityState: (category, city, state, page) =>
    dispatch(fetchBizByCityState(category, city, state, page))
});

export default connect(mapStateToProps, mapDispatchToProps)(BizList);
