import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';

function Header() {
    const { oktaAuth, authState } = useOktaAuth();
    const [ user, setUser ] = useState(null);

    const login = async () => { await oktaAuth.signInWithRedirect(); }
    const logout = async () => { await oktaAuth.signOut(); }

    const userText = authState.isAuthenticated
        ? <button onClick={ logout }>Logout</button>
        : <button onClick={ login }>Sign In</button>;

    if (authState.isAuthenticated) {
        console.log('Okta authState: ', authState);
        console.log('oktaAuth: ', oktaAuth);
        oktaAuth.getUser().then(newUser => {
            // console.log('oktaAuth.getUser(): ', user);
            if (!user || (newUser.email !== user.email)) {
                // User changed!
                // console.log('setting user to: ', newUser);
                setUser(newUser);
            }
        })

        const queryGlobalAPIFromReact = false;
        if (queryGlobalAPIFromReact) {
            async function apiDataGlobalCORS() {
                const apiResponse = await fetch('https://api.unicorn-finance-protected.com/');
                return apiResponse.json();
            }

            apiDataGlobalCORS().then((res) => {
                console.log('apiDataGlobalCORS response: ', res);
            })

            async function apiDataGlobalRestrictedCORS() {
                const apiResponse = await fetch(
                    'https://api.unicorn-finance-protected.com/restricted',
                    {headers: {'Authorization': 'Bearer ' + authState.accessToken.accessToken}}
                );
                return apiResponse.json();
            }

            apiDataGlobalRestrictedCORS().then((res) => {
                console.log('apiDataGlobalRestrictedCORS response: ', res);
            })
        }

        const queryGlobalAPI = true;
        if (queryGlobalAPI) {
            async function apiData() {
                const apiResponse = await fetch('/api/');
                return apiResponse.json();
            }

            apiData().then((res) => {
                console.log('apiData response: ', res);
            })

            async function apiExtData() {
                const apiResponse = await fetch('/api/ext/?accessToken=' + authState.accessToken.accessToken);
                return apiResponse.json();
            }

            apiExtData().then((res) => {
                console.log('apiExtData response: ', res);
            })

            async function apiExtProtectedData() {
                const apiResponse = await fetch('/api/ext_protected/?accessToken=' + authState.accessToken.accessToken);
                return apiResponse.json();
            }

            apiExtProtectedData().then((res) => {
                console.log('apiExtProtectedData response: ', res);
            })
        }
        
        const queryTheLocalAPI = window.location.hostname === "localhost";
        // const queryTheAPI = true; // TODO: need to setup simple switching between local/remote API testing
        if (queryTheLocalAPI)
        {
            async function apiDataLocal8081() {
                const apiResponse = await fetch('http://localhost:8081/');
                return apiResponse.json();
            }

            apiDataLocal8081().then((res) => {
                console.log('apiDataLocal8081 response: ', res);
            })

            async function apiDataLocalAuthorized8081() {
                const apiResponse = await fetch('http://localhost:8081/', {headers: {'Authorization': 'Bearer ' + authState.accessToken.accessToken}});
                return apiResponse.json();
            }

            apiDataLocalAuthorized8081().then((res) => {
                console.log('apiDataLocalAuthorized8081 response: ', res);
            })

            async function apiDataLocalRestricted8081() {
                const apiResponse = await fetch('http://localhost:8081/restricted', {headers: {'Authorization': 'Bearer ' + authState.accessToken.accessToken}});
                return apiResponse.json();
            }

            apiDataLocalRestricted8081().then((res) => {
                console.log('apiDataLocalRestricted8081 response: ', res);
            })

        }
    }

    return (
        <header>
            <div>Unicorn Finance Dev Portal</div>
            <ul className="menu">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/private">Restricted</Link></li>
            </ul>
            {user && (
                <div>
                    Logged in as "{user.name}", email: {user.email}
                </div>
            )}
            {userText}
        </header>
    );
}

export default Header;
