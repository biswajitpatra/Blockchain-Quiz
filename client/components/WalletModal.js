import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { injected } from '../components/connectors/injectedConnector';

export default function WalletModal({ required = true }) {
    const { account, activate, active, deactivate, error } = useWeb3React();
    let [isOpen, setIsOpen] = useState(false);

    function closeModal() {
        if (active && required) setIsOpen(false);
        else if (!required) setIsOpen(false);
    }

    function openModal() {
        setIsOpen(true);
    }

    function switchError(error) {
        if (process.env.NODE_ENV === 'development') {
            return `${error.name}:${error.message}`;
        }
        switch (error.name) {
            case 'UnsupportedChainIdError':
                return 'We dont have support for this network. Please move to Ethereum network';
            default:
                return error.message;
        }
    }

    useEffect(() => {
        if (!active && required) {
            setIsOpen(true);
        }
        if (active && required) {
            setIsOpen(false);
        }
    }, [active, required]);

    return (
        <>
            <div className="absolute top-0 right-0 z-10 m-5">
                <button
                    type="button"
                    onClick={openModal}
                    className="px-4 py-2 text-sm font-medium text-white bg-black items-center rounded-md bg-opacity-20 flex hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                >
                    <div
                        className={`rounded-full w-2 h-2 ${
                            active ? 'bg-green-600' : 'bg-red-600'
                        }`}
                    ></div>
                    <div className="ml-2">
                        {account ? `${account.substring(0, 8)}...` : 'Connect'}
                    </div>
                </button>
            </div>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-10 overflow-y-auto"
                    onClose={closeModal}
                >
                    <div className="min-h-screen px-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                        </Transition.Child>

                        <span
                            className="inline-block h-screen align-middle"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                                {!active ? (
                                    <>
                                        <Dialog.Title
                                            as="h3"
                                            className="text-2xl font-medium leading-6 text-gray-900"
                                        >
                                            Connect to a Wallet
                                            {required && (
                                                <p className="text-sm text-red-600">
                                                    {' '}
                                                    *This page requires the
                                                    wallet to be connected
                                                </p>
                                            )}
                                        </Dialog.Title>
                                        <div className="mt-4">
                                            <button
                                                className="py-2 text-lg font-bold text-white rounded-lg w-56 bg-orange-600 hover:bg-orange-800"
                                                onClick={() => {
                                                    if (error) {
                                                        deactivate();
                                                    }
                                                    activate(injected);
                                                }}
                                            >
                                                Connect to MetaMask
                                            </button>
                                            {error && (
                                                <div className="text-red-700 font-bold">
                                                    ERROR: {switchError(error)}
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900"
                                        >
                                            Wallet Connected
                                            {required && (
                                                <p className="text-sm text-red-600">
                                                    {' '}
                                                    *This page requires the
                                                    wallet to be connected
                                                </p>
                                            )}
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <button
                                                className="py-2 text-lg font-bold text-white rounded-lg w-56 bg-red-600 hover:bg-red-800 disabled:opacity-40"
                                                disabled={required}
                                                onClick={() => {
                                                    deactivate();
                                                }}
                                            >
                                                Disconnect
                                            </button>
                                        </div>
                                    </>
                                )}

                                <div className="mt-4">
                                    <button
                                        type="button"
                                        className="disabled:opacity-40 inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                        onClick={closeModal}
                                        disabled={required}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
