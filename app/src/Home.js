import React from 'react';
import { Link } from 'react-router-dom';

function Home() {

    const HomeCard = ({to, children}) => {
        return (
            <Link to={to} class="rounded-lg p-24 w-1/3 bg-blue-500 mt-4 text-white font-bold text-4xl shadow-md hover:shadow-xl hover:bg-blue-400">{children}</Link>
        );
    };

    return (
        <div class="flex flex-col justify-center items-center">
                <HomeCard to="/private">
                    Visit a Sample Restricted Page
                </HomeCard>
        </div>
    );
}

export default Home;
