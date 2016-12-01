import React from 'react';

export default p => {
  const { d, x, c } = p;
  return (
    <div>
      <div className={`f p8 li hand ${d ? 'Gold' : ''}`} onClick={c && c.bind(this, x)}>
        <div className="w10">{x[1]}</div>
        <div className="w30">{x[2]}</div>
        <div className={d ? 'w50' : 'w60'}>{x[3]}</div>
        {d ? <div className="w10 tar"><i className="fa fa-chevron-down" /></div> : null}
      </div>
      <hr className="hr"/>
    </div>
  );
}