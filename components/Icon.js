import React from 'react';

export default p => {
  const d1 = {
    width: '1024px',
    height: '500px',
    background: 'linear-gradient(to bottom right, yellowgreen 30%, green)',
    margin: '-8px',
    fontSize: '120px',
    color: 'white',
    textAlign: 'center',
  }

  const d2 = {
    width: '512px',
    height: '512px',
    background: 'linear-gradient(to bottom right, yellowgreen 30%, green)',
    margin: '-8px',
    fontSize: '96px',
  }

  const d3 = {
    width: '128px',
    height: '128px',
    background: 'linear-gradient(to bottom right, yellowgreen 30%, green)',
    margin: '-8px',
    fontSize: '24px',
  }

  return (
    <div style={d1}>
      <div className="spv8"/>
      <div>国标麻将</div>
      <div className="spv16"/>
      <div className="fc">
        <img src="/images/j1.png" width="100"/>
        <img src="/images/j2.png" width="100"/>
        <img src="/images/j3.png" width="100"/>
      </div>
      <div>番数计算器</div>
    </div>
  );

  // return (
  //   <div style={d2} className="fv fc white">
  //     <div>国标麻将</div>
  //     <div className="spv8"/>
  //     <div className="fc">
  //       <img src="/images/j1.png" width="100"/>
  //       <img src="/images/j2.png" width="100"/>
  //       <img src="/images/j3.png" width="100"/>
  //     </div>
  //     <div>番数计算</div>
  //     <div className="spv16"/>
  //   </div>
  // );

  // return (
  //   <div style={d3} className="fv fc white">
  //     <div>国标麻将</div>
  //     <div className="spv2"/>
  //     <div className="fc">
  //       <img src="/images/j1.png" width="31"/>
  //       <img src="/images/j2.png" width="31"/>
  //       <img src="/images/j3.png" width="31"/>
  //     </div>
  //     <div>番数计算</div>
  //     <div className="spv4"/>
  //   </div>
  // );
};
