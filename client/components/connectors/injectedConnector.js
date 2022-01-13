import { InjectedConnector } from '@web3-react/injected-connector';

const supportedChainIds =
    process.env.NODE_ENV === 'production' ? [1] : [1, 3, 4, 5, 42, 1337];

export const injected = new InjectedConnector({
    supportedChainIds,
});
