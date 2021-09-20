import React from 'react';

const getUserInitials = (user) => {
    const splitName = user.name.split(' ');
    return `${splitName[0][0]}${splitName[1][0]}`;
}

const Avatar = ({ user }) => {
    return (
        <div class="rounded-full h-12 w-12 mr-2 tracking-wider items-center justify-center flex bg-blue-500 shadow-sm hover:bg-blue-400 cursor-pointer text-white font-roboto font-light">
            {
                getUserInitials(user)
            }
        </div>
    );
}

export default Avatar;