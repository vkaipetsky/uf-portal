import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import { ReactComponent as CloseIcon } from './assets/close.svg';
import { ReactComponent as UserGroupIcon } from './assets/user-group.svg';
import { ReactComponent as TerminalIcon } from './assets/terminal.svg';
import logo from './assets/uf-logo-black.png';

function Header() {

    const { oktaAuth, authState } = useOktaAuth();
    const [user, setUser] = useState(null);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const login = async () => { await oktaAuth.signInWithRedirect(); }
    const logout = async () => { await oktaAuth.signOut(); }

    const LoginButton = ({ onClick, children }) => {
        return <button onClick={onClick} class="bg-blue-500 h-8 tracking-widest font-roboto font-light text-xs shadow-sm hover:bg-blue-400 hover:shadow-lg rounded-full px-4 py-2 text-white uppercase">{children}</button>
    };

    const LogoutButton = ({ onClick, children }) => {
        return <button onClick={onClick} class="h-8 tracking-widest font-roboto font-light text-xs hover:text-gray-400 rounded-full mx-4 text-gray-700 uppercase">{children}</button>
    };

    const userText = authState.isAuthenticated
        ? ''
        : <LoginButton onClick={login}>Login</LoginButton>

    let showAdminHeaderLink = false;

    if (authState.isAuthenticated) {
        console.log('Okta authState: ', authState);
        console.log('oktaAuth: ', oktaAuth);
        oktaAuth.getUser().then(newUser => {
            console.log('oktaAuth.getUser(): ', user);
            if (!user || (newUser.email !== user.email)) {
                // User changed!
                // console.log('setting user to: ', newUser);
                setUser(newUser);
            }
        })

        function parseJwt (token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        }

        const userAccessToken = parseJwt(oktaAuth.getAccessToken());
        console.log('access_token: ', userAccessToken);

        if (userAccessToken.groups.includes('Admins')) {
            showAdminHeaderLink = true;
        }

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

        async function apiGatewayIrelandAdminQuery() {
            const apiResponse = await fetch('/api/test_api_gw_ireland_admin/?accessToken=' + authState.accessToken.accessToken);
            return apiResponse.json();
        }

        apiGatewayIrelandAdminQuery().then((res) => {
            console.log('apiGatewayIrelandAdminQuery response: ', res);
        })

    }

    const HeaderLink = ({ to, children }) => {
        return <Link to={to} class="text-gray-500 font-roboto hover:text-gray-700 tracking-wider">{children}</Link>
    };

    const getUserInitials = () => {
        const splitName = user.name.split(' ');
        return `${splitName[0][0]}${splitName[1][0]}`;
    }

    const Avatar = () => {
        return (
            <div onClick={() => setShowUserMenu(!showUserMenu)} class="rounded-full h-12 w-12 mr-2 tracking-wider items-center justify-center flex bg-blue-500 shadow-md hover:bg-blue-400 cursor-pointer text-white font-roboto font-light">
                {
                    getUserInitials()
                }
            </div>
        );
    }

    const UserMenu = () => {

        const UserLink = ({ to, children }) => {
            return (
                <Link class="flex items-center mb-2 font-roboto text-gray-700 font-light bg-gray-100 hover:bg-gray-200 p-2 rounded-md cursor-pointer" to={to}>{children}</Link>
            );
        }

        return (
            <div class="fixed top-4 right-4 rounded-md p-2 shadow-lg">
                <div class="relative w-48 flex flex-col">
                    <Avatar />
                    <button onClick={() => setShowUserMenu(false)}><CloseIcon class="absolute right-0 top-0 h-6 text-gray-500 hover:text-gray-400" /></button>
                    <ul class="p-2 mt-4 flex flex-col">
                        <UserLink to={'/developer'}>
                            <TerminalIcon class="mr-2 h-6" />
                            Developer
                        </UserLink>
                        <UserLink to={'/usermanagement'}>
                            <UserGroupIcon class="mr-2 h-6" />
                            Manage Users
                        </UserLink>
                    </ul>
                    <span class="text-center mt-2">
                        <LogoutButton onClick={logout}>Log out</LogoutButton>
                    </span>
                </div>
            </div>
        );
    };

    return (
        <nav class="py-8 flex flex-row items-center justify-center fixed w-screen top-0 bg-inherit z-10" style={{backdropFilter: 'blur(1px)'}}>
            <Link to="/" class="absolute left-2 w-36"><img src={logo} alt="Unicorn Finance logo" /></Link>
            <ul className="menu">
                <li><HeaderLink to="/">Home</HeaderLink></li>
                <li><HeaderLink to="/private">Restricted</HeaderLink></li>
                <li><HeaderLink to="/developer">Developer</HeaderLink></li>
                {showAdminHeaderLink && <li><HeaderLink to="/usermanagement">Admin</HeaderLink></li>}
            </ul>

            <div class="absolute right-24 flex items-center">
                {
                    user &&
                    <div class="relative">
                        {
                            showUserMenu ? <UserMenu /> : <Avatar />
                        }
                    </div>
                }
                {
                    userText
                }
            </div>
        </nav>
    );
}

export default Header;
