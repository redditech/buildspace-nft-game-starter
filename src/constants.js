const CONTRACT_ADDRESS = "0x4c0f1C626f1Cc29E830EA041f03131038aba1bb7";

const transformCharacterData = (characterData) => {
    return {
        name: characterData.name,
        imageURI: "https://cloudflare-ipfs.com/ipfs/" + characterData.imageURI,
        weapon: characterData.weapon,
        hp: characterData.hp.toNumber(),
        maxHp: characterData.maxHp.toNumber(),
        attackDamage: characterData.attackDamage.toNumber()
    }
}
export { CONTRACT_ADDRESS, transformCharacterData };