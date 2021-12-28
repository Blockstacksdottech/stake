
import ERC20_ABI from '../constants/abis/erc20.json';
import { loadContract } from '../utils';
import { ETHER, Token } from "@uniswap/sdk";





export async function getCoinBalance(account:any,active:any,library:any,token:any){
	console.log('token here')
	console.log(token)
	if (account && active && library && token){
		if (token.symbol === "ETH"){
			console.log('ether here');
			let bal = await library.eth.getBalance(account);
			console.log('balance of ether here ::::')
			console.log(bal);

			return Number(bal);
		}else{
			console.log(token.address);
			console.log(token.symbol);
			let c = loadContract(library,ERC20_ABI,token.address);
			let resp = await c.methods.balanceOf(account).call();
			console.log(resp);
			return Number(resp);
		}
		

	}else{
		return 0;
	}
}