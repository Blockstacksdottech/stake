import React from "react";
import { useWeb3React } from '@web3-react/core';




function SwapCard(props:any){

  const {active} = useWeb3React();


    function openModal(){
      props.setSide(props.side);
      props.setShow(!props.show)
    }

    const html = <div className={props.side == "from" ? "card card-from" : "card card-to mt-2" }  >
    <div className="card-body">
      <p className="card-title">
        <small> {props.side == "from" ? "From" : "To (estimated)"}</small> 
        {active ? <small className="float-right">Balance: 0</small> : "" }
      </p>
      <p className="card-title mt-3 select-input-container">
        {props.selected ? <span className="selector" onClick={openModal}>
          <img src={props.selected.logoURI} className="mb-4" /> <span className="h1"> {props.selected.symbol}</span> <i className="fa fa-chevron-down icon-left" />
        </span> : <span className="selector" onClick={openModal}>
           <span className="h1"> Select a Coin</span> <i className="fa fa-chevron-down icon-left" />
        </span>  }

        <input className="float-right Curr-input" inputMode="decimal" title="Token Amount" autoComplete="off" autoCorrect="off" type="text" pattern="^[0-9]*[.,]?[0-9]*$" placeholder="0.0" minLength={1} maxLength={79} spellCheck="false" />
        
       
      </p>
      <p className="card-title">
        {props.selected ? <small>{props.selected.name}</small> : "" }
         
        {props.from && props.to && props.side != "from" ? <small className="float-right">1 {props.from.symbol} ~= {props.rate} {props.to.symbol}</small> :   ""}
        
      </p>
    </div>
  </div>


    return html;
}


export default SwapCard