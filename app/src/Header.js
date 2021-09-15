import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import logo from './assets/logo.svg';

function Header() {

    const { oktaAuth, authState } = useOktaAuth();
    const [ user, setUser ] = useState(null);

    const login = async () => { await oktaAuth.signInWithRedirect(); }
    const logout = async () => { await oktaAuth.signOut(); }

    const LoginButton = ({onClick, children}) => {
        return <button onClick={onClick} class="bg-blue-500 tracking-widest font-roboto font-light text-xs shadow-sm hover:bg-blue-400 hover:shadow-lg rounded-full px-4 py-2 text-white uppercase">{children}</button>
    };

    const userText = authState.isAuthenticated
        ? <LoginButton onClick={logout}>Logout</LoginButton>
        : <LoginButton onClick={login}>Login</LoginButton>

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

        const runtimeHostname = window.location.hostname;

        async function apiData() {
            const apiResponse = await fetch('/api/');
            return apiResponse.json();
        }

        apiData().then((res) => {
            console.log('apiData response: ', res);
        })

        async function apiExtData() {
            const apiResponse = await fetch('/api/ext/?accessToken=' + authState.accessToken.accessToken + "&runtimeHostname=" + runtimeHostname);
            return apiResponse.json();
        }

        apiExtData().then((res) => {
            console.log('apiExtData response: ', res);
        })

        async function apiExtProtectedData() {
            const apiResponse = await fetch('/api/ext_protected/?accessToken=' + authState.accessToken.accessToken + "&runtimeHostname=" + runtimeHostname);
            return apiResponse.json();
        }

        apiExtProtectedData().then((res) => {
            console.log('apiExtProtectedData response: ', res);
        })

        async function apiExtAdminQuery() {
            const apiResponse = await fetch('/api/ext_admin/?accessToken=' + authState.accessToken.accessToken + "&runtimeHostname=" + runtimeHostname);
            return apiResponse.json();
        }

        apiExtAdminQuery().then((res) => {
            console.log('apiExtAdminQuery response: ', res);
        })

        async function apiGatewayQuery() {
            const apiResponse = await fetch('/api/test_api_gw/?accessToken=' + authState.accessToken.accessToken);
            return apiResponse.json();
        }

        apiGatewayQuery().then((res) => {
            console.log('apiGatewayQuery response: ', res);
        })

        async function apiGatewayIrelandQuery() {
            const apiResponse = await fetch('/api/test_api_gw_ireland/?accessToken=' + authState.accessToken.accessToken);
            return apiResponse.json();
        }

        apiGatewayIrelandQuery().then((res) => {
            console.log('apiGatewayIrelandQuery response: ', res);
        })

        async function apiGatewayIrelandProtectedQuery() {
            const apiResponse = await fetch('/api/test_api_gw_ireland_protected/?accessToken=' + authState.accessToken.accessToken);
            return apiResponse.json();
        }

        apiGatewayIrelandProtectedQuery().then((res) => {
            console.log('apiGatewayIrelandProtectedQuery response: ', res);
        })

    }

    const HeaderLink = ({to, children}) => {
        return <Link to={to} class="text-gray-500 font-roboto hover:text-gray-700 tracking-wider">{children}</Link>
    };

    return (
        <nav class="py-8 flex flex-row items-center justify-center fixed w-screen top-0 bg-inherit z-10" style={{backdropFilter: 'blur(1px)'}}>
            <Link to="/" class="absolute left-24 w-72"><img src={logo} alt="JP Morgan chase logo" /></Link>
            <ul className="menu">
                <li><HeaderLink to="/">Home</HeaderLink></li>
                <li><HeaderLink to="/private">Restricted</HeaderLink></li>
            </ul>
            {user && (
                <div>
                    Logged in as "{user.name}", email: {user.email}
                </div>
            )}
            <div class="absolute right-24">{userText}</div>
        </nav>
    );
}

export default Header;
