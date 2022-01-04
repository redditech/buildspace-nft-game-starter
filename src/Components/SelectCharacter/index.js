import React, { useEffect, useState } from 'react';
import './SelectCharacter.css';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from "../../constants";
import stickmanBattleGame from '../../utils/StickmanBattleGame.json';
import LoadingIndicator from '../LoadingIndicator';

const SelectCharacter = ({ setCharacterNFT }) => {
    const [characters, setCharacters] = useState([]);
    const [gameContract, setGameContract] = useState(null);

    // minting state
    const [mintingCharacter, setMintingCharacter] = useState(false);

    useEffect(() => {
        const { ethereum } = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const gameContract = new ethers.Contract(
                CONTRACT_ADDRESS,
                stickmanBattleGame.abi,
                signer
            );

            // set our gameContract in state
            setGameContract(gameContract);
        } else {
            console.log("Ethereum object not found");
        }
    }, []);

    useEffect(() => {
        const getCharacters = async () => {
            try {
                console.log("Getting contract characters to mint");

                const charactersTxn = await gameContract.getAllDefaultCharacters();
                console.log("charactersTxn", charactersTxn);

                // go through all of our characters and transform the data
                const characters = charactersTxn.map((characterData) =>
                    transformCharacterData(characterData)
                );

                // Set all mintable characters in state
                setCharacters(characters);
            } catch (error) {
                console.error("Something went wrong fetching characters: ", error);
            }
        };

        // Add a callback that will fire when this event is received
        const onCharacterMint = async (sender, tokenId, characterIndex) => {
            console.log(
                `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
            );

            // Once our character NFT is minted we can fetch the metadata from our contract
            // And set it in state to move onto the Arena

            if (gameContract) {
                const characterNFT = await gameContract.checkIfUserHasNFT();
                console.log("CharacterNFT: ", characterNFT);
                setCharacters(transformCharacterData(characterNFT));
            }

            alert(`Your NFT is all done -- see it here: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
        };


        // If our gameContract is ready, let's get characters!
        if (gameContract) {
            getCharacters();

            // Setup NFT Minted Listener
            gameContract.on("CharacterNFTMinted", onCharacterMint);
        }

        return () => {
            // When component unmounts, make sure to clean up the listener
            if (gameContract) {
                gameContract.off("CharacterNFTMinted", onCharacterMint);
            }
        }
    }, [gameContract]);

    const mintCharacterNFTAction = (characterId) => async () => {
        try {
            if (gameContract) {
                // Show our loading indicator
                setMintingCharacter(true);
                console.log("Minting character in progress...");
                const mintTxn = await gameContract.mintCharacterNFT(characterId);
                await mintTxn.wait();
                console.log("mintTxn: ", mintTxn);
                // Hide loading indicator when finished
                setMintingCharacter(false);
            }
        } catch (error) {
            console.warn("MintCharacterAction Error: ", error);
            // If there was an error, hide loading indicator as well
            setMintingCharacter(false);
        }

    }

    const renderCharacters = () =>
        characters.map((character, index) => (
            <div className="character-item" key={character.name}>
                <div className="name-container">
                    <p>{character.name}</p>
                </div>
                <img src={character.imageURI} alt={character.name} />
                <button
                    type="button"
                    className="character-mint-button"
                    onClick={mintCharacterNFTAction(index)}
                >
                    {`Mint ${character.name}`}
                </button>
            </div>
        ))

    return (
        <div className="select-character-container">
            <h2>Mint Your Own Hero. Choose Wisely.</h2>
            {/* Only show when there are characters in state */}
            {characters.length > 0 && (
                <div className="character-grid">{renderCharacters()}</div>
            )}
            {/* Only show loading state if mintingCharacter is true */}
            {mintingCharacter && (
                <div className="loading">
                    <div className="indicator">
                        <LoadingIndicator />
                        <p> Minting In Progress ...</p>
                    </div>
                    <img
                        src="https://media2.giphy.com/media/61tYloUgq1eOk/giphy.gif?cid=ecf05e47dg95zbpabxhmhaksvoy8h526f96k4em0ndvx078s&rid=giphy.gif&ct=g"
                        alt="Minting loading indicator"
                    />
                </div>
            )}

        </div>
    )
}

export default SelectCharacter;