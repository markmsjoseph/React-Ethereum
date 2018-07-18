import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {

  constructor(props){
    super(props);

    this.state={
      manager:'',
      players:[],
      balance:'',
      value:'',
      loading:''
    }
  }

  async componentDidMount(){
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({
      manager,
      players,
      balance
    });
  }

  submitForm = async(e)=>{
      e.preventDefault();
      const accounts = await web3.eth.getAccounts();

      this.setState({loading:"Waiting on transaction success...."});
      //first address in acccounts will be one used to enter into lottery, value is amount of money to enter into contract
      //value is in ether so we need to convert to wei
      //this block of code will take 15 to 20 seconds
      await lottery.methods.enter().send({
        from:accounts[0],
        value:web3.utils.toWei(this.state.value, 'ether')
      })
        this.setState({loading:"You have been entered"})
  }

  render() {
    console.log(web3.version);
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
          <p>this contract is managed by {this.state.manager}</p>
          <p>There are {this.state.players.length} players in the lottery</p>
          <p>Lottery Balance: {web3.utils.fromWei(this.state.balance,'ether')}</p>

          <form onSubmit={this.submitForm}>
            <h4>Enter into the lottery</h4>
            <label>Amount of ether to enter</label>
            <input value={this.state.value} onChange={(event) =>{this.setState({value:event.target.value})}} />
            <button >Enter</button>
          </form>
          <h1>{this.state.loading}</h1>
      </div>
    );
  }
}

export default App;
