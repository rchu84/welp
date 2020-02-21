import React, { useState, useEffect } from 'react';

function BizDetail(props) {

  useEffect(() => {
    props.fetchBizById(props.match.params.bizId);
  }, []);

  if (!props.biz) return null;

  return (
    <div className="biz-detail">
      <h1>{props.biz.name}</h1>
    </div>
  );
};

export default BizDetail;