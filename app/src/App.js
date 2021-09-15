import React from 'react';
import './App.css';
import Header from './Header';
import Footer from './Footer'
import Home from './Home';
import Private from './Private';
import { LoginCallback, SecureRoute, Security } from '@okta/okta-react';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { Route, Switch, useHistory } from 'react-router-dom';
import PageNotFound from './PageNotFound';

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
      <div className="App" class="overflow-x-hidden min-h-screen">
        <div>
          <div class="min-h-screen relative">
            <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
              <Header/>
              <Switch>
              <Route exact path='/' component={Home}/>
              <Route exact path='/test' component={Private} />
              <SecureRoute exact path='/private' component={Private}/>
              <Route path='/callback' component={LoginCallback}/>
              <Route path='/home' component={Home}/>
              <Route component={PageNotFound} />
              </Switch>
              <Footer />
            </Security>
          </div>
        </div>
      </div>
  );
}

export default App;
