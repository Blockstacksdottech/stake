import React,{useEffect,useState} from 'react';
import { useWeb3React } from '@web3-react/core';
import Sidebar from './GeneralComponents/Sidebar';
import ModalConnect from './GeneralComponents/ModalConnect';
import TopNav from './GeneralComponents/TopNav';
import _ from "lodash";

import { walletTokens as toks } from "../constants/spot-config/mainnet/config.json";

import {
	BTC,CHANGE_NOW_FLOW,SIDE_SHIFT_TYPE,supportedDEXes,SIMPLE_SWAP_FIXED
} from "../constants";

import InstantSwapApi from "../http/instantSwap";

import CoinModal from "./SwapingComponents/CoinModal";
import SwapCard from "./SwapingComponents/SwapCard";
import {  useToasts } from 'react-toast-notifications';

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
    const [result,setResult] = useState();
    const {addToast} = useToasts();
    const api:any = InstantSwapApi;
    const [tokens , setTokens] = useState([...toks,BTC])


    async function handleSelect(i:number){
      console.log(tokens[i]);
      let temp = {...tokens[i],value:0};
      let resp;
      if (side == "from"){
        setFrom(temp);
        resp = await fetchPrices(temp,to);
      }else if (side == "to"){
        setTo(temp);
        resp = await fetchPrices(from,temp);
      }
      console.log(resp);

    }


    const promiseHandler = (id:any, count:any, callback:any) => {
      return new Promise((resolve) => {
        callback()
          .then((response:any) => {
            setLoading({
              all:36,
              loaded:loading.loaded + count
            });
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
        api.paraswap.getRate(deposit.address, destination.address, fromAmount)
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
        console.log(promisesRes);
  
        const response = transformFetchedData(promisesRes);
  
        let result = getSortedResult(response);
  
        if (result.length > 0) {
          if (deposit.value) {
            destination.value = (deposit.value * result[0].rate).toFixed(6);
          } else if (destination.value) {
            deposit.value = (destination.value / result[0].rate).toFixed(6);
          }
          //updatePriceIntervally(deposit, destination);
        } else {
          addToast('Unavailable Pair', {
            appearance: 'error',
            autoDismiss: true,
          })
        }
        console.log({
          destination,
          deposit,
          rates: result,
          rate: result.length > 0 ? result[0] : undefined,
          loading: false,
          showMore: false,
          
        });
      } else {
        /* setState({
          pair,
          showMore: false,
        }); */
        console.log('else error');
      }
    };

    /* const getNewPrice = async (deposit, destination) => {
      const { t } = props;
  
      if (deposit !== null && destination !== null) {
        setState({
          priceLoading: true,
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
        } else {
          toast.error(t("errors.unavailablePair"));
        }
  
        setState(prevState => {
          let newRate = result[0];
          if(prevState.rate?.hasOwnProperty('platform')) {
            const newRes = result.find(_ => _.platform === prevState.rate.platform);
            if(newRes) {
              newRate = newRes;
            }
          }
          return {
            rates: result,
            rate: result.length > 0 ? newRate : undefined,
            priceLoading: false,
            hasEnoughBalance:
              !prevState.max || Number(deposit.value) <= Number(prevState.max.toSignificant(6)),
          }
        });
      }
    }


    const updatePriceIntervally = (deposit, destination) => {
      let priceInterval;
      if(priceInterval) {
        clearInterval(priceInterval);
        priceInterval = null;
      }
      priceInterval = setInterval(() => {
        getNewPrice(deposit, destination);
      }, 15000)
    } */

    function handleValue(e:any,side:string){
      let v = e.target.value;
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

            <SwapCard side="from" setSide={setSide} show={currShow} setShow={setCurrShow} hanleValue={handleValue}  selected={from} from={from} to={to} />
            <SwapCard side="to" setSide={setSide} show={currShow} setShow={setCurrShow} hanleValue={handleValue} selected={to} from={from} to={to} />

            
            <button type="button" className="btn btn-approve btn-block mt-3">Connect Wallet</button>
          </div>
        </div>
        <div className="col-md-6">
          <div className="table-responsive">
            <table className="table table-striped table-dark">
              <tbody>
                <tr>
                  <td><img src="assets/img/clip1.png" /> 1inch</td>
                  <td>4153.792919871237</td>
                  <td className="text-green">BEST</td>
                </tr>
                <tr>
                  <td><img src="assets/img/clip1.png" /> Defiswap</td>
                  <td>4153.792919871237</td>
                  <td className="text-white">Match</td>
                </tr>
                <tr>
                  <td><img src="assets/img/clip1.png" /> Sushiswap</td>
                  <td>4153.792919871237</td>
                  <td className="text-red">-0.2%</td>
                </tr>
                <tr>
                  <td><img src="assets/img/clip1.png" /> Uniswap V2</td>
                  <td>4153.792919871237</td>
                  <td className="text-red">-0.3%</td>
                </tr>
                <tr>
                  <td><img src="assets/img/clip1.png" /> ShibaSwap</td>
                  <td>4153.792919871237</td>
                  <td className="text-red">-0.4%</td>
                </tr>
                <tr>
                  <td><img src="assets/img/clip1.png" /> ShibaSwap</td>
                  <td>4153.792919871237</td>
                  <td className="text-red">-0.4%</td>
                </tr><tr>
                  <td><img src="assets/img/clip1.png" /> ShibaSwap</td>
                  <td>4153.792919871237</td>
                  <td className="text-red">-0.4%</td>
                </tr>
                <tr>
                  <td><img src="assets/img/clip1.png" /> ShibaSwap</td>
                  <td>4153.792919871237</td>
                  <td className="text-red">-0.4%</td>
                </tr>
                <tr>
                  <td><img src="assets/img/clip1.png" /> ShibaSwap</td>
                  <td>4153.792919871237</td>
                  <td className="text-red">-0.4%</td>
                </tr>
                <tr>
                  <td><img src="assets/img/clip1.png" /> ShibaSwap</td>
                  <td>4153.792919871237</td>
                  <td className="text-red">-0.4%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <CoinModal show={currShow} setShow={setCurrShow} handleCurr={handleSelect} currencies={tokens}  />
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




    return <div className="d-flex" id="wrapper">
        <Sidebar current={props.current} />
        {html}
        <ModalConnect show={show} setShow={setShow} />

</div>

}


export default Swap;