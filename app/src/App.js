import React from 'react';
import './App.css';
import Header from './Header';
import Home from './Home';
import Private from './Private';
import { LoginCallback, SecureRoute, Security } from '@okta/okta-react';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { Route, useHistory } from 'react-router-dom';

const oktaAuth = new OktaAuth({
    issuer: 'https://dev-79177292.okta.com/oauth2/default',
    clientId: '0oa1mg0wgxqX0q1iv5d7',
    redirectUri: window.location.origin + '/callback'
});

const App = () => {
    const history = useHistory();
    const restoreOriginalUri = async (_oktaAuth, originalUri) => {
        history.replace(toRelativeUrl(originalUri, window.location.origin));
    };

    return (
      <div className="App">
        <div className="page">
          <div className="content">
            <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
              <Header/>
              <Route path='/' exact={true} component={Home}/>
              <SecureRoute path='/private' exact={true} component={Private}/>
              <Route path='/callback' component={LoginCallback}/>
              <Route path='/home' component={Home}/>
            </Security>
          </div>
        </div>
      </div>
  );
}

export default App;
