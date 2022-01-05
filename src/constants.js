const CONTRACT_ADDRESS = "0x10972Eee387999AF0de0870b53859FCfb79B73c0";

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