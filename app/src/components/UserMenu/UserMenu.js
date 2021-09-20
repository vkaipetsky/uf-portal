import React from 'react';
import { ReactComponent as TrashIcon } from '../../assets/trash.svg';
import { ReactComponent as SuspendIcon } from '../../assets/block.svg';
import { ReactComponent as CloseIcon } from '../../assets/close.svg';
import { ReactComponent as LockIcon } from '../../assets/lock-closed.svg';
import Avatar from '../Avatar/Avatar';

const UserMenu = ({ user, users, setUsers, selectedUserId, setShowUserMenu }) => {
    const handleDeleteUser = () => {
        const newUsers = Object.assign({}, users);
        delete newUsers[selectedUserId];
        setShowUserMenu(false);
        setUsers(newUsers);
    };

    return (
        <div class="p-4 flex flex-col bg-gray-100 rounded-md mt-12 w-1/4 ml-4 shadow-md relative z-10">
            <div class="flex flex-row items-center mb-6">
                <Avatar user={user} />
                <span class="font-roboto font-light text-gray-700 tracking-wide ml-2">{user.name}</span>
                <button onClick={() => setShowUserMenu(false)} class="h-8 absolute right-2 top-2 text-gray-500 hover:text-gray-400">
                    <CloseIcon />
                </button>
            </div>
            <button onClick={() => console.log('do something')} class="tracking-wide text-gray-600 bg-gray-200 hover:text-red-500 hover:bg-gray-300 px-3 py-4 rounded-md flex items-center">
                <SuspendIcon />
                <span class="ml-2 font-roboto font-light text-gray-700">Suspend user</span>
            </button>
            <button onClick={() => console.log('do something')} class="mt-2 tracking-wide text-gray-600 bg-gray-200 hover:text-gray-500 hover:bg-gray-300 px-3 py-4 rounded-md flex items-center">
                <LockIcon />
                <span class="ml-2 font-roboto font-light text-gray-700">Reset password</span>
            </button>
            <button onClick={() => handleDeleteUser()} class="mt-2 tracking-wide text-gray-600 bg-gray-200 hover:text-red-500 hover:bg-gray-300 px-3 py-4 rounded-md flex items-center">
                <TrashIcon />
                <span class="ml-2 font-roboto font-light text-gray-700">Delete user</span>
            </button>
        </div>
    );
};

export default UserMenu;