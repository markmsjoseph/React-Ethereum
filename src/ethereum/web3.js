import Web3 from 'web3';

let web3;

  // We are in the browser and metamask is installed and running
  //first check to see if we are in the browser(typeof window is undefined means we are on the server, if it is not undefiend we are in the browser)
  //secondly, check to see if metamask as injected web3
if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  //create our own copy of web3
  web3 = new Web3(window.web3.currentProvider);
} else {
  // We are on the server *OR* the user is not running metamask
  //connect to rinkeby network through infura
  const provider = new Web3.providers.HttpProvider(
    'https://rinkeby.infura.io/orDImgKRzwNrVCDrAk5Q'
  );
  web3 = new Web3(provider);
}

export default web3;
