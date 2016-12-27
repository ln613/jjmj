import React from 'react';
import update from 'react/lib/update';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import $ from 'jquery';
import R from 'ramda';
import Dialog from 'material-ui/Dialog';
import Toggle from 'material-ui/Toggle';
import Nav from '../components/Nav';
import Rule from '../components/Rule';
import Wind from '../components/Wind';
import data from '../data';
import H from '../bus/hand';
import { tap } from '../util/util';

const options = [44, 45, 46, 47, 58];

class Calc extends React.Component {
  constructor() {
    super();
    this.initHand();
  }

  componentDidMount() {
    this.resize();
    window.onresize = e => this.resize();    
  }

  resize = () => {
    this.setState({
      w: document.documentElement.clientWidth,
      h: document.documentElement.clientHeight
    });
  } 

  initHand = () => {
    this.state = { hand: [3, 3, 3, 3, 2].map(x => R.range(0, x).map(y => 'w')), r: 0, c: 0 };
    this.setState();
  }

  demo = x => {
    if (this.state.demo)
      this.setState({ demo: null });
    else                                
      this.setState({ demo: x });
  }
  
  add = t => {
    if (t === 'ww') return;
    if (H.has4(t)(this.state.hand)) return;
    let r = this.state.r;
    let c = this.state.c;
    if (r === 4 && c === 2) return;
    const l = update(this.state.hand, { [r]: { [c]: { $set: t } } });
    if (c === 2) {
      const h = l[r];
      if (R.pipe(H.arr(0), R.uniq, H.lenEq(1))(h))
        l[r] = R.sortBy(x => +x[1], l[r]);
    }
    this.setState({ hand: l, r: c === 2 ? r + 1 : r, c: c === 2 ? 0 : c + 1});
  }

  del = () => {
    let r = this.state.r;
    let c = this.state.c;
    if (r === 0 && c === 0) return;
    r = c === 0 ? r - 1 : r;
    c = c === 0 ? 2 : c - 1;
    const l = update(this.state.hand, { [r]: { [c]: { $set: 'w' } } });
    this.setState({ result: false, hand: l, r, c });
  }
  
  H = (i, j) => {
    if (this.state.hand[i][j] !== 'w')
      this.setState({ hand: update(this.state.hand, { h: { $set: [i, j] } }) });
  }
  
  M = t => {
    const h = this.state.hand[t];
    if (H.isFilled(h) && H.isH(h))
      this.mg(t, !h.m, h.g);
  }
  
  G = t => {
    const h = this.state.hand[t];
    if (H.isFilled(h) && H.isKG(h) && (h.length === 4 || !H.has4(h[0])(this.state.hand)))
      this.mg(t, h.m, !h.g, h.g ? '' : h[0]);
  }

  mg = (t, m, g, i) => {
    const o = { m: { $set: m }, g: { $set: g } };
    if (i) o['$push'] = [i];
    else if (i === '' && this.state.hand[t].length === 4) o['$splice'] = [[-1, 1]];
    const h = update(this.state.hand, { [t]: o });
    h.h = this.state.hand.h;
    this.setState({ hand: h });
  }

  option = () => {
    this.setState({ option: true });    
  }

