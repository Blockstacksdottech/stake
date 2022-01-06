import React,{useEffect,useState} from 'react';
import { loadContract , getPriceCoin ,round,formatNumber,toFixed} from "../../utils/index";
import {farmsContainer} from '../../constants/farms';
import {  useToasts } from 'react-toast-notifications';
import { useWeb3React } from '@web3-react/core';
import { ERC20_ABI } from '../../constants/abis/erc20';
import OneInchAbi from "../../constants/1inchfarm.json";
import MooniSwapAbi from "../../constants/mooniswap.json";
import { BigNumber } from "@0x/utils";





function ExchangeCard(props){

    const {account , active ,chainId, library} = useWeb3React();
    const [balance,setBalance] = useState(0);
    const [Staked,setStaked] = useState(0);
    const [Reward,setReward] = useState(0);
    const [StakedPerc,setStakedPerc] = useState(0);
    const [WithdrawPerc,setWithdrawPerc] = useState(0);
    const [rewardRate,setrewardRate] = useState(0);
    const {addToast} = useToasts();

    async function handleWrite(c,name,...args){
      try{
        c.methods[name](...args).send({from:account}).on('receipt',(receipt) => {
          addToast("Transaction Confirmed", {
              appearance: 'success',
              autoDismiss: true,
            })
      }).on('transactionHash',(hash) => {
          addToast("Transaction Created : "+hash, {
              appearance: 'success',
              autoDismiss: true,
            })
      }).on('error',(err)=>{
          addToast('Transaction Failed', {
              appearance: 'error',
              autoDismiss: true,
            })
      }).then((resp) => console.log(resp))
      }catch(e){
        addToast(e, {
          appearance: 'error',
          autoDismiss: true,
        })
      }
  
      
  }

    async function getBalance(){
        if (props.data.farm == '1Inch'){
            let OneInch = loadContract(library,OneInchAbi,props.data.data.address);
            let mooniAddress = await OneInch.methods.mooniswap().call();
            let MooniSwap = loadContract(library,MooniSwapAbi,mooniAddress)
            let bal = await MooniSwap.methods.balanceOf("0xA26C0b9fe99e1945aaAd58228F4fEd3f6408Ba3C").call();
            setBalance(bal);
        }
        
    }

    async function getStaked(){
      if (props.data.farm == '1Inch'){
        let OneInch = loadContract(library,OneInchAbi,props.data.data.address);
        let bal = await OneInch.methods.balanceOf("0xA26C0b9fe99e1945aaAd58228F4fEd3f6408Ba3C").call();
        setStaked(bal);
    }
    }

    async function getReward(){
      if (props.data.farm == '1Inch'){
        let OneInch = loadContract(library,OneInchAbi,props.data.data.address);
        let reward_rate = await getPriceCoin(props.data.data.rewardToken.id);
        setrewardRate(reward_rate);
        let earn =  await OneInch.methods.earned(props.data.data.rewardToken['1inch_id'],"0xA26C0b9fe99e1945aaAd58228F4fEd3f6408Ba3C").call();
        setReward(earn);
      }
      
    }

    function formatReward(r){
      if (props.data.farm == "1Inch") {
        let earn = r;
        return  round(((Number(earn) / (10**Number(props.data.data.rewardToken.decimals)))) * rewardRate);
      }

     
    }

    function handleInpChange(e){
      let target = e.target;
      let val = target.value;
      let id = target.id;
      switch(id){
        case "balance":
          setStakedPerc(Number(val));
          break;
        case "staked":
          setWithdrawPerc(Number(val));
          break;
        

      }
    }

    async function Stake(){
      if (props.data.farm == '1Inch'){
        let stake_amount = BigNumber((StakedPerc / 100) * balance);
        console.log(stake_amount.toString())
        let OneInch = loadContract(library,OneInchAbi,props.data.data.address);
        await handleWrite(OneInch,"stake",stake_amount);

      }
    }

    async function Unstake(){
      if (props.data.farm == '1Inch'){
        let withdraw_amount = BigNumber((WithdrawPerc / 100) * Staked);
        console.log(withdraw_amount.toString())
        let OneInch = loadContract(library,OneInchAbi,props.data.data.address);
        await handleWrite(OneInch,"withdraw",withdraw_amount);
      }

    }

    async function Claim(){
      if (props.data.farm == '1Inch'){
        let OneInch = loadContract(library,OneInchAbi,props.data.data.address);
        await handleWrite(OneInch,"getReward",props.data.data.rewardToken['1inch_id']);
      }
    }

    useEffect(() => {
      async function loadData(){
        if (active && chainId && library){
          await getBalance();
          await getStaked();
          await getReward();
        }
      }

      loadData().then(res=> {
        console.log("finished");
      })


    },[account,chainId])





    const html = (<div className="row mt-2">
  <div className="col-md-4 mx-auto">
    <div className="card box-green">
      <form>
        <div className="card-body">
        <p className="card-title"><label className="float-right">Wallet Balance: {formatNumber(toFixed(balance / 10**18))}</label></p>
          <div className="form-group mt-3">
            <input id="balance" max={100} defaultValue={0} onChange={handleInpChange} type="range" className="custom-range"  />
          </div>
          <div className="form-group mt-3">
            <label className="float-left text-white">Stake(%): {StakedPerc}%</label>
            <label className="float-right badge badge-danger">MAX</label>
          </div>
        </div>
        <div className="card-footer mt-4">
          <div className="row">
            <div className="col-md-12">
              <button onClick={Stake} type="button" className="btn btn-black btn-block">Stake</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
  <div className="col-md-4 mx-auto">
    <div className="card box-green">
      <form>
        <div className="card-body">
        <p className="card-title"><label className="float-right">Your stake: {formatNumber(toFixed(Staked / 10**18))}</label></p>
          <div className="form-group mt-3">
            <input id="staked" max={100} defaultValue={0} onChange={handleInpChange} type="range" className="custom-range"  />
          </div>
          <div className="form-group mt-3">
            <label className="float-left text-white">Withdraw(%): {WithdrawPerc}%</label>
            <label className="float-right badge badge-danger">MAX</label>
          </div>
        </div>
        <div className="card-footer mt-4">
          <div className="row">
            <div className="col-md-12">
              <button onClick={Unstake} type="button" className="btn btn-black btn-block">Unstake</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
  <div className="col-md-4 mx-auto">
    <div className="card box-green">
      <form>
        <div className="card-body">
          <div className="form-group mt-3">
            <h4 className="">Your Reward <br></br> ${formatReward(Reward)}</h4>
          </div>
        </div>
        <div className="card-footer">
          <div className="row">
            <div className="col-md-12">
              <button onClick={Claim} type="button" className="btn btn-black btn-block">Claim</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>

);

    return (html);


}


export default ExchangeCard;