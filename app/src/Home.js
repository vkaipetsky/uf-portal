import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="page">
            <h1>Home Page</h1>
            <Link to="/private">
                <button type="button">
                    Visit a Sample Restricted Page
                </button>
            </Link>
        </div>
    );
}

export default Home;
