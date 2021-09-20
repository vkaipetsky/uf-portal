import React from 'react';
import { ReactComponent as MenuIcon } from '../../assets/menu.svg';

const UserEntry = ({ user, id, setSelectedUserId, setShowUserMenu, avatar }) => {

    const handleOpenMenu = () => {
        setSelectedUserId(id);
        setShowUserMenu(true);
    }

    return (
        <li onClick={() => handleOpenMenu()} class="flex flex-row my-1 hover:bg-gray-200 px-2 py-4 text-gray-700 rounded-md font-roboto cursor-pointer items-center">
            <div class="flex flex-row flex-1">
                {avatar}
                <span class="flex-1 flex items-center ml-4 font-roboto font-light">{user.name}</span>
                <span class="flex-1 flex items-center font-roboto font-light">{user.role}</span>
            </div>
            <button onClick={() => handleOpenMenu()} class="text-gray-600 hover:text-gray-400 mr-4"><MenuIcon /></button>
        </li>
    );
}

export default UserEntry;