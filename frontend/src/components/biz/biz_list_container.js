import { connect } from "react-redux";
import { fetchBizByCityState } from "../../actions/biz_actions";

import BizList from "./biz_list";

const mapStateToProps = (state, ownProps) => ({
  bizList: state.entities.biz
});

const mapDispatchToProps = dispatch => ({
  fetchBizByCityState: (category, city, state, page, prices, sort) =>
    dispatch(fetchBizByCityState(category, city, state, page, prices, sort))
});

export default connect(mapStateToProps, mapDispatchToProps)(BizList);
