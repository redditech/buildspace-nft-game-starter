import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import SelectCharacter from './Components/SelectCharacter';
import { CONTRACT_ADDRESS, transformCharacterData } from './constants';
import stickmanBattleGame from './utils/StickmanBattleGame.json'
import { ethers } from 'ethers';
import Arena from "./Components/Arena";
import LoadingIndicator from "./Components/LoadingIndicator";

// Constants
const BUILDSPACE_TWITTER_HANDLE = '_buildspace';
const BUILDSPACE_TWITTER_LINK = `https://twitter.com/${BUILDSPACE_TWITTER_HANDLE}`;
const TWITTER_HANDLE = 'redditech';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;


const App = () => {

  // State
  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null);
  const [isLoading, setIsLoading] = useState(false);



  // Render Methods
  const renderContent = () => {

    // If app is loading, render loading indicator
    if (isLoading) {
      return <LoadingIndicator />;
    }
    // Scenario #1
    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
          <img
            src="https://cloudflare-ipfs.com/ipfs/QmYTW85JiTf75Yw2QNvCJP2Hyakg6fNTsyyhFzCdJDM52P"
            alt="Red Shirt Hell with Phaser"
          />
          <button className="cta-button connect-wallet-button" onClick={connectWalletAction} >
            Connect Wallet To Get Started
          </button>
        </div>
      )
    } else if (currentAccount && !characterNFT) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />;

      // If there is a connected wallet and characterNFT it's time to battle
    } else if (currentAccount && characterNFT) {
      return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />;
    }
  }

  // Actions
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have Metamask!");
        setIsLoading(false);
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if (accounts.length !== 0) {
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

    // release the state after all function logic
    setIsLoading(false);
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

  // const checkNetwork = async () => {
  //   try {
  //     const {ethereum} = window;
  //     if (ethereum) {
  //       if (ethereum.networkVersion != '4') {
  //         console.log(ethereum.networkVersion);
  //         alert("Please connect to Rinkeby");
  //       }
  //     }
      
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    // Anytime our component mounts, make sure to set our loading state
    setIsLoading(true);
    checkIfWalletIsConnected();
  }, []);

  // useEffect(() => {
  //   checkNetwork();
  // }, [currentAccount]);

  useEffect(() => {
    // Function to interact with the smart contract
    const fetchNFTMetadata = async () => {
      console.log("Checking for Character NFT on address: ", currentAccount);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        stickmanBattleGame.abi,
        signer
      );

      const txn = await gameContract.checkIfUserHasNFT();
      if (txn.name) {
        console.log("User has character NFT");
        setCharacterNFT(transformCharacterData(txn));
      } else {
        console.log("No character NFT found");
      }
    };

    setIsLoading(false);

    // Only run this if we have a connected wallet
    if (currentAccount) {
      console.log("CurrentAccount: ", currentAccount);
      fetchNFTMetadata();
    }
  }, [currentAccount])
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Stickman Battles ⚔️</p>
          <p className="sub-text">Team up to fight the Big Boss!</p>
          {renderContent()}
          <div>
            <a href="https://faucets.chain.link/rinkeby" target="_blank" rel="noreferrer">
              Get Rinkeby Testnet ETH
            </a>
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
