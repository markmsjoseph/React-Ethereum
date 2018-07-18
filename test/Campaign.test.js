const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');//requires everything that exist in entire file
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
      accounts = await web3.eth.getAccounts();

      //deploy instance of factory contract, pass in abi and deploy and send transaction to network
      factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))//expects javascript object so we need to pass the jason
        .deploy({ data: compiledFactory.bytecode })//deploy new instance
        .send({ from: accounts[0], gas: '1000000' });//seof transaction and specify which account wants to deploy this(we got this from getAccounts)

      //use factory to make an instance of a campaignAddres
      await factory.methods.createCampaign('100').send({
        from: accounts[0],//accounts[0] is manager of this campaign
        gas: '1000000'
      });
      //when we send transaction, we get nothing in return so we have no idea where the address is, this is why we use getdeployedCampaigns
      const addresses = await factory.methods.getDeployedCampaigns().call();//returns an array of deployed campaigns
      campaignAddress = addresses[0];

      campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress//address of where campaign exist, we use already deployed version of the address so we dont have to redeploy and send
      );
});

describe('Campaigns', () => {
  it('deploys a factory and a campaign', () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it('marks caller as the campaign manager', async () => {
    const manager = await campaign.methods.manager().call();//manager method was created for us automatically because it is a public variable
    assert.equal(accounts[0], manager);
  });


  it('allows people to contribute money and marks them as approvers', async () => {
    await campaign.methods.contribute().send({
      value: '200',
      from: accounts[1]//who is sending transaction, accounts array is created by ganache and we have 10 accounts in it
    });
    const isContributor = await campaign.methods.approvers(accounts[1]).call();//call approvers because it is a public variable and pass in accounts[1], we should get true from the hash
    assert(isContributor);
  });

  it('requires a minimum contribution', async () => {
    try {
      await campaign.methods.contribute().send({
        value: '5',
        from: accounts[1]
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it('allows a manager to make a payment request', async () => {
    await campaign.methods
      .createRequest('Buy batteries', '100', accounts[1])
      .send({
        from: accounts[0],
        gas: '1000000'
      });
    const request = await campaign.methods.requests(0).call();

    assert.equal('Buy batteries', request.description);
  });

  it('processes requests', async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei('10', 'ether')
    });

    await campaign.methods
      .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
      .send({ from: accounts[0], gas: '1000000' });

    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: '1000000'
    });

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: '1000000'
    });

    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, 'ether');
    balance = parseFloat(balance);

    assert(balance > 104);
  });
});

// const assert = require('assert');//part of node standard library
// const ganache = require('ganache-cli');//local test network when we create test
// const Web3 = require('web3');//require constructor function
// const web3 = new Web3(ganache.provider());//provider allows us to connect to any provider, in this case ganache
//
// const { interface, bytecode } = require('../compile');
//
// let lottery;
// let accounts;
//
//
// //attempt to deploy contract
// beforeEach(async () => {
//   accounts = await web3.eth.getAccounts();//get list of accounts
//
//   //deploy instance of lottey contract
//   lottery = await new web3.eth.Contract(JSON.parse(interface))
//     .deploy({ data: bytecode })//takes in raw bytecode
//     .send({ from: accounts[0], gas: '1000000' });//sepcify gas as 1mill
// });
//
//
//
// describe('Lottery Contract', () => {
//
//
//   //make sure contract is deployed
//   it('deploys a contract', () => {
//           assert.ok(lottery.options.address);//address of accout that lottery contract was deployed to on local network
//   });
//
//
//   //we want to make sure if anyone enters into the lottery, their address is entered into the players array
//   it('allows one account to enter into lottery', async () => {
//           //attempt to enter into lottery
//           await lottery.methods.enter().send({
//             //who is attempting into the lottery
//             from: accounts[0],
//             //send money along to lottery
//             value: web3.utils.toWei('0.02', 'ether')//convert ether to wei
//           });
//
//           //make sure correct number of records and correct address is in array
//           const players = await lottery.methods.getPlayers().call({
//             from: accounts[0]
//           });
//
//           assert.equal(accounts[0], players[0]);
//           assert.equal(1, players.length);
//   });
//
//
//   //same as above but with multiple accounts are entered
//   it('allows multiple accounts to enter', async () => {
//           await lottery.methods.enter().send({
//             from: accounts[0],
//             value: web3.utils.toWei('0.02', 'ether')
//           });
//           await lottery.methods.enter().send({
//             from: accounts[1],
//             value: web3.utils.toWei('0.02', 'ether')
//           });
//           await lottery.methods.enter().send({
//             from: accounts[2],
//             value: web3.utils.toWei('0.02', 'ether')
//           });
//
//           const players = await lottery.methods.getPlayers().call({
//             from: accounts[0]
//           });
//
//           assert.equal(accounts[0], players[0]);
//           assert.equal(accounts[1], players[1]);
//           assert.equal(accounts[2], players[2]);
//           assert.equal(3, players.length);
//   });
//
//
//   //make sure user sends appropriate amount of ether before they can actually be added to lottery
//   it('requires a minimum amount of ether to enter', async () => {
//           try {
//             //enter user with some ether, with 0 so error will be thrown
//             await lottery.methods.enter().send({
//               from: accounts[0],
//               value: 0
//             });
//             assert(false);//something went wrong because user was able to enter with 0 ether therefore automatically fail the test
//           } catch (err) {
//             assert(err);//we catch error because user tried to enter with 0 ether, this makes test pass
//           }
//   });
//
//
//   //if someone other than manager tries to call pickwinner we fail test
//   it('only manager can call pickWinner', async () => {
//           try {
//             await lottery.methods.pickWinner().send({
//               from: accounts[1]//not manager account
//             });
//             assert(false);
//           } catch (err) {
//             assert(err);
//           }
//   });
//
//
//   //enter player, pick winner and make sure array is emptied
//   it('sends money to the winner and resets the players array', async () => {
//           await lottery.methods.enter().send({
//             from: accounts[0],
//             value: web3.utils.toWei('2', 'ether')
//           });
//
//           const initialBalance = await web3.eth.getBalance(accounts[0]);
//           await lottery.methods.pickWinner().send({ from: accounts[0] });
//           const finalBalance = await web3.eth.getBalance(accounts[0]);
//           const difference = finalBalance - initialBalance;
//
//           assert(difference > web3.utils.toWei('1.8', 'ether'));
//   });
//
//
// });
