const CONTRACT_ADDRESS = "0x0a4b6c7b25005d3B9a2E0C9F582821c7175976e6";

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
export {CONTRACT_ADDRESS, transformCharacterData};