import React, {useEffect, useState} from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants
const BUILDSPACE_TWITTER_HANDLE = '_buildspace';
const BUILDSPACE_TWITTER_LINK = `https://twitter.com/${BUILDSPACE_TWITTER_HANDLE}`;
const TWITTER_HANDLE = 'redditech';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;


const App = () => {

  // State
  const [currentAccount, setCurrentAccount] = useState(null);

  // Actions
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have Metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if (accounts.length != 0) {
          const account = accounts[0];
          console.log("Found an authorized account: ", account);
          setCurrentAccount(account);
        } else {
          console.log("No authorized account found!");
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Implement your connectWallet method here
  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      // request access to account
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      // This should print out the public address once we authorize Metamask.
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Stickman Battles ⚔️</p>
          <p className="sub-text">Team up to fight the Big Boss!</p>
          <div className="connect-wallet-container">
            <img
              src="https://cloudflare-ipfs.com/ipfs/QmYTW85JiTf75Yw2QNvCJP2Hyakg6fNTsyyhFzCdJDM52P"
              alt="Red Shirt Hell with Phaser"
            />
            <button className="cta-button connect-wallet-button" onClick={connectWalletAction} >
              Connect Wallet To Get Started
            </button>
          </div>
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
          <span className="footer-text"> &nbsp; for my project on &nbsp;</span>
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={BUILDSPACE_TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`@${BUILDSPACE_TWITTER_HANDLE}`}</a>
          <span className='footer-text'>&nbsp;:&nbsp;"Create your own mini turn-based NFT browser game"</span>
        </div>
      </div>
    </div>
  );
};

export default App;
