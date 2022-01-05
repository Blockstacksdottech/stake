import React,{useState,useEffect} from 'react';
import ModalConnect from './GeneralComponents/ModalConnect';
import Sidebar from './GeneralComponents/Sidebar';
import TopNav from './GeneralComponents/TopNav';
import { useWeb3React } from '@web3-react/core';


import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import FarmsTable from './FarmsComponents/FarmsTable';


// urils here

import { loadContract , getPriceCoin ,round} from "../utils/index";
import {farmsContainer} from '../constants/farms';
import {  useToasts } from 'react-toast-notifications';

import { ERC20_ABI } from '../constants/abis/erc20';
import OneInchAbi from "../constants/1inchfarm.json";
import MooniSwapAbi from "../constants/mooniswap.json";




function Farm(props:any){
	const [show,setShow] = useState(false);
  const {account , active ,chainId, library} = useWeb3React();
  const {addToast} = useToasts();

  async function handleWrite(c:any,name:string,...args:any){
  
    c.methods[name](...args).send({from:account}).on('receipt',(receipt:any) => {
            addToast("Transaction Confirmed", {
                appearance: 'success',
                autoDismiss: true,
              })
        }).on('transactionHash',(hash:any) => {
            addToast("Transaction Created : "+hash, {
                appearance: 'success',
                autoDismiss: true,
              })
        }).on('error',(err:any)=>{
            addToast('Transaction Failed', {
                appearance: 'error',
                autoDismiss: true,
              })
        }).then((resp:any) => console.log(resp))
}

  async function FormatOneInchFarms(data:any){
      let cont = []
      for (let farm of data){
        let res = {
          pair : farm.name,
          icon : "/assets/media/dex/ONEINCH.svg",
          farm : "1Inch",
          earned : 0,
          apr : 0,
          liquidity : 0,
          data : {}
        }
        let OneInchContract = loadContract(library,OneInchAbi,farm.address);
        let mooniAddress = await OneInchContract.methods.mooniswap().call();
        let staked = 0;
        for (let stake of farm.stakeCoins){
          let rate = await getPriceCoin(stake.id);
          let CoinContract = loadContract(library,ERC20_ABI,stake.address);
          let balance = await CoinContract.methods.balanceOf(mooniAddress).call();
          let decimals = await CoinContract.methods.decimals().call();
          staked += ((Number(balance) / (10**Number(decimals))) * rate);
        }
        staked = round(staked);
        let rewardContract = loadContract(library,ERC20_ABI,farm.rewardToken.address);
        res.liquidity = staked;
        let decimals = await rewardContract.methods.decimals().call();
        let reward_rate = await getPriceCoin(farm.rewardToken.id);
        let earn =  await OneInchContract.methods.earned(farm.rewardToken['1inch_id'],account).call();
        res.earned = ((Number(earn) / (10**Number(decimals)))) * reward_rate;
        
        let balance = await rewardContract.methods.balanceOf(farm.address).call();
        let totalSupply = await OneInchContract.methods.totalSupply().call();
        let rate = (Number(balance) / Number(totalSupply));
        res.apr = round((((1+rate)**12) - 1) * 100);
        res['data'] = farm;
        cont.push(res);
        
        

      }
      let temp = [...farms,...cont];

        console.log(temp);
        setFarms(temp);
      addToast("Loaded 1Inch Farms",{
        appearance:"success",
        autoDismiss : true
      })
  }

  useEffect(() => {
    async function loadData(){
      if (active && chainId && library){
        if (farmsContainer[chainId]){
          await FormatOneInchFarms(farmsContainer[chainId]['1inch']);
        }
      }
    }

    loadData().then(res=> {
      console.log("finished");
    })

  },[account,active,chainId])

  const [farms,setFarms]:any = useState([])

	const html = (
		<div id="page-content-wrapper">
  {/* Top navigation*/}
  <TopNav show={[show,setShow]} />
  {/* Page content*/}
  <div className="right-side">
    <div className="container-fluid">
      <div className="row mt-4">
        <h1>Farm</h1>
        <p>Description text here</p>
      </div>
      <div className="row mt-4">
        <div className="col-md-12">
          <div className="card box-2">
            <div className="card-header">
              <h5>Trending Farms</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                  <FarmsTable sort={true} rows={farms} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row my-4">
        <div className="col-md-12">
          <div className="card box-2">
            <div className="card-header">
              <h5>All Farms</h5>
              <FarmsTable rows={farms} />
            </div>
            <div className="card-body">
              <div className="table-responsive">
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="mt-5">
      <footer>
        <p className="text-center text-white">
          <a href="#" className="text-white"><small>Terms &amp; Condition</small></a> | <a href="#" className="text-white"><small>Privacy Policy</small></a>
          <br />
          <small>© 2021 ABC Token</small>
        </p>
      </footer>
    </div>
  </div>
</div>
);


	return <div className="d-flex" id="wrapper">
	<Sidebar current={props.current} />
	{html}
	<ModalConnect show={show} setShow={setShow} />

</div>;



}


export default Farm;