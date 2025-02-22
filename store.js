import {createStore, compose, applyMiddleware} from 'redux';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import rootReducer from './reducers';
import createSagaMiddleware from 'redux-saga';

const sagaMiddleware = createSagaMiddleware();

export default function configureStore(initialState) {
  const middewares = [
    reduxImmutableStateInvariant(),
    sagaMiddleware,
  ];

  const store = createStore(rootReducer, initialState, compose(
    applyMiddleware(...middewares),
    window.devToolsExtension ? window.devToolsExtension() : f => f // add support for Redux dev tools
    )
  );

  //sagaMiddleware.run(watcher);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      const nextReducer = require('./reducers').default; // eslint-disable-line global-require
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
