import { combineReducers } from 'redux';
import {routerReducer} from 'react-router-redux';
import jjmj from './jjmjReducer';

export default combineReducers({
  jjmj,
  routing: routerReducer
});
