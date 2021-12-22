import React,{useState} from 'react';
import ModalConnect from './GeneralComponents/ModalConnect';
import Sidebar from './GeneralComponents/Sidebar';
import TopNav from './GeneralComponents/TopNav';




function Farm(props:any){
	const [show,setShow] = useState(false);


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
                <table className="table table-striped table-dark">
                  <thead>
                    <tr>
                      <th scope="col">Pair</th>
                      <th scope="col">Provider</th>
                      <th scope="col">Farm</th>
                      <th scope="col">Earned</th>
                      <th scope="col">APR</th>
                      <th scope="col">Liquidity</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">ETH/USDT</th>
                      <td><img src="assets/img/clip1.png" /></td>
                      <td>Icon of Farm</td>
                      <td>$1,234.56</td>
                      <td>18%</td>
                      <td>$149.457.889</td>
                      <td>
                        <a className="btn btn-sm btn-connect mr-1"><span className="fa fa-coins icon" /> Invest</a>
                        <a className="btn btn-sm btn-connect"><span className="fa fa-piggy-bank icon" /> Farm</a>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">ETH/USDT</th>
                      <td><img src="assets/img/clip1.png" /></td>
                      <td>Icon of Farm</td>
                      <td>$1,234.56</td>
                      <td>18%</td>
                      <td>$149.457.889</td>
                      <td>
                        <a className="btn btn-sm btn-connect mr-1"><span className="fa fa-coins icon" /> Invest</a>
                        <a className="btn btn-sm btn-connect"><span className="fa fa-piggy-bank icon" /> Farm</a>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">ETH/USDT</th>
                      <td><img src="assets/img/clip1.png" /></td>
                      <td>Icon of Farm</td>
                      <td>$1,234.56</td>
                      <td>18%</td>
                      <td>$149.457.889</td>
                      <td>
                        <a className="btn btn-sm btn-connect mr-1"><span className="fa fa-coins icon" /> Invest</a>
                        <a className="btn btn-sm btn-connect"><span className="fa fa-piggy-bank icon" /> Farm</a>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">ETH/USDT</th>
                      <td><img src="assets/img/clip1.png" /></td>
                      <td>Icon of Farm</td>
                      <td>$1,234.56</td>
                      <td>18%</td>
                      <td>$149.457.889</td>
                      <td>
                        <a className="btn btn-sm btn-connect mr-1"><span className="fa fa-coins icon" /> Invest</a>
                        <a className="btn btn-sm btn-connect"><span className="fa fa-piggy-bank icon" /> Farm</a>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">ETH/USDT</th>
                      <td><img src="assets/img/clip1.png" /></td>
                      <td>Icon of Farm</td>
                      <td>$1,234.56</td>
                      <td>18%</td>
                      <td>$149.457.889</td>
                      <td>
                        <a className="btn btn-sm btn-connect mr-1"><span className="fa fa-coins icon" /> Invest</a>
                        <a className="btn btn-sm btn-connect"><span className="fa fa-piggy-bank icon" /> Farm</a>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">ETH/USDT</th>
                      <td><img src="assets/img/clip1.png" /></td>
                      <td>Icon of Farm</td>
                      <td>$1,234.56</td>
                      <td>18%</td>
                      <td>$149.457.889</td>
                      <td>
                        <a className="btn btn-sm btn-connect mr-1"><span className="fa fa-coins icon" /> Invest</a>
                        <a className="btn btn-sm btn-connect"><span className="fa fa-piggy-bank icon" /> Farm</a>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">ETH/USDT</th>
                      <td><img src="assets/img/clip1.png" /></td>
                      <td>Icon of Farm</td>
                      <td>$1,234.56</td>
                      <td>18%</td>
                      <td>$149.457.889</td>
                      <td>
                        <a className="btn btn-sm btn-connect mr-1"><span className="fa fa-coins icon" /> Invest</a>
                        <a className="btn btn-sm btn-connect"><span className="fa fa-piggy-bank icon" /> Farm</a>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">ETH/USDT</th>
                      <td><img src="assets/img/clip1.png" /></td>
                      <td>Icon of Farm</td>
                      <td>$1,234.56</td>
                      <td>18%</td>
                      <td>$149.457.889</td>
                      <td>
                        <a className="btn btn-sm btn-connect mr-1"><span className="fa fa-coins icon" /> Invest</a>
                        <a className="btn btn-sm btn-connect"><span className="fa fa-piggy-bank icon" /> Farm</a>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">ETH/USDT</th>
                      <td><img src="assets/img/clip1.png" /></td>
                      <td>Icon of Farm</td>
                      <td>$1,234.56</td>
                      <td>18%</td>
                      <td>$149.457.889</td>
                      <td>
                        <a className="btn btn-sm btn-connect mr-1"><span className="fa fa-coins icon" /> Invest</a>
                        <a className="btn btn-sm btn-connect"><span className="fa fa-piggy-bank icon" /> Farm</a>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">ETH/USDT</th>
                      <td><img src="assets/img/clip1.png" /></td>
                      <td>Icon of Farm</td>
                      <td>$1,234.56</td>
                      <td>18%</td>
                      <td>$149.457.889</td>
                      <td>
                        <a className="btn btn-sm btn-connect mr-1"><span className="fa fa-coins icon" /> Invest</a>
                        <a className="btn btn-sm btn-connect"><span className="fa fa-piggy-bank icon" /> Farm</a>
                      </td>
                    </tr>
                  </tbody>
                </table>
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
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped table-dark">
                  <thead>
                    <tr>
                      <th scope="col">Pair</th>
                      <th scope="col">Provider</th>
                      <th scope="col">Farm</th>
                      <th scope="col">Earned</th>
                      <th scope="col">APR</th>
                      <th scope="col">Liquidity</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">ETH/USDT</th>
                      <td><img src="assets/img/clip1.png" /></td>
                      <td>Icon of Farm</td>
                      <td>$1,234.56</td>
                      <td>18%</td>
                      <td>$149.457.889</td>
                      <td>
                        <a className="btn btn-sm btn-connect mr-1"><span className="fa fa-coins icon" /> Invest</a>
                        <a className="btn btn-sm btn-connect"><span className="fa fa-piggy-bank icon" /> Farm</a>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">ETH/USDT</th>
                      <td><img src="assets/img/clip1.png" /></td>
                      <td>Icon of Farm</td>
                      <td>$1,234.56</td>
                      <td>18%</td>
                      <td>$149.457.889</td>
                      <td>
                        <a className="btn btn-sm btn-connect mr-1"><span className="fa fa-coins icon" /> Invest</a>
                        <a className="btn btn-sm btn-connect"><span className="fa fa-piggy-bank icon" /> Farm</a>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">ETH/USDT</th>
                      <td><img src="assets/img/clip1.png" /></td>
                      <td>Icon of Farm</td>
                      <td>$1,234.56</td>
                      <td>18%</td>
                      <td>$149.457.889</td>
                      <td>
                        <a className="btn btn-sm btn-connect mr-1"><span className="fa fa-coins icon" /> Invest</a>
                        <a className="btn btn-sm btn-connect"><span className="fa fa-piggy-bank icon" /> Farm</a>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">ETH/USDT</th>
                      <td><img src="assets/img/clip1.png" /></td>
                      <td>Icon of Farm</td>
                      <td>$1,234.56</td>
                      <td>18%</td>
                      <td>$149.457.889</td>
                      <td>
                        <a className="btn btn-sm btn-connect mr-1"><span className="fa fa-coins icon" /> Invest</a>
                        <a className="btn btn-sm btn-connect"><span className="fa fa-piggy-bank icon" /> Farm</a>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">ETH/USDT</th>
                      <td><img src="assets/img/clip1.png" /></td>
                      <td>Icon of Farm</td>
                      <td>$1,234.56</td>
                      <td>18%</td>
                      <td>$149.457.889</td>
                      <td>
                        <a className="btn btn-sm btn-connect mr-1"><span className="fa fa-coins icon" /> Invest</a>
                        <a className="btn btn-sm btn-connect"><span className="fa fa-piggy-bank icon" /> Farm</a>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">ETH/USDT</th>
                      <td><img src="assets/img/clip1.png" /></td>
                      <td>Icon of Farm</td>
                      <td>$1,234.56</td>
                      <td>18%</td>
                      <td>$149.457.889</td>
                      <td>
                        <a className="btn btn-sm btn-connect mr-1"><span className="fa fa-coins icon" /> Invest</a>
                        <a className="btn btn-sm btn-connect"><span className="fa fa-piggy-bank icon" /> Farm</a>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">ETH/USDT</th>
                      <td><img src="assets/img/clip1.png" /></td>
                      <td>Icon of Farm</td>
                      <td>$1,234.56</td>
                      <td>18%</td>
                      <td>$149.457.889</td>
                      <td>
                        <a className="btn btn-sm btn-connect mr-1"><span className="fa fa-coins icon" /> Invest</a>
                        <a className="btn btn-sm btn-connect"><span className="fa fa-piggy-bank icon" /> Farm</a>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">ETH/USDT</th>
                      <td><img src="assets/img/clip1.png" /></td>
                      <td>Icon of Farm</td>
                      <td>$1,234.56</td>
                      <td>18%</td>
                      <td>$149.457.889</td>
                      <td>
                        <a className="btn btn-sm btn-connect mr-1"><span className="fa fa-coins icon" /> Invest</a>
                        <a className="btn btn-sm btn-connect"><span className="fa fa-piggy-bank icon" /> Farm</a>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">ETH/USDT</th>
                      <td><img src="assets/img/clip1.png" /></td>
                      <td>Icon of Farm</td>
                      <td>$1,234.56</td>
                      <td>18%</td>
                      <td>$149.457.889</td>
                      <td>
                        <a className="btn btn-sm btn-connect mr-1"><span className="fa fa-coins icon" /> Invest</a>
                        <a className="btn btn-sm btn-connect"><span className="fa fa-piggy-bank icon" /> Farm</a>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">ETH/USDT</th>
                      <td><img src="assets/img/clip1.png" /></td>
                      <td>Icon of Farm</td>
                      <td>$1,234.56</td>
                      <td>18%</td>
                      <td>$149.457.889</td>
                      <td>
                        <a className="btn btn-sm btn-connect mr-1"><span className="fa fa-coins icon" /> Invest</a>
                        <a className="btn btn-sm btn-connect"><span className="fa fa-piggy-bank icon" /> Farm</a>
                      </td>
                    </tr>
                  </tbody>
                </table>
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