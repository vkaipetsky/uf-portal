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
