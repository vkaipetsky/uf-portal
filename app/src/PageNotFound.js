import React from 'react';
import undrawNotFound from './assets/undraw_camping.svg';
import {Link} from 'react-router-dom';
import LeftArrowSvg from './assets/left-arrow.svg';

const PageNotFound = () => {
    return (
        <div class="h-screen w-screen flex justify-center items-center flex-col">
            <div class="flex flex-col mb-24">
                <span class="font-roboto text-xl text-gray-700">It looks like there's nothing here...</span>
                <Link to="/" class="hover:opacity-70 text-center mt-2 flex flex-row text-blue-500 font-roboto font-medium items-center justify-center"><img src={LeftArrowSvg} class="w-6" alt="Left arrow" />Back to home</Link>
            </div>
            
            <img src={undrawNotFound} alt="Illustration of camper in tent" class="w-2/5" />
        </div>
    );
};

export default PageNotFound;