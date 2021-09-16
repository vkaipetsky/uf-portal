import React, { useState } from 'react';
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

    const ApiKeyEntry = ({ apiKey }) => {
        const updateSelectedAndShowDelete = () => {
            setSelectedApiKey(apiKey.key)
            setShowDeleteWarning(true);
        };

        return (
            <li class="flex flex-row my-1 hover:bg-gray-200 px-2 py-4 text-gray-700 rounded-md font-roboto cursor-pointer">
                <CopyToClipboard text={apiKey.key} onCopy={() => handleDisplayCopyMessage()}>
                    <div class="flex flex-row flex-1">
                        <span class="flex-1">{apiKey.name}</span>
                        <span class="flex-1">{apiKey.key}</span>
                    </div>
                </CopyToClipboard>
                <button onClick={() => updateSelectedAndShowDelete()} class="text-gray-600 hover:text-red-500"><TrashIcon /></button>
            </li>
        );
    }

    const AddApiKeyButton = () => {
        return (
            <button onClick={() => setShowKeyGenerator(!showKeyGenerator)} class="absolute -bottom-6 -right-4 rounded-full w-12 h-12 bg-blue-500 hover:bg-blue-400 flex justify-center items-center text-white">
                {
                    showKeyGenerator ? <MinusIcon /> : <PlusIcon />
                }
            </button>
        )
    }

    const handleGenerateKey = () => {
        const newApiKeys = Object.assign({}, apiKeys);
        const key = uuidv4();
        newApiKeys[key] = { name: generatorKeyTitle, key }
        setApiKeys(newApiKeys);
    }

    const handleDeleteKey = (key) => {
        const newApiKeys = Object.assign({}, apiKeys);
        delete newApiKeys[key];
        setShowDeleteWarning(false);
        setApiKeys(newApiKeys);
    }

    const handleDisplayCopyMessage = () => {
        setShowCopyMessage(true);
        setTimeout(() => { setShowCopyMessage(false) }, 4000)
    }

    const DeleteConfirmationDialog = () => {
        return (
            <div class={`transition duration-300 p-4 flex flex-col bg-gray-100 rounded-md absolute -right-1/2 top-1/2 shadow-md ${showDeleteWarning ? 'opacity-100' : 'opacity-0'}`}>
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
                <h1 class="font-roboto font-black text-6xl text-gray-800">Developer</h1>
                <UndrawDev class="w-1/4 h-1/4 absolute bottom-24 right-24 mb-4" />

                <div class="relative">
                    <div class="p-4 flex flex-col bg-gray-100 rounded-md mt-12 w-1/2 shadow-sm relative z-10">
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
                    <div class={`absolute items-center transform transition animated opacity-0 duration-500 ${showKeyGenerator && 'translate-y-20 opacity-100'} bottom-4 w-2/5 flex flex-row p-2`}>
                        <label for="key-title-input" class="mr-2 font-roboto text-gray-600 font-light">Key title</label>
                        <input onChange={(e) => setGeneratorKeyTitle(e.target.value)} id="key-title-input" class="bg-gray-100 flex-1 mr-2 rounded-md px-4 py-1 h-8 text-gray-800 font-roboto font-light"></input>
                        <button onClick={() => handleGenerateKey()} class="font-roboto text-white font-light bg-blue-500 hover:bg-blue-400 rounded-md px-2 py-1 h-8 text-sm tracking-wide">Generate Key</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeveloperPage;