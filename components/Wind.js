import React from 'react';

const winds = ['东', '南', '西', '北'];
export default p => {
  const t = p.type === 1 ? '门风 - Seat Wind' : '圈风 - Prevalent Wind';
  return (
    <div className="fv jcsb wind">
      {t}
      <div className="f jcsb">
        {winds.map((x, i) =>
          <div className={`btn c24 fc ${p.value === i + 1 ? 'hYellowgreen' : 'hWhite'}`}
            onClick={() => p.click(p.type, i + 1)}>{x}</div>
        )}
      </div>
    </div>
  );
}