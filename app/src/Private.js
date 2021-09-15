import React from 'react';
import undrawAuth from './assets/undraw_auth.svg';

function Private() {
    return (
        <div className="page" class="min-h-screen pt-24 flex flex-col justify-center items-center">
            <div class="flex flex-col font-roboto">
                <span class="font-medium text-gray-800 text-3xl">This page has Restricted Access</span>
                <span class="text-gray-500 mt-2">This content is only viewable after OKTA authentication</span>
            </div>
            <img src={undrawAuth} alt="Illustration of authentication" />
        </div>
    );
}

export default Private;
