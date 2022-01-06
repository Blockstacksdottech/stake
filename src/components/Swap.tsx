import React,{useEffect,useState,Fragment} from 'react';
import { useWeb3React } from '@web3-react/core';
import Sidebar from './GeneralComponents/Sidebar';
import ModalConnect from './GeneralComponents/ModalConnect';
import TopNav from './GeneralComponents/TopNav';
import _, { add } from "lodash";
import { loadContract } from '../utils';
import { BigNumber } from "@0x/utils";

import { assert } from "@0x/assert";

import { walletTokens as toks } from "../constants/spot-config/mainnet/config.json";

import {
	BTC,CHANGE_NOW_FLOW,SIDE_SHIFT_TYPE,supportedDEXes,SIMPLE_SWAP_FIXED,DEXesImages,
  ZERO,PARASWAP_REFERRER_ACCOUNT,networks_dict
} from "../constants";
import { ChainId } from "@uniswap/sdk";

import InstantSwapApi from "../http/instantSwap";

import CoinModal from "./SwapingComponents/CoinModal";
import SwapCard from "./SwapingComponents/SwapCard";
import {  useToasts } from 'react-toast-notifications';
import Load from './GeneralComponents/Load';
import { selectClasses } from '@mui/material';
import { ERC20_ABI } from '../constants/abis/erc20';
import ConfModal from './SwapingComponents/ConfModal';

