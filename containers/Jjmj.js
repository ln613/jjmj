import React from 'react';
import {connect} from 'react-redux';
import { hashHistory } from 'react-router';
import $ from 'jquery';
import R from 'ramda';
import Nav from '../components/Nav';
import Rule from '../components/Rule';
import data from '../data';

class Jjmj extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  componentWillMount() {
    this.props.dispatch({ type: 'get_games', date: new Date() });
  }

  componentDidMount() {
    this.resize();
    window.onresize = e => this.resize();    
    window.onkeydown = e => this.ctrl(e);
  }

  resize = () => {
    this.props.dispatch({
      type: 'layout', val: {
        w: document.documentElement.clientWidth,
        h: document.documentElement.clientHeight
      }
    });
  } 
  
  ctrl(e) {
    let p = this.refs.player;
    switch (e.key) {
      case 'Spacebar':
      case ' ':
        p.togglePlay();
        break;
      case 'ArrowLeft':
      case 'Left':
        p.left();
        break;
      case 'ArrowRight':
      case 'Right':
        p.right();
        break;
      case 'PageUp':
      case 'Prior':
        this.prev();
        break;
      case 'PageDown':
      case 'Next':
        this.next();
        break;
      default:
        break;
    }
  }
  
  date = (e, x) => {
    this.props.dispatch({ type: 'get_games', date: x });
  }

  click = (x, pl) => {
    //if (pl)
    //  this.props.dispatch({ type: 'list' });
    //else
      this.props.dispatch({ type: 'get_game', id: x.id });
  }

  left = () => {
    if (this.refs.player) this.refs.player.left();
  }

  right = () => {
    if (this.refs.player) this.refs.player.right();
  }

  next = () => {
    this.props.dispatch({ type: 'next' });
  }

  error = () => {
    if (this.props.game)
      this.props.dispatch({ type: this.props.game.err ? 'next' : 'error' });
  }

  prev = () => {
    this.props.dispatch({ type: 'prev' });
  }

  showScore = (e, c) => {
    this.props.dispatch({ type: 'show_score', val: c });
  }

  demo = x => {
    if (this.state.demo)
      this.setState({ demo: null });
    else
      this.setState({ demo: x });
  }
  
  render() {
    //const st = this.props.setting || {};
    //const land = this.props.layout && this.props.layout.w > this.props.layout.h;
    const l = ['w', 't', 'b'].map(x => R.range(1, 10).map(y => x + y));
    const pl = l.map(x =>
      <div className="f">
      {x.map(y =>
        <div><img src={`./images/${y}.png`} className="w100"/></div>
      )}
      </div>
    );
    const rs = data.rules;
    const d = this.state.demo;
    const dl = d ? d[6].map(x => R.splitWhen(R.is(Number), x)) : [];

    return (
      <div className="fv">
        <Nav page="rules" navTo={() => hashHistory.push('/')} />
        <div className="spv4"/>
        {d ? <Rule d={d} x={d} c={this.demo}/> : <div>{rs.map(x => <Rule x={x} c={this.demo}/>)}</div>}
        <div className="spv8"/>
        {d ?
        <div className="fv">
          <div>{d[4]}</div>
          <div className="spv8"/>
          <div>{d[5]}</div>
          <div className="spv16"/>
          {dl.map((x, i) => {
            const hg = x[1].length > 0 && x[1][0] === -1;
            return (
              <div className="fc">
              {x[0].map((y, j) =>
                <div className="highlight usn">
                  {R.contains(j, x[1]) || hg ? <div className={`highlight-${hg ? 'gray' : 'red'}`}/> : null}
                  <img src={`./images/${y}.png`} style={{maxHeight: '88px'}}/>
                </div>
              )}
              </div>
            );
          })}
        </div>
        : null}
      </div>
    );
  }
}

export default connect(x => ({ layout: x.jjmj.layout }))(Jjmj);
