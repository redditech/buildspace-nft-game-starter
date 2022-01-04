const CONTRACT_ADDRESS = "0xF5e25F2Bbd4B06cbD4c5867E55f57F90E8ed3bf6";

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