  calc = () => {
    const s = this.state;
    const hs = s.hand;
    //const hs = [['w1', 'w2', 'w3'], ['w2', 'w3', 'w4'], ['w3', 'w4', 'w5'], ['w7', 'w8', 'w9'], ['f2', 'f2']];
    //hs.h = [0, 0];
    if (!H.isValid(hs)) this.setError('诈和！\nNot a valid winning hand!');
    else if (!hs.h) this.setError('请先选择和牌的那张牌.\nPlease select the winning tile first.');
    else {
      const rs = data.rules;
      const ex = [];

      const rs1 = rs.filter(x => {
        if (x[0] === 60 || x[0] === 61) {
          const fk = 'f' + (x[0] === 60 ? s.rw : s.dw);
          if (hs.some(h => H.isKG(h) && h[0] === fk)) return true;
        }
        if (R.contains(x[0], options)) {
          return s.sp && s.sp[x[0].toString()];
        }

        let r = x[7];
        if (!r) return false;
        if (!R.is(Array, r[0])) r = [r];

        let all = [];
        return r.every(r1 => {
          if (R.is(Function, r1[0])) return r1.every(f => all.length > 0 ? f(all) : f(hs));

          let mf = null;
          if (R.is(Function, r1[1])) mf = r1[1];
          else if (R.is(Array, r1[1])) mf = h => r1[1].every(f => f(h));
          else {
            let mf1 = null;
            if (R.is(Function, r1[2])) mf1 = r1[2];
            else if (R.is(Array, r1[2])) mf1 = t => r1[2].every(f => f(t));
            else mf1 = t => R.contains(t, R.splitEvery(2, r1[2]));
            mf = H.meet(r1[1], mf1);
          }

          //return H.meet(r1[0], mf, hs);
          const met = H.meet(r1[0], mf, hs);
          all = all.concat(met);
          return met.isMet;
        });
      });

      if (rs1.length === 0) rs1.push(rs[42]);

      const rs2 = R.pipe(R.chain(R.nth(8)), R.uniq, x => rs1.filter(y => !R.contains(y[0], x)))(rs1);
      this.setState({ result: true, total: R.sum(rs2.map(x => +x[1])), rs: rs2 });
    }
  } 
  
  setError = x => {
    this.setState({ error: x });
  }

  clearError = () => {
    this.setState({ error: null, option: null, about: null });
  }

  changeWind = (t, v) => {
    this.setState(t === 0 ? { rw: v } : { dw: v });
  }

  toggle = (i, e) => {
    const sp = {...this.state.sp};
    const b = e.target.checked;
    sp[i.toString()] = b;
    if (b) {
      if (i === 44) sp['45'] = false;
      if (i === 45) sp['44'] = sp['46'] = false;
      if (i === 46) sp['45'] = sp['47'] = false;
      if (i === 47) sp['46'] = sp['58'] = false;
      if (i === 58) sp['47'] = false;
    }
    this.setState({ sp });
  }

  about = () => {
    this.setState({ about: true });
  }

