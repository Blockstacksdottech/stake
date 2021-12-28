import React,{useEffect} from "react";
import { useWeb3React } from '@web3-react/core';
import { ETHER, Token } from "@uniswap/sdk";
import { formatNumber , toFixed } from "../../utils";
import Web3 from "web3";
import {getCoinBalance} from "../../hooks/loadBalance";





function SwapCard(props:any){



    function openModal(){
      props.setSide(props.side);
      props.setShow(!props.show)
    }


    const { account,active,library } = useWeb3React();
    
    
    


    useEffect(() => {(async () => {
      console.log('eth here')
      console.log(props.side);
      console.log(ETHER);
      let currency;
      if (props.selected) {
        currency = new Token(props.selected.chainId, props.selected.address, props.selected.decimals, props.selected.symbol, props.selected.name);
      }
      let selectedCurrencyBalance = await getCoinBalance(
        account ?? undefined,
        active,
        library,
        props.selected && props.selected.symbol === "ETH" ? ETHER : currency
      );
      props.onChangeBalance(selectedCurrencyBalance,props.side);
    })()
      
    }, [props.address]);

    const html = <div className={props.side == "from" ? "card card-from" : "card card-to mt-2" }  >
    <div className="card-body">
      <p className="card-title">
        <small> {props.side == "from" ? "From" : "To (estimated)"}</small> 
        {active ? <small className="float-right">Balance: {props.selected ?  (() => {console.log('here 1'); console.log(toFixed(props.selected.max / 10**18)) ; 
        
      return Web3.utils.fromWei(String(props.selected.max),'ether') })()  : 0}</small> : "" }
      </p>
      <p className="card-title mt-3 select-input-container">
        {props.selected ? <span className="selector" onClick={openModal}>
          <img src={props.selected.logoURI} className="mb-4" /> <span className="h1"> {props.selected.symbol}</span> <i className="fa fa-chevron-down icon-left" />
        </span> : <span className="selector" onClick={openModal}>
           <span className="h1"> Select a Coin</span> <i className="fa fa-chevron-down icon-left" />
        </span>  }

        <input className="float-right Curr-input" disabled={props.side == 'from' ? false : true} value={props.side == "from" ? props.val : props.rate ?  props.rate.rate * props.val : "0"} onChange={(e:any) => props.handleValue(e,props.side)} inputMode="decimal" title="Token Amount" autoComplete="off" autoCorrect="off" type="text" pattern="^[0-9]*[.,]?[0-9]*$" placeholder="0.0" minLength={1} maxLength={79} spellCheck="false" />
        
       
      </p>
      <p className="card-title">
        {props.selected ? <small>{props.selected.name}</small> : "" }
         
        {props.from && props.to && props.side != "from" ? <small className="float-right">1 {props.from.symbol} ~= {props.rate.rate} {props.to.symbol}</small> :   ""}
        
      </p>
    </div>
  </div>


    return html;
}


export default SwapCard