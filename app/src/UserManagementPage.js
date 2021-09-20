import React, { useState } from 'react';
import UserEntry from './components/UserEntry/UserEntry.js';
import Avatar from './components/Avatar/Avatar.js';
import UserMenu from './components/UserMenu/UserMenu';
import { ReactComponent as ManageTeamImage } from './assets/undraw_connecting_team.svg';

const UserManagementPage = () => {

    const [users, setUsers] = useState({
        'x': {
            name: 'Gavin Craig',
            role: 'Developer'
        },
        'y': {
            name: 'John Doe',
            role: 'Developer'
        },
        'z': {
            name: 'John Bean',
            role: 'Developer'
        }
    });

    const [showUserMenu, setShowUserMenu] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState({});

    return (
        <div class="flex flex-col items-center w-screen min-h-screen">
            <div class="h-full w-full mt-24 p-24">
                <h1 class="font-roboto font-black text-6xl text-gray-800">User Management</h1>

                <div class="flex flex-row">
                    <div class="p-4 flex flex-col bg-gray-100 rounded-md mt-12 w-1/2 shadow-md relative z-10">
                        <h2 class="font-roboto text-xl font-medium text-gray-800">My Users</h2>
                        <ul class="max-h-96 overflow-y-auto">
                            {
                                Object.keys(users).length === 0 ? <span class="font-roboto font-light text-gray-700 text-sm tracking-wide">You currently have no Users.</span>
                                    : Object.keys(users).map((userKey) => <UserEntry key={userKey} id={userKey} user={users[userKey]} setSelectedUserId={setSelectedUserId} setShowUserMenu={setShowUserMenu} avatar={<Avatar user={users[userKey]} />} />)
                            }
                        </ul>
                    </div>
                    {
                        showUserMenu && <UserMenu user={users[selectedUserId]} users={users} setUsers={setUsers} selectedUserId={selectedUserId} setShowUserMenu={setShowUserMenu} />
                    }
                </div>
            </div>
            <ManageTeamImage class="absolute bottom-32 right-0 h-1/4" />
        </div>
    );
};

export default UserManagementPage;