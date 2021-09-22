import React, { useState, useEffect } from 'react';
import { ReactComponent as TrashIcon } from './assets/trash.svg';
import { ReactComponent as PlusIcon } from './assets/plus.svg';
import { ReactComponent as MinusIcon } from './assets/minus.svg';
import { ReactComponent as UndrawDev } from './assets/undraw_dev.svg';
import { v4 as uuidv4 } from 'uuid';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const DeveloperPage = () => {
    const [apiKeys, setApiKeys] = useState({});
    const [showKeyGenerator, setShowKeyGenerator] = useState(false);
    const [generatorKeyTitle, setGeneratorKeyTitle] = useState('');
    const [showCopyMessage, setShowCopyMessage] = useState(false);
    const [showDeleteWarning, setShowDeleteWarning] = useState(false);
    const [selectedApiKey, setSelectedApiKey] = useState('');
    const [someKeysGotDeleted, setSomeKeysGotDeleted] = useState(false);

    async function apiAppsData() {
        const apiResponse = await fetch('/okta_apps');
        return apiResponse.json();
    }

    // When this component first mounts, this will get called
    useEffect(() => {
        apiAppsData().then((res) => {
            console.log('apiAppsData response: ', res);
            console.log('response.currentPage.items: ', res);

            // Create the new keys object
            let newKeys = {};
            for (const appIndex in res) {
                let curApp = res[appIndex];

                newKeys[curApp.client_id] = curApp;
            }

            // Update the keys
            setApiKeys(newKeys);
        })
    },
        // Dependencies
        [someKeysGotDeleted]
    );

    function detectClientType(apiKey) {
        if (apiKey.token_endpoint_auth_method === 'private_key_jwt') {
            return 'JWT';
        } else {
            if (apiKey.token_endpoint_auth_method === 'client_secret_basic') {
                return 'Basic';
            }
            else {
                return '---';
            }
        }
    }

    function generateSecretForClient(apiKey) {
        if (apiKey.token_endpoint_auth_method === 'private_key_jwt') {
            const generatedSecret = 'Private Key:' + apiKey.secret;
            // console.log('generateSecretForClient for JWT ' + apiKey.client_id + ': ' + generatedSecret);
            return generatedSecret;
        } else {
            if (apiKey.token_endpoint_auth_method === 'client_secret_basic') {
                const generatedSecret = apiKey.client_id + ':' + apiKey.secret;
                // console.log('generateSecretForClient for Basic ' + apiKey.client_id + ': ' + generatedSecret);
                return btoa(generatedSecret);
            }
            else {
                return apiKey.client_id;
            }
        }

        return apiKey.client_id;
    }

    const ApiKeyEntry = ({ apiKey }) => {
        const updateSelectedAndShowDelete = () => {
            setSelectedApiKey(apiKey.client_id);
            setShowDeleteWarning(true);
        };

        return (
            <li class="flex flex-row my-1 hover:bg-gray-200 px-2 py-4 text-gray-700 rounded-md font-roboto cursor-pointer">
                <CopyToClipboard text={generateSecretForClient(apiKey)} onCopy={() => handleDisplayCopyMessage()}>
                    <div class="flex flex-row flex-1">
                        <span class="flex-1">{detectClientType(apiKey)}</span>
                        <span class="flex-1">{apiKey.client_name}</span>
                        <span class="flex-1">{apiKey.client_id}</span>
                    </div>
                </CopyToClipboard>
                <button onClick={() => updateSelectedAndShowDelete()} class="text-gray-600 hover:text-red-500"><TrashIcon /></button>
            </li>
        );
    }

    const AddApiKeyButton = () => {
        return (
            <button onClick={() => setShowKeyGenerator(!showKeyGenerator)} class="absolute -bottom-6 -right-4 rounded-full w-12 h-12 bg-blue-500 hover:bg-blue-400 flex justify-center items-center text-white shadow-md">
                {
                    showKeyGenerator ? <MinusIcon /> : <PlusIcon />
                }
            </button>
        )
    }

    const handleGenerateKey = () => {
        async function createKey() {
            // TODO: Use the actual token here
            const urlToCreate = '/clients/create?accessToken=123&clientName=' + generatorKeyTitle;
            console.log('handleGenerateKey calling: ' + urlToCreate)
            const apiResponse = await fetch(urlToCreate, {method: 'POST'});
            return apiResponse.json();
        }

        createKey().then((res) => {
            console.log('createKey response: ', res);

            setSomeKeysGotDeleted(true); // TODO: this won't cause a redraw for subsequent deletions...
            setShowDeleteWarning(false);
        })

        // const newApiKeys = Object.assign({}, apiKeys);
        // const key = uuidv4();
        // newApiKeys[key] = { name: generatorKeyTitle, key }
        // setApiKeys(newApiKeys);
    }

    const handleDeleteKey = (key) => {

        async function deleteKey() {
            // TODO: Use the actual token here
            const urlToDelete = '/clients/delete?accessToken=123&appIdToDelete=' + key;
            console.log('handleDeleteKey calling: ' + urlToDelete)
            const apiResponse = await fetch(urlToDelete);
            return apiResponse.json();
        }

        deleteKey().then((res) => {
            console.log('deleteKey response: ', res);

            setSomeKeysGotDeleted(true); // TODO: this won't cause a redraw for subsequent deletions...
            setShowDeleteWarning(false);
        })
    }

    const handleDisplayCopyMessage = () => {
        setShowCopyMessage(true);
        setTimeout(() => { setShowCopyMessage(false) }, 4000)
    }

    const DeleteConfirmationDialog = () => {
        return (
            <div class={`transition duration-300 p-4 flex flex-col bg-gray-100 rounded-md absolute -right-1/2 top-1/2 shadow-md ${showDeleteWarning ? 'opacity-100' : 'opacity-0 hidden'}`}>
                <span class="font-roboto text-gray-700 font-light">
                    Are you sure you want to delete this API key?
                </span>
                <div class="flex items-end justify-end mt-2 font-roboto">
                    <button onClick={() => handleDeleteKey(selectedApiKey)} class="hover:bg-blue-400 shadow-md mr-4 rounded-full bg-blue-500 text-white font-light px-2 text-md tracking-wide">Yes</button>
                    <button onClick={() => setShowDeleteWarning(false)} class="hover:bg-gray-300 shadow-md rounded-full bg-gray-400 text-gray-700 px-2 text-md tracking-wide">Cancel</button>
                </div>
            </div>
        );
    };

    const KeyCopiedMessage = () => {
        return (
            <div class={`transition duration-500 ${showCopyMessage ? 'opacity-100' : 'opacity-0'} absolute top-4 right-6 font-roboto font-medium tracking-wide text-xs text-blue-500`}>
                Key copied to clipboard
            </div>
        );
    };

    return (
        <div class="flex flex-col items-center w-screen min-h-screen">
            <div class="h-full w-full mt-24 p-24">
                <h1 class="font-roboto font-black text-4xl text-gray-800">Developer</h1>

                <div class="relative flex flex-row">
                    <div class="p-4 flex flex-col bg-gray-100 rounded-md mt-12 w-2/3 shadow-md relative z-10">
                        <DeleteConfirmationDialog />
                        <h2 class="font-roboto text-xl font-medium text-gray-800">My API Keys</h2>
                        <KeyCopiedMessage />
                        <ul class="max-h-96 overflow-y-auto">
                            {
                                Object.keys(apiKeys).length === 0 ? <span class="font-roboto font-light text-gray-700 text-sm tracking-wide">You currently have no API keys.</span>
                                    : Object.keys(apiKeys).map((apiKey) => <ApiKeyEntry apiKey={apiKeys[apiKey]} />)
                            }
                        </ul>
                        <AddApiKeyButton />
                    </div>
                    <div class="ml-12 mt-12 flex flex-col items-center justify-center">
                        <button onClick={() => console.log('basic cred')} class="px-4 py-2 bg-blue-500 hover:bg-blue-400 font-roboto shadow-md font-light rounded-full text-white flex flex-row items-center"><PlusIcon class="mr-1 h-4 items-center" />Create a client with Basic Credentials</button>
                        <button onClick={() => console.log('jwt assert auth')} class="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-400 font-roboto shadow-md font-light rounded-full text-white flex flex-row items-center"><PlusIcon class="mr-1 h-4 items-center" />Create a client with signed JWT assertion auth</button>
                    </div>
                    <div class={`absolute items-center transform transition animated opacity-0 duration-500 ${showKeyGenerator && 'translate-y-20 opacity-100'} bottom-4 w-2/5 flex flex-row p-2`}>
                        <label for="key-title-input" class="mr-2 font-roboto text-gray-600 font-light">Key title</label>
                        <input onChange={(e) => setGeneratorKeyTitle(e.target.value)} id="key-title-input" class="bg-gray-100 flex-1 mr-2 rounded-md px-4 py-1 h-8 text-gray-800 font-roboto font-light shadow-sm"></input>
                        <button onClick={() => handleGenerateKey()} class="font-roboto text-white font-light bg-blue-500 hover:bg-blue-400 rounded-md px-2 py-1 h-8 text-sm tracking-wide shadow-md">Generate Key</button>
                    </div>
                </div>
                <UndrawDev class="w-1/4 h-1/4 absolute bottom-24 right-24 mb-4" />
            </div>
        </div>
    );
};

export default DeveloperPage;