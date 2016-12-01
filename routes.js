import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/App';
import Jjmj from './containers/Jjmj';
import Icon from './components/Icon';
import Calc from './containers/Calc';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Calc}/>
    <Route path="rule" component={Jjmj}/>
    <Route path="icon" component={Icon}/>
  </Route>
);
