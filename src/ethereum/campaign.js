import web3 from './web3';
import Campaign from './build/Campaign.json';

//this is called with an address and we will create an instance of a campaign that points at the address
export default address => {
  return new web3.eth.Contract(JSON.parse(Campaign.interface), address);
};
