import { AppContainer } from 'react-hot-loader';
import ReactDOM from 'react-dom';
import React from 'react';
import { Router } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';
import createHashHistory from 'history/createHashHistory';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';
import configureStore from './stores/store';
import routes from './routes';
import { makeSelectLocationState } from 'containers/App/selectors';
import { isNative } from 'utils/electron';
import Root from './containers/Root';
import './assets/reset.css';
import './global-styles';

// Create redux store with history
// this uses the singleton browserHistory provided by react-router
// Optionally, this could be changed to leverage a created history
// e.g. `const browserHistory = useRouterHistory(createBrowserHistory)();`
const initialState = {};
const routerHistory = isNative() ? createHashHistory() : createBrowserHistory();
const store = configureStore(initialState, routerHistory);

// Sync history and store, as the react-router-redux reducer
// is under the non-default key ("routing"), selectLocationState
// must be provided for resolving how to retrieve the "route" in the state
const history = syncHistoryWithStore(routerHistory, store, {
  selectLocationState: makeSelectLocationState(),
});

const rootEl = document.getElementById('root');

ReactDOM.render(
  <AppContainer>
    <Root history={history} store={store} />
  </AppContainer>,
  rootEl // eslint-disable-line comma-dangle
);

// Non-production hot reloading
if (process.env.NODE_ENV !== 'production') {
  if (module.hot) {
    module.hot.accept('./containers/Root', () => {
      const NextApp = require('./containers/Root').default;  // eslint-disable-line global-require
      ReactDOM.render(
        <AppContainer>
          <NextApp history={history} store={store} />
        </AppContainer>,
        rootEl // eslint-disable-line comma-dangle
      );
    });
  }
}