  render() {
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    const ratio = vw / vh;
    const ws = 114;
    const ir = 180 / 142;
    const w2 = (vw - 142) / 4;
    const h0 = vh * 0.55 - ws;
    const h2 = (vw - 16) / 9 * ir;
    let w1 = ((h2 * 4 + 6) > h0 ? vh * 0.45 : vh - h2 * 4 - ws) / 5 / ir;
    w1 = w1 < w2 ? w1 : w2;
    const h3 = vh - (w1 * ir * 5 + 8) - ws;
    let h1 = h0 / 4;
    h1 = h1 < h2 ? h1 : h2;
    const wr = ratio < 0.6 ? 'w20' : (ratio < 0.7 ? 'w15' : 'w12'); // < 0.6 = phone, > 0.7 = 10", 0.6 ~ 0.7 = 7"
    const wr1 = ratio < 0.6 ? 'w100' : (ratio < 0.7 ? 'w90' : 'w85');
    const old = vw <= 320;

    const rs = data.rules;
    const s = this.state;
    const hs = s.hand;
    const l = ['w', 't', 'b'].map(x => R.range(1, 10).map(y => x + y)).concat([['ww', 'f1', 'f2', 'f3', 'f4', 'j1', 'j2', 'j3', 'ww']]);
    const pl = l.map(x =>
      <div className={`f jcsb pv1`}>
        {x.map(y =>
          <img src={`./images/${y}.png`} style={{height: h1.toFixed(2) + 'px'}} onTouchTap={tap(this.add, y)}
            className={`usn ${H.has4(y)(this.state.hand) ? 'op25' : ''}`} />
        )}
      </div>
    );
    const ok = [<div className="btn hYellowgreen" onTouchTap={tap(this.clearError)}>OK</div>];
    const bst = (t, w) => `btn w${w === 0 ? 30 : 10} ph1 fs1 ${w === 0 ? 'mr4' : ''} ${t === 0 ? 'hYellowgreen' : 'hOrange'} ${old ? 'fs12' : ''}`;

    return (
      <div className="fv">
        <Nav page="calc" navTo={() => hashHistory.push('/rule')} />
        {/*<div>w: {document.documentElement.clientWidth}, H: {document.documentElement.clientHeight}, r: {ratio}</div>*/}
        <div className="fs0 fg1 fv">
        {hs.map((x, i) =>
          <div className="f fs0 fg1 jcsb aic">
            <div className="flipc">
              <div className={`flipp ${x.g ? 'flipY' : ''}`} onTouchTap={tap(this.G, i)}>
                {x.g ?
                  <div className="btn c36 mh8 fc hOrange usn flipb">刻</div> :
                  <div className={`btn ${H.isFilled(x) && H.isK(x) && (x.length === 4 || !H.has4(x[0])(hs)) ? '' : 'disabled'} c36 mh8 fc hYellowgreen usn`}>杠</div>
                }
              </div>
            </div>  
            <div className="f jcc fg1 ph8">
              {x.map((y, j) =>
                <div className={`fv fc highlight usn pv1`} onTouchTap={tap(this.H, i, j)}>
                  {y === 'w' || x.m ? null : <div className="highlight-gray"/>}
                  {hs.h && i === hs.h[0] && j === hs.h[1] ? <div className="highlight-red"/> : null}
                  <img src={`./images/${y}.png`} className={`${y === 'w' ? 'op20' : ''}`} style={{width: w1.toFixed(2) + 'px'}}/>
                </div>
              )}
            </div>
            <div className="flipc">
              <div className={`flipp ${x.m ? 'flipY' : ''}`} onTouchTap={tap(this.M, i)}>
                {x.m ?
                  <div className="btn c36 mh8 fc hLightgray flipb usn">暗</div> :
                  <div className={`btn ${H.isFilled(x) && H.isH(x) ? '' : 'disabled'} c36 mh8 fc hWhite usn`}>明</div>
                }
              </div>
            </div>  
          </div>
        )}
        </div>
        <div className="spv8" />
        <div className={`f w100`} id="btns">
          <div className={bst(0, 0)} onTouchTap={tap(this.calc)}>计算 Calc</div>
          <div className={bst(1, 0)} onTouchTap={tap(this.del)}>删除 Del</div>
          <div className={bst(1, 0)} onTouchTap={tap(this.initHand)}>清除 Clear</div>
          <div className={bst(0, 1)} onTouchTap={tap(this.option)}>...</div>
        </div>
        <div className="spv8" />
        <div className={`fv aic fg1 fs0 oxh ${s.result ? 'oys' : 'oyh'}`}>
          {s.result ?
            <div className={`fv w100 White`} style={{height: (h3 + 8).toFixed(2) + 'px'}}>
              <div className="fw8 fs24 tac">总番数 Total：{s.total}</div>
              <div>{(s.rs || []).map(x => <Rule x={x}/>)}</div>
            </div> : pl
          }
        </div>
        <Dialog actions={ok} modal={false} contentStyle={{maxWidth: '400px'}}
          className="dialog" open={s.error != null} onRequestClose={this.clearError}>
          <div className="fv">
            {s.error && s.error.split('\n').map(x => <div>{x}</div>)}
          </div>
        </Dialog>
        <Dialog actions={ok} modal={false} contentStyle={{maxWidth: '400px'}}
          className="dialog" open={s.option} onRequestClose={this.clearError}>
          <div className="fs18 fw6">特殊番种 {old ? '' : 'Special Points'}</div>
          {old ? <div className="fs18 fw6">Special Points</div> : null}
          <div className="spv16"/>
          <div className={`${old ? 'fs12' : ''}`}>
            <Wind type={0} value={s.rw} click={this.changeWind} />
            <div className="spv8"/>
            <Wind type={1} value={s.dw} click={this.changeWind} />
            <div className="spv8"/>
            <div>
              {rs.filter(x => R.contains(x[0], options)).map(x =>
                <div className="f aic">
                  <div className="fg1">{x[1]} - {x[2]} - {x[3]}</div>
                  <Toggle className="toggle" toggled={s.sp ? s.sp[x[0].toString()] : false} onToggle={e => this.toggle(x[0], e)} />
                </div>
              )}
            </div>
          </div>
        </Dialog>
      </div>
    );
  }
}

export default connect(x => ({ layout: x.jjmj.layout }))(Calc);
