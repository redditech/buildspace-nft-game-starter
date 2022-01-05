import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from "../../constants";
import stickmanBattleGame from "../../utils/StickmanBattleGame.json";
import "./Arena.css";
import LoadingIndicator from '../LoadingIndicator';

// pass in characterNFT metadata so we can do a cool card in our UI

const Arena = ({ characterNFT, setCharacterNFT }) => {
    // state
    const [gameContract, setGameContract] = useState(null);

    // State that will hold boss metadata
    const [boss, setBoss] = useState(null);
    const [attackState, setAttackState] = useState('');
    const [showToast, setShowToast] = useState(false);

    // Actions
    const runReviveAction = async () => {
        try {
            if (gameContract) {
                setAttackState('reviving');
                console.log("Reviving hero...");
                const reviveTxn = await gameContract.revivePlayer();
                await reviveTxn.wait();
                console.log("reviveTxn: ", reviveTxn);
                setAttackState("");
            }
        }
        catch (error) {
            console.log("Error reviving: ", error);
            setAttackState("");
        }
    }
    const runAttackAction = async () => {
        try {
            if (gameContract) {
                setAttackState('attacking');
                console.log("Attacking boss ...");
                const attackTxn = await gameContract.attackBoss();
                await attackTxn.wait();
                console.log("attackTxn: ", attackTxn);
                setAttackState("hit");

                // set toast true, and then false 5 seconds later.
                setShowToast(true);
                setTimeout(() => {
                    setShowToast(false);
                }, 5000)
            }
        } catch (error) {
            console.error("Error attacking boss: ", error);
            setAttackState("");
        }
    };
    //useEffects
    useEffect(() => {
        //setup async function that will get the boss from our contract and set in state
        const fetchBoss = async () => {
            const bossTxn = await gameContract.getBigBoss();
            console.log("Boss: ", bossTxn);
            setBoss(transformCharacterData(bossTxn));
        };

        //Setup logic when this event is fired off
        const onAttackComplete = (newBossHp, newPlayerHp) => {
            const bossHp = newBossHp.toNumber();
            const playerHp = newPlayerHp.toNumber();

            console.log(`AttackComplete: Boss Hp: ${bossHp} Player Hp: ${playerHp}`);

            // Update both player and boss Hp
            setBoss((prevState) => {
                return { ...prevState, hp: bossHp };
            });
            setCharacterNFT((prevState) => {
                return { ...prevState, hp: playerHp }
            });
        };

        const onReviveComplete = (newPlayerHp) => {
            const playerHp = newPlayerHp.toNumber();
            console.log(`RevivePlayer: Player Hp: ${playerHp}`)

            // Update the player Hp
            setCharacterNFT((prevState) => {
                return { ...prevState, hp: playerHp }
            })
        }

        if (gameContract) {
            // game is ready to go, let's fetch our boss
            fetchBoss();
            gameContract.on("AttackComplete", onAttackComplete);
            gameContract.on("ReviveComplete", onReviveComplete);
        }

        // clean up this even when component is removed
        return () => {
            if (gameContract) {
                gameContract.off("AttackComplete", onAttackComplete);
                gameContract.off("ReviveComplete", onReviveComplete);
            }
        }
    }, [gameContract])
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

            setGameContract(gameContract);
        } else {
            console.log("Ethereum object not found");
        }
    }, []);

    return (
        <div className="arena-container">
            {boss && characterNFT && (
                <div id="toast" className={showToast ? 'show' : ''}>
                    <div id="desc">{`💥 ${boss.name} was hit for ${characterNFT.attackDamage}!`}</div>
                </div>
            )}
            {boss && (
                <div className="boss-container">
                    <div className={`boss-content ${attackState}`}>
                        <h2>🔥 {boss.name} armed with {boss.weapon} 🔥</h2>
                        <div className="image-content">
                            <img src={boss.imageURI} alt={`Boss ${boss.name}`} />
                            <div className="health-bar">
                                <progress value={boss.hp} max={boss.maxHp} />
                                <p> {`${boss.hp} / ${boss.maxHp} HP`}</p>
                            </div>
                        </div>
                    </div>
                    <div className="attack-container">
                        <button className="cta-button" onClick={runAttackAction}>
                            {`💥 Attack ${boss.name}`}
                        </button>
                    </div>
                    {attackState === 'attacking' && (
                        <div className="loading-indicator">
                            <LoadingIndicator />
                            <p>Attacking...</p>
                            <img
                                src="https://i.imgur.com/IFddaw7.gif"
                                alt="Minting loading indicator" style={{
                                    borderRadius: '10px', width: '300px', height: '150px'
                                }}
                            />
                        </div>
                    )}
                    {/* Only show loading state if reviving is true */}
                    {attackState === 'reviving' && (
                        <div className="loading">
                            <div className="indicator">
                                <LoadingIndicator />
                                <p> Reviving In Progress ...</p>
                            </div>
                            <img
                                src="https://i.imgur.com/7P0yYCZ.gif"
                                alt="Reviving loading indicator" style={{
                                    borderRadius: '10px', width: '300px', height: '150px'
                                }}
                            />
                        </div>
                    )}
                </div>
            )}
            {/* Character NFT */}
            {characterNFT && (
                <div className="players-container">
                    <div className="player-container">
                        <h2>Your Character</h2>
                        <div className="player">
                            <div className="image-content">
                                <h2>{characterNFT.name} armed with {characterNFT.weapon}</h2>
                                <img
                                    src={characterNFT.imageURI}
                                    alt={`Character ${characterNFT.name}`}
                                />
                                <div className="health-bar">
                                    <progress value={characterNFT.hp} max={characterNFT.maxHp} />
                                    <p>{`${characterNFT.hp} / ${characterNFT.maxHp} HP`}</p>
                                </div>

                            </div>
                            <div className="stats">
                                <h4>{`⚔️ Attack Damage: ${characterNFT.attackDamage}`}</h4>
                            </div>
                            <div>
                                {characterNFT.hp <= 0 && (
                                    <button type="button"
                                        className="character-mint-button" onClick={runReviveAction}>
                                        Revive your hero!
                                    </button>
                                )}
                            </div>

                        </div>
                    </div>
                    {/* <div className="active-players">
                            <h2>Active Players</h2>
                            <div className="players-list">{renderActivePlayersList()}</div>
                        </div> */}
                </div>
            )}
        </div>
    );
};

export default Arena;