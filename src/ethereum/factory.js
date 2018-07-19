import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

//first arg is contract abi and second arg is address that we deployed factory to
const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0x290454ddF360150f1f6dF2Fb2b5564732ba0A595'
);

export default instance;
