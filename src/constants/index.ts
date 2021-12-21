export const BTC = {
	symbol: "BTC",
	name: "Bitcoin",
	logoURI: "https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png?1547033579",
	decimals: 18,
	chainId: 1,
	address: "0x0000000000000000000000000000000000000001",
};



export const CHANGE_NOW_FLOW = process.env.REACT_APP_CHANGE_NOW_FLOW || 'standard';

export const SIDE_SHIFT_TYPE = process.env.REACT_APP_SIDE_SHIFT_TYPE || 'variable';

export const supportedDEXes = {
	paraswap: [
		"MultiPath",
		"ParaSwapPool",
		"Swerve",
		"Balancer",
		"SushiSwap",
		"UniswapV2",
		"Uniswap",
		"Oasis",
		"Aave",
		"Weth",
		"Bancor",
		"Kyber",
		"Compound",
		"Zerox",
		"DefiSwap",
		"LINKSWAP",
	],
	dexag: ["synthetix", "ag", "curvefi", "zero_x"],
};

export const DEFAULT_DECIMALS = 18;

export const SIMPLE_SWAP_FIXED = process.env.REACT_APP_SIMPLESWAP_FIXED_RATE === "true" || false;
export const PROXY_URL = process.env.REACT_APP_PROXY_URL || "http://localhost:3001/";

export const NFT_REFERRER_ACCOUNT = process.env.REACT_APP_NFT_REFERRER_ACCOUNT
	? process.env.REACT_APP_NFT_REFERRER_ACCOUNT
	: process.env.REACT_APP_REFERRER_ACCOUNT;
export const ONE_INCH_REFERRER_ACCOUNT = process.env.REACT_APP_1INCH_REFERRER_ACCOUNT
	? process.env.REACT_APP_1INCH_REFERRER_ACCOUNT
	: process.env.REACT_APP_REFERRER_ACCOUNT;
export const ONE_INCH_FEE_PERCENTAGE = process.env.REACT_APP_1INCH_REFERRER_FEE_PERCENTAGE
	? process.env.REACT_APP_1INCH_REFERRER_FEE_PERCENTAGE
	: "0";
export const PARASWAP_REFERRER_ACCOUNT = process.env.REACT_APP_PARASWAP_REFERRER
	? process.env.REACT_APP_PARASWAP_REFERRER
	: process.env.REACT_APP_REFERRER_ACCOUNT;
export const BITREFILL_REF_TOKEN = process.env.REACT_APP_BITREFILL_REF_TOKEN
	? process.env.REACT_APP_BITREFILL_REF_TOKEN
	: process.env.REACT_APP_REFERRER_ACCOUNT;