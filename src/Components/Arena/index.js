import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from "../../constants";
import stickmanBattleGame from "../../utils/StickmanBattleGame.json";
import "./Arena.css";

// pass in characterNFT metadata so we can do a cool card in our UI

const Arena = ({ characterNFT, setCharacterNFT }) => {
    // state
    const [gameContract, setGameContract] = useState(null);

    // State that will hold boss metadata
    const [boss, setBoss] = useState(null);
    const [attackState, setAttackState] = useState('');

    // Actions
    const runAttackAction = async () => {
        try {
            if (gameContract) {
                setAttackState('attacking');
                console.log("Attacking boss ...");
                const attackTxn = await gameContract.attackBoss();
                await attackTxn.wait();
                console.log("attackTxn: ", attackTxn);
                setAttackState("hit");
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
                return {...prevState, hp:bossHp};
            });
            setCharacterNFT((prevState)=> {
                return {...prevState, hp:playerHp}
            });
        }

        if (gameContract) {
            // game is ready to go, let's fetch our boss
            fetchBoss();
            gameContract.on("AttackComplete", onAttackComplete);
        }

        // clean up this even when component is removed
        return () => {
            if (gameContract) {
                gameContract.off("AttackComplete", onAttackComplete);
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
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Arena;