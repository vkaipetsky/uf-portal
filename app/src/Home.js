import React from 'react';
import { Link } from 'react-router-dom';
import inSyncImage from './assets/undraw_In_sync.svg';
import undrawTeam from './assets/undraw_team.svg';
import { ReactComponent as LockOpen } from './assets/lock-open.svg';
import { ReactComponent as LockClosed } from './assets/lock-closed.svg';
import Fade from 'react-reveal/Fade';

function Home() {

    const HeroText = ({ children }) => {
        return <h1 class="text-8xl font-roboto text-left text-gray-800 m-12 font-black">{children}</h1>
    }

    const HomeCard = ({ to, color, children, right }) => {
        return (
            <Link to={to}
                class={`transition duration-500 ${right ? 'text-right' : 'text-left'} rounded-lg m-1 p-24 w-1/3 ${color ? color : 'bg-blue-500'} text-white font-bold text-4xl shadow-md hover:shadow-xl hover:opacity-80`}>
                {children}</Link>
        );
    };

    return (
        <div class="flex flex-col items-center w-screen mt-12">
            <section class="min-h-screen w-full items-center justify-center flex flex-col mt-12">
                <div class="flex-1">
                    <Fade bottom>
                        <HeroText>Unicorn Finance <br /> Dev Portal</HeroText>
                    </Fade>
                    <img src={inSyncImage} />
                </div>
                <div class="flex flex-col">
                    <div class="flex flex-row mx-48 justify-center items-center my-24">
                        <HomeCard to="/private">Visit a sample Restricted Page</HomeCard>
                        <p class="font-roboto text-gray-600 font-medium text-xl ml-24">
                            This website uses <a href="https://www.okta.com/" class="transition duration-150 tracking-wide text-blue-500 font-bold hover:text-blue-400">OKTA </a>
                            for authentication.
                            <br /><br />
                            <span class="text-gray-500 font-light text-md flex flex-col">
                                <span class="flex flex-row">
                                    <LockOpen class="w-5 mr-4 text-blue-500" alt="an open lock" />
                                    Authenticated users will be able to access restricted content.
                                </span>

                                <span class="flex flex-row mt-2">
                                    <LockClosed class="w-5 mr-4 text-blue-500" alt="a closed lock" />
                                    Unauthenticated users will be redirected to the<strong class="tracking-wide text-blue-500 font-bold ml-1">OKTA login portal </strong>
                                </span>
                            </span></p>
                    </div>
                    <div class="flex flex-row mx-48 justify-center items-center">
                        <img src={undrawTeam} class="flex-1 h-1/2" />
                        <HomeCard to="/about" color="bg-pink-500" right>About us</HomeCard>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
