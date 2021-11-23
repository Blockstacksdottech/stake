import { useWeb3React } from '@web3-react/core';
import React , {useEffect,useState} from 'react';
import { bep20, pool } from '../wallet/abis';
import { pooladd, token } from '../wallet/addresses';
import ModalConnect from './ModalConnect';
import Sidebar from './Sidebar';
import StakeCard from './StakeCard';
import {calculateAP, loadContract, toFixed} from '../utils';
import Reward from './Reward';
import DepositHistory from './DepositHistory';

function Staking() {

    const { active,account , deactivate ,library } = useWeb3React();
    const [balance,setBalance] = useState(0);
    const [reward,setReward] = useState(0);
    const [staked,setStaked] = useState(0);
    const [totalSupply,setTotal] = useState(0);
    const [deposits,setDeposits] = useState([]);
    const [show,setShow] = useState(false);
    const [apy,setApy] = useState(100);
    

    async function disconnect(){
        try {
            deactivate();
        }catch (exc){
            console.log(exc);
        }
    }


    async function getBalance(){
      let c = loadContract(library,bep20,token);
      let resp= await c.methods.balanceOf(account).call();
      //console.log(resp);
      setBalance(resp);
  }

  async function getRewards(){
    let c = loadContract(library,pool,pooladd);
    let resp = await c.methods.withdrawableRewardsOf(account).call();
    setReward(Number(resp));
}

async function getStaked(){
    let c = loadContract(library,pool,pooladd);
    let resp = await c.methods.getTotalDeposit(account).call();
    setStaked(Number(resp));
}

async function getDeposits(){
  let c = loadContract(library,pool,pooladd);
  let resp = await c.methods.getDepositsOf(account).call();
  //console.log(resp);
  setDeposits(resp);
}

  async function getApy(){
    await calculateAP(library,pool,pooladd,false,setApy,600);
}

  async function getLiquidity(){
    let c = loadContract(library,pool,pooladd);
    let resp = await c.methods.totalSupply().call();
    setTotal(toFixed(resp / 10**18));
  }

  

   

    useEffect(
        () => {
            (async ()=>{if (active && library){
                await getApy();
                await getLiquidity();
            }})();
            
        },
        [active,account]
    )


    

    const html = (
  <div id="page-content-wrapper">
    {/* Top navigation*/}
    <nav className="navbar navbar-expand-lg bg-dark">
      <div className="container-fluid">
        <i className="fa fa-bars fa-2x" id="sidebarToggle" />
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <a className="nav-link btn btn-sm btn-123 mr-5px" href="#!">123 <span className="fa fa-gas-pump" /></a>
          </li>
          <li className="nav-item">
            {active ? <a className="nav-link btn btn-sm btn-connect" onClick={disconnect}  >Disconnect</a>
             : <a className="nav-link btn btn-sm btn-connect" onClick={() => {setShow(!show)}}  data-toggle="modal" data-target="#ConnectModal">Connect Wallet</a>}
          </li>
        </ul>
      </div>
    </nav>
    {/* Page content*/}
    <div className="right-side">
      <div className="container-fluid">
        <div className="row mt-4">
          <h1>Stakig</h1>
          <p>Stake ABC Tokens and earn rewards</p>
        </div>
        <div className="row mt-5">
          <div className="left">
            <i className="fa fa-circle fa-4x" />
          </div>
          <div className="right">
            <h4>ABC Staking</h4>
            <span className="badge btn-connect">BSC Testnet</span>
            <span className="badge">Contract Testnet <i className="fa fa-external-link-alt" /></span>
            <span className="badge">APY: {apy}%</span>
          </div>
        </div>
        <div className="row mt-4">
          <StakeCard balance={balance} getBalance={getBalance} getDeposits = {getDeposits} getStaked={getStaked} getRewards={getRewards}/>
          <Reward reward={reward} setReward={setReward} staked={staked} setStaked={setStaked} getRewards={getRewards} getStaked={getStaked} />
        </div>
        <div className="row my-4">
          <div className="col-md-12">
            <div id="accordion">
              <div className="card accordion">
                <div className="card-header accordion-header" id="headingOne">
                  <h5 className="mb-0">
                    <button className="btn btn-link" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                      <i className="fa fa-chevron-up" /> &nbsp;About this staking
                      pool
                    </button>
                  </h5>
                </div>
                <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
                  <div className="card-body">

                    <DepositHistory getBalance={getBalance} deposits={deposits} setDeposits={setDeposits} getDeposits={getDeposits} />





                    <div className="row">
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Total Staking rewards</label>
                              <div className="input-group">
                                <input type="text" disabled={true} className="form-control input-about" defaultValue="0" />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Total Pool Liquidity</label>
                              <div className="input-group">
                                <input type="text" disabled={true} className="form-control input-about" value={totalSupply} />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Withdrawal Fee</label>
                              <div className="input-group">
                                <input type="text" disabled={true} className="form-control input-about" defaultValue="0%" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-12">
                            <label>Staking address</label>
                            <div className="input-group">
                              <input type="text" disabled={true} className="form-control input-about" defaultValue={pooladd} />
                              <div className="input-group-append">
                                <a href={"https://testnet.bscscan.com/address/"+pooladd} className="
                                    input-group-text input-group-about-text
                                  " id="basic-addon2"><i className="fa fa-external-link-alt" /></a>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row mt-3">
                          <div className="col-md-12">
                            <label>Token address</label>
                            <div className="input-group">
                              <input type="text" disabled={true} className="form-control input-about" defaultValue={token} />
                              <div className="input-group-append">
                                <a href={"https://testnet.bscscan.com/address/"+token} className="
                                    input-group-text input-group-about-text
                                  " id="basic-addon2"><i className="fa fa-external-link-alt" /></a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-md-12">
                        <div className="form-group">
                          <label>Token Rate</label>
                          <p>1 ABC <i className="fa fa-circle" /> = $0.03</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
 

);



    return <div className="d-flex" id="wrapper">
        <Sidebar />
        {html}
        <ModalConnect show={show} setShow={setShow} />
    </div>;

}


export default Staking;