function Swap(props:any){

    const { active,account , deactivate ,library } = useWeb3React();
    const [show,setShow] = useState(false);
    const [currShow,setCurrShow] = useState(false);
    const [side,setSide] = useState("");
    const [from,setFrom]:any = useState(null);
    const [to,setTo]:any = useState(null); 
    const [loading,setLoading] = useState({
      all:36,
      loaded:0
    });
    const [fetchloading, setFetchLoading] = useState(false);
    const [result,setResult]:any = useState(null);
    const {addToast} = useToasts();
    const api:any = InstantSwapApi;
    const [tokens , setTokens] = useState([...toks])
    const [max,setMax]  = useState(0);
    const [priceInterval,setPriceInterval]:any = useState(null);
    const [selectedRate,setSelectedRate]:any = useState(null);
    const [BuyState,setBuyState] = useState("");
    const [swapData,setSwapData] = useState({
      show : false,
      platform : "",
      id : "",
      address : ""
    })

    const onChangeBalance = (balance:any,side:any) => {
      if (side == "from" && from){
        let temp = {...from};
        temp.max = balance;
        setFrom(temp);
      }else if (side == "to" && to){
        let temp={...to}
        temp.max = balance;
        setTo(temp);
      }
    };

    async function switchHandler(){
      let temp;
      let temp2;
      if (from){
        temp = {...from};
      }else{
        temp = null;
      }
      if (to){
        temp2 = {...to};
      } else {
        temp2 = null;
      }
      setFrom(temp2);
      setTo(temp);
      if (from && to && from.symbol && to.symbol){
        let resp = await fetchPrices(temp2,temp);
      }
      
    }

    async function handleSelect(i:number){
      let temp = {...tokens[i],value:0,max:0};
      let resp;
      if (side == "from"){
        setFrom(temp);
        if (to){
          resp = await fetchPrices(temp,to);
        }
        
      }else if (side == "to"){
        setTo(temp);
        if(from){
          resp = await fetchPrices(from,temp);
      }
        
      }
      setCurrShow(false);

    }


    const promiseHandler = (id:any, count:any, callback:any) => {
      return new Promise((resolve) => {
        callback()
          .then((response:any) => {
            setLoading({
              all:36,
              loaded:loading.loaded + count
            });
            if (id == 'paraswap'){
              response = response.data.priceRoute;
            }
            resolve({
              id,
              result: response,
            })
          })
          .catch((error:any) => {
            setLoading({
              all:36,
              loaded:loading.loaded + count
            });
            resolve({
              id,
              result: undefined
            })
          })
      });
    };

    const getParaswapSortedRates = (rates:any) => {
      return _.orderBy(rates.others, ["rate"], ["desc"]);
    };

    const getSortedRates = (response:any, type:any) => {
      if (!response) return [];
      switch (type) {
        case "paraswap": {
          return getParaswapSortedRates(response);
        }
        default: {
          return response.hasOwnProperty("data") ? response.data : response;
        }
      }
    };
  
    const transformRates = (rates:any) => {
      let result = [];
      for (let i in rates) {
        const key = rates[i][0];
        const apiRates = rates[i][1];
        switch (key) {
          case "1inch": {
            if (apiRates && typeof apiRates.toTokenAmount === "string") {
              result.push({
                rate: apiRates.toTokenAmount / 10 ** from.decimals,
                platform: "oneInch",
                source: "1inch",
              });
            }
            break;
          }
          case "paraswap": {
            if (apiRates) {
              apiRates.forEach((rate:any) => {
                if (supportedDEXes["paraswap"].includes(rate.exchange)) {
                  result.push({
                    rate: rate.unit / 10 ** from.decimals,
                    platform: rate.exchange,
                    source: "paraswap",
                  });
                }
              });
            }
            break;
          }
          case "simpleSwap": {
            if (apiRates.rate !== null) {
              result.push({
                rate: Number(apiRates.rate),
                min: Number(apiRates.min || 0),
                max: Number(apiRates.max || 0),
                platform: "simpleSwap",
                source: "simpleSwap",
              });
            }
            break;
          }
          case "stealthex": {
            if (apiRates.estimated_amount !== null) {
              result.push({
                rate: Number(apiRates.estimated_amount),
                min: Number(apiRates.min_amount || 0),
                max: Number(apiRates.max_amount || 0),
                platform: "stealthex",
                source: "stealthex",
              });
            }
            break;
          }
          case 'changeNow': {
            if((apiRates.hasOwnProperty('rate') && apiRates?.rate?.toAmount) && apiRates.hasOwnProperty('range')) {
              result.push({
                rate: Number(apiRates?.rate?.toAmount || 0),
                rateId: apiRates?.rate?.rateId,
                min: Number(apiRates?.range?.minAmount || 0),
                max: Number(apiRates?.range?.maxAmount || 0),
                platform: "changeNow",
                source: "changeNow",
              })
            }
            break;
          }
          case 'sideShift': {
            if(apiRates.hasOwnProperty('rate')) {
              result.push({
                rate: Number(apiRates?.rate || 0),
                min: Number(apiRates?.min || 0),
                max: Number(apiRates?.max || 0),
                platform: "sideShift",
                source: "sideShift",
              })
            }
            break;
          }
        }
      }
  
      return result;
    };
  
    const getSortedResult = (response:any) => {
      let sortedParts = Object.keys(response).map((key) => [key, getSortedRates(response[key], key)]);
      let transformedRates = transformRates(sortedParts);
      return _.sortBy(transformedRates, (o) => -o.rate);
    };
  
    const transformFetchedData = (data:any) => {
      const result:any = {};
      for(let i in data) {
        const row = data[i];
        if(row?.id === 'oneInch') {
          result['1inch'] = row?.result;
        }
  
        result[row?.id] = row?.result;
      }
  
      return result;
    }
  
    const getPricesPromises = (deposit:any, destination:any) => {
  
      let fromAmount = 10 ** deposit.decimals;
  
      let dexagParams = {
        to: destination.symbol,
        from: deposit.symbol,
        dex: "all",
        fromAmount: 1,
      };
  
      const promises = [];
  
      promises.push(promiseHandler("oneInch", 10, () =>
        api.oneInch.get("quote", {
          fromTokenAddress: deposit.address,
          toTokenAddress: destination.address,
          amount: fromAmount,
        })
      ))
  
      promises.push(promiseHandler("paraswap", 6, () =>
        //api.paraswap.getRate(deposit.address, destination.address, fromAmount)
        api.paraswapmanual.get("quote",{
          srcToken : deposit.address,
          srcDecimals : deposit.decimals,
          destToken : destination.address,
          destDecimals :  destination.decimals,
          amount: String(1 * (10**Number(deposit.decimals))),
          side : "SELL",
          network : deposit.chainId,
          otherExchangePrices : "true"
        })
      ))
  
      
  
      promises.push(promiseHandler("simpleSwap", 3, () =>
        api.simpleSwap.get("exchange", {
          query: {
            fixed: SIMPLE_SWAP_FIXED,
            currency_from: deposit.symbol.toLowerCase(),
            currency_to: destination.symbol.toLowerCase(),
          },
        })
      ))
  
  
      promises.push(promiseHandler("stealthex", 2, () =>
        api.stealthex.get("exchange", {
          query: {},
          currency_from: deposit.symbol.toLowerCase(),
          currency_to: destination.symbol.toLowerCase(),
        })
      ))
  
      promises.push(promiseHandler("changeNow", 3, () =>
        api.changeNow.get('exchange', {
          range: {
            params: {
              fromNetwork: "eth",
              toNetwork: destination.symbol.toLowerCase() === 'btc' ? "btc" : "eth",
              fromCurrency: deposit.symbol.toLowerCase(),
              toCurrency: destination.symbol.toLowerCase(),
              flow: CHANGE_NOW_FLOW
            }
          },
          rate: {
            params: {
              fromNetwork: "eth",
              toNetwork: destination.symbol.toLowerCase() === 'btc' ? "btc" : "eth",
              fromCurrency: deposit.symbol.toLowerCase(),
              toCurrency: destination.symbol.toLowerCase(),
              flow: CHANGE_NOW_FLOW,
              useRateId: !!(CHANGE_NOW_FLOW === 'fixed-rate'),
              fromAmount: 1,
            }
          }
        })
      ))
  
      promises.push(promiseHandler("sideShift", 4, () =>
        api.sideShift.get("pairs", {
          fromCurrency: deposit.symbol.toLowerCase(),
          toCurrency: destination.symbol.toLowerCase(),
        })
      ))
  
      return promises;
    }
  
    const fetchPrices = async (deposit:any,destination:any) => {
      
  
      if (deposit !== null && destination !== null) {

        setFetchLoading(true);
        setLoading({
          all: 36,
          loaded: 0,
        });

  
        let promises = getPricesPromises(deposit, destination);
  
        let promisesRes = await Promise.all(promises);
  
        const response = transformFetchedData(promisesRes);
  
        let result = getSortedResult(response);
  
        if (result.length > 0) {
          if (deposit.value) {
            destination.value = (deposit.value * result[0].rate).toFixed(6);
          } else if (destination.value) {
            deposit.value = (destination.value / result[0].rate).toFixed(6);
          }
          updatePriceIntervally(deposit, destination);
        } else {
          addToast('Unavailable Pair', {
            appearance: 'error',
            autoDismiss: true,
          })
        }
        console.log("from here")
        console.log(from.max);
        console.log(from.value);
        
        let res:any = {
          destination,
          deposit,
          rates: result,
          rate: result.length > 0 ? result[0] : undefined,
          showMore: false,
          hasEnough: Number(from.value) <= Number(from.max) && Number(from.value) > 0
        }
        //console.log(res);
        setFrom(deposit);
        setTo(destination);
        setResult(res);
        setSelectedRate(res.rate);
        setFetchLoading(false);
        setLoading({
          all:36,
          loaded:0
        })
        addToast('Loaded', {
          appearance: 'success',
          autoDismiss: true,
        })

      } else {
        /* setState({
          pair,
          showMore: false,
        }); */
        console.log('else one');

        let res = {
          destination,
          deposit,
          showMore: false,
          hasEnough: false
        }

        setFrom(deposit);
        setTo(destination);
        setResult(res);
        setFetchLoading(false);
        setLoading({
          all:36,
          loaded:0
        })
        console.log('else error');
      }
    };

    const getNewPrice = async (deposit:any, destination:any) => {
      const { t } = props;
  
      if (deposit !== null && destination !== null) {
  
        let promises = getPricesPromises(deposit, destination);
  
        let promisesRes = await Promise.all(promises);
  
        const response = transformFetchedData(promisesRes);
  
        let result = getSortedResult(response);
  
        if (result.length > 0) {
          if (deposit.value) {
            destination.value = (deposit.value * result[0].rate).toFixed(6);
          } else if (destination.value) {
            deposit.value = (destination.value / result[0].rate).toFixed(6);
          }
        } else {
          addToast('Unavailable Pair', {
            appearance: 'error',
            autoDismiss: true,
          });
        }
  
        
          let newRate = result[0];
          
          
          let res:any =  {
            destination,
            deposit,
            rates: result,
            rate: result.length > 0 ? newRate : undefined,
            priceLoading: false,
            hasEnough:
            Number(from.value) <= Number(from.max),
          }

          setResult(res);
          setSelectedRate(res.rate);
      }
    }


    const updatePriceIntervally = (deposit:any, destination:any) => {
      let pI = priceInterval;
      if(pI) {
        clearInterval(pI);
        pI = null;
      }
      pI = setInterval(() => {
        getNewPrice(deposit, destination);
      }, 15000)
      setPriceInterval(pI);
    }

    const forceRefreshPrices = async () => {
      let deposit = from;
      let destination = to;
      let Pi = priceInterval;
      if(Pi) {
        clearInterval(Pi);
        Pi = null;
      }
      await getNewPrice(deposit, destination);
      updatePriceIntervally(deposit, destination);
    }

    function handleValue(v:any,side:string){
      
      if (side == "from"){
        let temp = {...from};
        /* console.log(Number(v));
        if (Number(v) != NaN){
          temp.value = Number(v);
        }else{
          temp.value = 0;
        } */
        temp.value = v;
        
        setFrom(temp);
      }
    }

    const HEX_REGEX = /^0x[0-9A-F]*$/i;

    function isHexString(str:string) {
      if (HEX_REGEX.test(str)) {
        return true;
      } else {
        throw new Error("Entered value isn't hex string");
      }
    }

    

    const oneInchBuyHandler = async (deposit:any,destination:any, rate:any) => {
      try {
        alert("1inch")
        let canExchange = false;
        let pending = false;
        setBuyState("initializing");
        let allowance = ZERO;
  
        const spenderRes = await api.oneInch.get("spender");
        const spender = spenderRes.data.address;
  
        let fromAmount = new BigNumber(deposit.value).times(10 ** deposit.decimals);
  
        if (deposit.symbol.toUpperCase() !== "ETH") {
          setBuyState("allowance");
  
          let contract = loadContract(
            library,
            ERC20_ABI,
            deposit.address
          );
  
          allowance = await contract.methods.allowance(account, spender).call();
          console.log("allowance")
          console.log(allowance);
          allowance = new BigNumber(allowance);
  
          if (fromAmount.isGreaterThan(allowance)) {
            setBuyState("approving");
            console.log('approving')
            const maxAllowance = new BigNumber(2).pow(256).minus(1);
            await contract.methods.approve(spender, maxAllowance.toFixed(0)).send({from:account}).on('receipt',(receipt:any) =>{
              alert('approved');
              pending = false;
              canExchange = true;
            }).on('error',(err:any) => {
              pending = true;
              canExchange = false
            })
            

          
          } else {
            canExchange = true;
          }
        } else {
          canExchange = true;
        }
  
        if (canExchange) {
          if (deposit.symbol.toUpperCase() !== "ETH" && pending) {
            let contract = loadContract(
              library,
            ERC20_ABI,
            deposit.address
            );
  
            allowance = await contract.methods.allowance(account, spender);
            allowance = new BigNumber(allowance);
  
            if (fromAmount.isGreaterThan(allowance)) {
              addToast('Approval Pending', {
                appearance: 'error',
                autoDismiss: true,
              });
              return false;
            }
          }
  
          setBuyState("create_tx");
  
          const res = await api.oneInch.get("swap", {
            fromTokenAddress: deposit.address,
            toTokenAddress: destination.address,
            amount: fromAmount.toFixed(0),
            fromAddress: account,
            slippage: 3 / 100,
            destReceiver: account,
          });
          let tx = res.data.tx;
          
          console.log('1inch tx here .....')
          console.log(tx);
          setBuyState("send_tx");
  
          library.eth.sendTransaction(tx, async (err:any, transactionHash:any) => {
            if (err) {
              setBuyState("failed");
  
              console.log('error transaction')
              console.log(err);
              if (err.code === 4001) {
                addToast("errors.canceled", {
                  appearance: 'error',
                  autoDismiss: true,
                });
                
              } else {
                addToast("errors.default", {
                  appearance: 'error',
                  autoDismiss: true,
                });
              }
              return false;
            }
  
            setBuyState("submitted");
            addToast("instantSwap.orderSubmitted", {
              appearance: 'success',
              autoDismiss: true,
            });
          });
        } else {
          addToast("errors.approvalPending", {
            appearance: 'error',
            autoDismiss: true,
          });
        }
      } catch (e:any) {
        setBuyState("failed");
        console.log(e);
        if (e.hasOwnProperty("code")) {
          if (e.code === 4001) {
            addToast("errors.canceled", {
              appearance: 'error',
              autoDismiss: true,
            });
          } else {
            addToast("errors.default", {
              appearance: 'error',
              autoDismiss: true,
            });
          }
        } else {
          if (e.hasOwnProperty("response")) {
            if (e.response.status === 500) {
              if (e.response.data.hasOwnProperty("errors")) {
                e.response.data.errors.map((err:any) => {
                  addToast(err.msg, {
                    appearance: 'error',
                    autoDismiss: true,
                  });
                });
              } else {
                addToast("errors.unavailablePair", {
                  appearance: 'error',
                  autoDismiss: true,
                });
              }
            } else {

             addToast("errors.default", {
              appearance: 'error',
              autoDismiss: true,
            });
            }
          } else {
            addToast("errors.default", {
              appearance: 'error',
              autoDismiss: true,
            });
          }
        }
      }
    };

    const paraSwapBuyHandler = async (deposit:any,destination:any, rate:any) => {
      alert("paraswap")
      const recipient = account;
      try {
        setBuyState("initializing");
        let pending = false;
        let canExchange = false;
        const paraswap = api.paraswap.setWeb3Provider(library);
  
        let fromAmount = new BigNumber(deposit.value).times(10 ** deposit.decimals);
        let toAmount = new BigNumber(selectedRate.rate * deposit.value).times(10 ** destination.decimals);
  
        setBuyState("allowance");
        const allowanceRes = await paraswap.getAllowance(account, deposit.address);
        let allowance = new BigNumber(allowanceRes.allowance);
        if (deposit.symbol !== "ETH" && fromAmount.isGreaterThan(allowance)) {
          const maxAllowance = new BigNumber(2).pow(256).minus(1);
          setBuyState("approving");
          try {
            const approve = await paraswap.approveToken(
              maxAllowance.toFixed(),
              account,
              deposit.address
            );
            console.log(approve);
            canExchange = true;
            pending = true;
            
          } catch (e) {
            canExchange = false;
          }
        } else {
          canExchange = true;
        }
  
        if (canExchange) {
          if (pending) {
            const allowanceRes = await paraswap.getAllowance(account, deposit.address);
            let allowance = new BigNumber(allowanceRes.allowance);
            if (deposit.symbol !== "ETH" && fromAmount.isGreaterThan(allowance)) {
              addToast("approvalPending", {
                appearance: 'error',
                autoDismiss: true,
              });
              
              return false;
            }
          }
  
          setBuyState("create_tx");
          console.log("from amount here")
          console.log(fromAmount.toFixed(0))
          const api_resp = await api.paraswapmanual.get("quote",{
            srcToken : deposit.address,
            srcDecimals : deposit.decimals,
            destToken : destination.address,
            destDecimals :  destination.decimals,
            amount: fromAmount.toFixed(0),
            side : "SELL",
            network : deposit.chainId,
            otherExchangePrices : "true"
          })
          const api_resp_2 = await api.paraswapmanual.get("quote",{
            srcToken : deposit.address,
            srcDecimals : deposit.decimals,
            destToken : destination.address,
            destDecimals :  destination.decimals,
            amount: fromAmount.toFixed(0),
            side : "SELL",
            network : deposit.chainId,
            //otherExchangePrices : "true"
          })
          /* const rates = api_resp.data.priceRoute;
          
          const selectedRoute = rates.others.find((item:any) => item.exchange === rate.platform);
          console.log(selectedRoute);
          const txRoute = [
            {
              ...rates.bestRoute[0],
              ...selectedRoute,
            },
          ];
          let payload = api_resp.data;


          rates.bestRoute = txRoute;
          payload.priceRoute.bestRoute = txRoute;
          delete payload.priceRoute.others;
          delete api_resp.data.priceRoute.others;
          console.log(api_resp);
          console.log(payload);
          let temp = api_resp_2.data.priceRoute;
          temp.bestRoute = selectedRoute; */
          const txParams = await paraswap.buildTx(
            deposit.address,
            destination.address,
            fromAmount.toFixed(0),
            toAmount.toFixed(0),
            api_resp_2.data.priceRoute,
            account,
            PARASWAP_REFERRER_ACCOUNT,
            recipient !== null ? recipient : undefined
          );
          setBuyState("send_tx");
  
          if (txParams?.message) {
            addToast(txParams.message, {
              appearance: 'error',
              autoDismiss: true,
            });
            
  
            setBuyState("failed");

  
            return false;
          }
  
          library.eth.sendTransaction(txParams, async (err:any, transactionHash:any) => {
            if (err) {
              setBuyState("failed");
  

  
              if (err.code === 4001) {
                
                addToast("errors.canceled", {
                  appearance: 'error',
                  autoDismiss: true,
                });
                
              } else {
                addToast("errors.default", {
                  appearance: 'error',
                  autoDismiss: true,
                });
              }
  
              return false;
            }
            setBuyState("submitted");
            addToast("Swap submited", {
              appearance: 'success',
              autoDismiss: true,
            });
            
            
          });
        } else {
          setBuyState("pending");
  
          
        }
      } catch (e:any) {
        setBuyState("failed");
        console.log('failed');
        console.log(e);
  
        //setDefaultBuyState();
  
        if (e.hasOwnProperty("code")) {
          if (e.code === 4001) {
            addToast("errors.canceled", {
              appearance: 'error',
              autoDismiss: true,
            });
            
          } else {
            addToast("errors.default", {
              appearance: 'error',
              autoDismiss: true,
            });
          }
        } else {
          addToast("errors.default", {
            appearance: 'error',
            autoDismiss: true,
          });
        }
        //isExchangeInProgress = false;
      }
    };
  
    
    const simpleSwapBuyHandler = async (deposit:any,destination:any, rate:any) => {
      try {
        setBuyState("initializing");
        
  
        setBuyState("validation");
        if (deposit.value < rate.min || (rate.max > 0 && deposit.value >= rate.max)) {
          addToast( deposit.value < rate.min
            ? `The minimum value for this transaction is ${rate.min}`
            : `The maximum value for this transaction is ${rate.max}`, {
              appearance: 'error',
              autoDismiss : true
            } ) 
          
          setBuyState("failed");
          //setDefaultBuyState();
          return;
        }
  
        setBuyState("create_tx");
        const res = await api.simpleSwap.set("exchange", {
          data: {
            fixed: SIMPLE_SWAP_FIXED,
            currency_from: deposit.symbol.toLowerCase(),
            currency_to: destination.symbol.toLowerCase(),
            amount: deposit.value,
            address_to: account,
          },
        });
  
        if (res) {
          if (res.code && res.code !== 200) {
            addToast(res.message,{
              appearance:'error',
              autoDismiss: true
            })
            //toast.error(res.message);
          } else {
            addToast("Your Order submitted successfully",{
              appearance:'success',
              autoDismiss : true
            });

            //toast.success("Your order submitted successfully!");
            setBuyState("submitted");
            console.log("here simpleswap response")
            console.log(res);
            /* setState({
              showQrModal: true,
              orderType: "simpleSwap",
              order: res,
            }); */

            setSwapData({
              show: true,
              platform: "SimpleSwap",
              id: res.id,
              address : res.address_from
            })
            //setDefaultBuyState();
          }
        }
      } catch (e) {
        console.log(e);
        //toast.error("An Error was occurred");
        addToast("An error occured in simpeSwap");
        setBuyState("failed");
        //setDefaultBuyState();
      }
    };



     const changeNowBuyHandler = async (deposit:any,destination:any, rate:any) => {
     
      try {
        setBuyState("initializing");
        
  
        setBuyState("validation");
        console.log(deposit.value, rate);
        if (deposit.value < rate.min || (rate.max > 0 && deposit.value >= rate.max)) {
          addToast( deposit.value < rate.min
            ? `The minimum value for this transaction is ${rate.min}`
            : `The maximum value for this transaction is ${rate.max}`, {
              appearance: 'error',
              autoDismiss : true
            } ) 

          
          setBuyState("failed");
         
          return;
        }
  
        const validation = await api.changeNow.get('address_validation', {
          params: {
            currency: destination.symbol.toLowerCase(),
            address: account,
          }
        })
  
        if(!validation?.data?.result) {
          addToast(validation?.data?.message,{
            appearance : "error",
            autoDismiss : true
          })
          
          return false;
        }
  
        setBuyState("create_tx");
        let n_d:any = networks_dict;
        const res = await api.changeNow.createTransaction({
          body: {
            "fromCurrency": deposit.symbol.toLowerCase(),
            "toCurrency": destination.symbol.toLowerCase(),
            "fromAmount": deposit.value,
            "address": account,
            "fromNetwork" : n_d[deposit.chainId],
            "toNetwork" : n_d[destination.chainId],
            "flow": CHANGE_NOW_FLOW,
            "type": "direct",
            "rateId": CHANGE_NOW_FLOW === "fixed-rate" ? rate.rateId : ""
          }
        })
  
        if (res) {
          if(res?.message) {
            addToast(res.message,{
              appearance:'error',
              autoDismiss: true
            })
            setBuyState("failed");
            
            return false;
          }
          addToast("Your Order submitted successfully",{
            appearance:'success',
            autoDismiss : true
          });
          setBuyState("submitted");
          console.log("Change Now response");
          console.log(res);
          setSwapData({
            show: true,
            platform: "ChangeNow",
            id: res.id,
            address : res.payinAddress
          })
         /*  setState({
            showQrModal: true,
            orderType: "changeNow",
            order: res,
          }); */
          
        } else {
          addToast("Failed Transaction",{
            appearance: "error",
            autoDismiss : true
          })
         
        }
      } catch (e:any) {
        console.log(e);
        if(e?.message) {
          addToast(e?.message,{
            appearance: "error",
            autoDismiss : true
          })
        } else if(e?.response?.data?.message) {
          addToast(e?.response?.data?.message,{
            appearance: "error",
            autoDismiss : true
          })

        } else {
          addToast("Default Error",{
            appearance: "error",
            autoDismiss : true
          })
        }
        setBuyState("failed");
      }
    }
  
    const sideShiftBuyHandler = async (deposit:any,destination:any, rate:any) => {
      try {
        setBuyState("initializing");
      
  
        setBuyState("validation");
        console.log(deposit.value, rate);
        if (deposit.value < rate.min || (rate.max > 0 && deposit.value >= rate.max)) {
          addToast( deposit.value < rate.min
            ? `The minimum value for this transaction is ${rate.min}`
            : `The maximum value for this transaction is ${rate.max}`, {
              appearance: 'error',
              autoDismiss : true
            } ) 
          setBuyState("failed");
          return false;
        }
  
        const validation = await api.sideShift.get('permissions');
        if(!validation?.createOrder || !validation?.createQuote) {
          addToast("sideShift Validation Error",{
            appearance : "error",
            autoDismiss : true
          })
          return false;
        }
  
        const order = await api.sideShift.post("order", {
          body: {
            "depositMethod": deposit.symbol.toLowerCase(),
            "settleMethod": destination.symbol.toLowerCase(),
            "settleAddress": account,
            "depositAmount": deposit.value,
          }
        })
        if(order) {
          if(order.hasOwnProperty("error")) {
            addToast(order?.error?.message,{
              appearance : "error",
              autoDismiss : true
            })
            setBuyState("failed");
            return false;
          } else {
            addToast("Your Order submitted successfully",{
              appearance:'success',
              autoDismiss : true
            });
            setBuyState("submitted");
            console.log("sideShift response");
            console.log(order);
            setSwapData({
              show: true,
              platform: "SideShift",
              id: order.id,
              address : order.depositAddress.address
            })
          }
        }
      } catch (e:any) {
        console.log(e);
        if(e?.message) {
          addToast(e?.message,{
            appearance: "error",
            autoDismiss : true
          })
        } else if(e?.response?.data?.message) {
          addToast(e?.response?.data?.message,{
            appearance: "error",
            autoDismiss : true
          })

        } else {
          addToast("Default Error",{
            appearance: "error",
            autoDismiss : true
          })
        }
        setBuyState("failed");
      }
    } 




    async function handleButton(){
      if (!active && !account){
        setShow(!show);

        //&& result.hasEnough
      }else if (result ){

        var res;
        switch (selectedRate.source) {
					case "1inch": {
						res = await oneInchBuyHandler(from,to, selectedRate);
						break;
					}
					case "paraswap": {
						res = await paraSwapBuyHandler(from,to, selectedRate);
						break;
					}


           
					case "simpleSwap": {
						res = await simpleSwapBuyHandler(from,to, selectedRate);
						break;
					}
          case "changeNow": {
						res = await changeNowBuyHandler(from,to, selectedRate);
						break;
					}

          case "sideShift": {
						res = await sideShiftBuyHandler(from,to, selectedRate);
						break;
					} 
          /*
					case "stealthex": {
						res = await this.stealthexBuyHandler(pair, rate);
						break;
					}
					
					*/
				}

        console.log(res);
      }

    }


    function round(num:number){
      return Math.round((num + Number.EPSILON) * 100) / 100
    }


    function setRate(i:number){
      setSelectedRate(result.rates[i]);
    }



    


    const html =
<div id="page-content-wrapper">
  {/* Top navigation*/}
  <TopNav show={[show,setShow]} />
  {/* Page content*/}
  <div className="right-side">
    <div className="container-fluid">
      <div className="row mt-4">
        <h1>Swap</h1>
        <p>Get the best price on different exchanges</p>
      </div>
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card color-box">
          <p className="card-title mb-3">
  <span className="float-right">
    <a className="pr-1"><img src="/assets/img/loading.png" /></a>
    <a onClick={async () => {if (from && to && from.symbol && to.symbol){
        let resp = await fetchPrices(from,to);
      }}}><img src="/assets/img/refresh.png" /></a>
    <a className="pl-4"><img src="/assets/img/settings.png" /></a>
  </span>
</p>


          {fetchloading  && false? <Load loaded={loading} /> : <Fragment> <SwapCard switchHandler={switchHandler} side="from" val={from ? from.value : 0} onChangeBalance={onChangeBalance} setSide={setSide} show={currShow} setShow={setCurrShow} handleValue={handleValue} address = {from ? from.address : null}  selected={from} from={from} to={to} />  <SwapCard side="to" val={from ? from.value : 0} rate={selectedRate} address={to ? to.address : null} onChangeBalance={onChangeBalance} setSide={setSide} show={currShow} setShow={setCurrShow} hanleValue={handleValue} selected={to} from={from} to={to} /> </Fragment>}
            

            
            <button onClick={handleButton} type="button" className="btn btn-approve btn-block mt-3">
              {!active && !account ? 
              "Connect" :
              !result ? 
                "Select A coin":
                result.hasEnough ?
                "Exchange" :
                "InsufficientBalance"
            }
              
</button>
          </div>
        </div>
        <div className="col-md-6">
          <div className="table-responsive">
            <table className="table table-striped table-dark">
              <tbody>

                {
                  result ?
                  result.rates.map((e:any,i:any) => {
                    
                    let dexes:any = DEXesImages;
                    if (i == 0){
                      return(
                        <tr key={i} onClick={() => { setRate(i)}} className="offers">
                  <td><img src={"assets/media/dex/"+dexes[e.platform]} /> {e.source}</td>
                  <td>{e.rate}</td>
                  <td className="text-green">BEST</td>
                </tr>
                      )
                    }else{
                      return(
                        <tr key={i} onClick={() => { setRate(i)}} className="offers">
                  <td><img src={"assets/media/dex/"+dexes[e.platform]} /> {e.source}</td>
                  <td>{e.rate}</td>
                  <td className="text-red">{round((e.rate - result.rate.rate)/result.rate.rate)}%</td>
                </tr>
                      )
                    }
                  }) : ""
                }


                
                
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <CoinModal show={currShow} setShow={setCurrShow} handleCurr={handleSelect} currencies={tokens}  />
    <ConfModal show = {swapData.show} closeHandler={setSwapData} data={swapData} platform= {swapData.platform} id={swapData.id} address={swapData.address} />
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




   
      return fetchloading ? <Load loaded={loading} /> : <div className="d-flex" id="wrapper">
      <Sidebar current={props.current} />
      {html}
      <ModalConnect show={show} setShow={setShow} />

</div>
    
                
    

}


export default Swap;