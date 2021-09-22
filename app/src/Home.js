import React from 'react';
import { Link } from 'react-router-dom';
import lockOpen from './assets/lock-open.svg';
import lockClosed from './assets/lock-closed.svg';

function Home() {

    const HomeCard = ({ to, color, children, right}) => {
        return (
            <Link to={to}
                class={`transition duration-500 ${right ? 'text-right' : 'text-left'} rounded-lg m-1 p-4 w-1/2 ${color ? color : 'bg-blue-500'} text-white font-bold text-2xl shadow-md hover:shadow-xl hover:opacity-80`}>
                {children}</Link>
        );
    };

    const ExternalLinkCard = ({ to, color, children, right}) => {
        return (
            <a rel="noopener noreferrer" href={to} target="_blank"
               class={`transition duration-500 text-center rounded-lg m-1 p-4 w-1/2 ${color ? color : 'bg-blue-500'} text-white font-bold text-2xl shadow-md hover:shadow-xl hover:opacity-80`}
            >{children}</a>
        );
    };

    return (
        <div class="flex flex-col items-center w-screen mt-12">
            <section class="min-h-screen w-full items-center justify-center flex flex-col mt-12">
                <ExternalLinkCard to="https://id.unicorn-finance-dev.com/home/jpm-ms-dev_acmeinvestments_1/0oa1dr26qbkFgI0ym1d7/aln1ds4vxfA4EjGA91d7" color="bg-green-500" right>Outbound SSO to ACME Investments</ExternalLinkCard>
                <div class="flex flex-col">
                    <div class="flex flex-row mx-48 justify-center items-center my-24">
                        <HomeCard to="/private">Visit a sample Restricted Page</HomeCard>
                        <p class="font-roboto text-gray-600 font-medium text-xl ml-24">
                            This website uses <a href="https://www.okta.com/" class="transition duration-150 tracking-wide text-blue-500 font-bold hover:text-blue-400">OKTA </a>
                            for authentication.
                            <br /><br />
                            <span class="text-gray-500 font-light text-md flex flex-col">
                                <span class="flex flex-row">
                                    <img src={lockOpen} class="w-5 mr-4" alt="an open lock" />
                                    Authenticated users will be able to access restricted content.
                                </span>

                                <span class="flex flex-row mt-2">
                                    <img src={lockClosed} class="w-5 mr-4" alt="a closed lock" />
                                    Unauthenticated users will be redirected to the<strong class="tracking-wide text-blue-500 font-bold ml-1">OKTA login portal </strong>
                                </span>
                            </span>
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
