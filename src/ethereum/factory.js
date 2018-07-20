import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

//first arg is contract abi and second arg is address that we deployed factory to
const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0xa2Ca9420dC451CdA800776dA216b5dba81025F7F'//address when you run node deploy.js
);

export default instance;
