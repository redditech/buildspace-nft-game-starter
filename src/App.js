import React from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants
const BUILDSPACE_TWITTER_HANDLE = '_buildspace';
const BUILDSPACE_TWITTER_LINK = `https://twitter.com/${BUILDSPACE_TWITTER_HANDLE}`;
const TWITTER_HANDLE = 'redditech';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;


const App = () => {
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
