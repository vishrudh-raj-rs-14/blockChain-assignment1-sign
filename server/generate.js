const {secp256k1} = require("ethereum-cryptography/secp256k1.js")
const {keccak256} = require("ethereum-cryptography/keccak")
const { toHex, utf8ToBytes} = require("ethereum-cryptography/utils.js")

const privateKey = secp256k1.utils.randomPrivateKey()
console.log("privateKey: ", toHex(privateKey))

const publicKey = secp256k1.getPublicKey(privateKey)
console.log("Public Key: ", toHex(publicKey))

console.log("Wallet Address: ", toHex(publicKey).slice(toHex(publicKey).length-20))

const message = "d588e1d52e0a73d24af6ecc65c310edd8057c40169679ed95f40e361b8ae689b"
const messageHash = keccak256(utf8ToBytes(message))
console.log("\n\n\n Message Hash: ", toHex(messageHash))
