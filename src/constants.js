const CONTRACT_ADDRESS = "0x01fDB4B43cE442452F887b695CA785d059ac64A2";

const transformCharacterData = (characterData) => {
    return {
        name: characterData.name,
        imageURI: characterData.imageURI,
        weapon: characterData.weapon,
        hp: characterData.hp.toNumber(),
        maxHp: characterData.maxHp.toNumber(),
        attackDamage: characterData.attackDamage.toNumber()
    }
}
export {CONTRACT_ADDRESS, transformCharacterData};