import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

//first arg is contract abi and second arg is address that we deployed factory to
const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0xAA8fFAbFD781Cc2F42f7d4274A57F9679b09F7f4'
);

export default instance;
