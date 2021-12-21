import { ParaSwap } from "paraswap";


import OneInchApi from "./OneInch";
import GodexApi from "./Godex";

import SimpleSwapApi from "./SimpleSwap";
import StealthexApi from "./Stealthex";
import ChangeNow from "./ChangeNow";
import SideShift from "./SideShift";

export default {
	paraswap: new ParaSwap(),
	oneInch: new OneInchApi(),
	godex: new GodexApi(),
	simpleSwap: new SimpleSwapApi(),
	stealthex: new StealthexApi(),
	changeNow: new ChangeNow(),
	sideShift: new SideShift(),
};
