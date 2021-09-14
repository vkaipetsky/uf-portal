import React from 'react';
import { Link } from 'react-router-dom';

function Home() {

    const HomeCard = ({ to, color, children }) => {
        return (
            <Link to={to} class={`rounded-lg m-1 p-24 w-1/3 ${color ? color : 'bg-blue-500'} text-white font-bold text-4xl shadow-md hover:shadow-xl hover:opacity-80`}>
                {children}</Link>
        );
    };

    const HeroText = ({ children }) => {
        return <h1 class="text-8xl font-roboto text-left text-gray-800 m-12 font-black">{children}</h1>
    }

    return (
        <div class="flex flex-col items-center h-screen mt-12">
            <section class="h-screen md:h-5/6  w-full items-center justify-center flex flex-col mt-24">
                <HeroText>Unicorn Finance <br /> Dev Portal</HeroText>
                <div class="flex flex-row flex-wrap justify-center my-12">
                    <HomeCard to="/private">
                        Visit a Sample Restricted Page
                    </HomeCard>
                    <HomeCard to="/private" color='bg-green-500'>
                        About us
                    </HomeCard>
                    <HomeCard to="/private" color='bg-pink-500'>
                        Learn more
                    </HomeCard>
                </div>

            </section>
            <section class="h-screen md:h-1/2 bg-blue-300 w-full">second section</section>
        </div>
    );
}

export default Home;
