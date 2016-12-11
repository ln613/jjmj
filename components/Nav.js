import React from 'react';
import Dialog from 'material-ui/Dialog';

export default class Nav extends React.Component {
  render() {
    const p = this.props;
    const s = this.state || {};
    const isCalc = p.page === 'calc';
    const ok = [<div className="btn hYellowgreen" onClick={() => this.setState({ about: false })}>OK</div>];

    return (
      <div className="nav f aic jcsb fs0">
        <div className="fc btn c24 hOrange" onClick={p.navTo}>
          <i className={`fa fa-${isCalc ? 'book' : 'calculator'}`} />
        </div>
        <div>国标麻将 - {isCalc ? '番数计算器' : '规则解释'}</div>
        <div className="fc btn c24 hOrange" onClick={() => this.setState({ about: true })}><i className="fa fa-question" /></div>
        <Dialog title="关于 About" actions={ok} modal={false} contentStyle={{ maxWidth: '400px' }}
          className="dialog" open={s.about} onRequestClose={() => this.setState({ about: false })}>
          <div className="fv">
            <div>国标麻将 World Mahjong</div>
            <div>番数计算器 Points Calculator</div>
            <div className="spv8" />
            <div>作者 Author：李楠 Nan Li</div>
            <div>Email: ln613@hotmail.com</div>
          </div>
        </Dialog>
      </div>
    );
  }  
}

//      <div className="fc" onClick={p.navTo}><i className={`fa fa-${isCalc ? 'book' : 'calculator'}`}/></div>
