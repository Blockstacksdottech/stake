
import ERC20_ABI from '../constants/abis/erc20.json';
import { loadContract } from '../utils';






export async function getCoinBalance(account:any,active:any,library:any,token:any){
	console.log('token here')
	console.log(token)
	if (account && active && library && token){
		console.log(token.address);
		console.log(token.symbol);
		let c = loadContract(library,ERC20_ABI,token.address);
		let resp = await c.methods.balanceOf(account).call();
		console.log(resp);
		return Number(resp);

	}else{
		return 0;
	}
}