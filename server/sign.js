const {secp256k1} = require("ethereum-cryptography/secp256k1.js")
const {utf8ToBytes, toHex} = require("ethereum-cryptography/utils")


const privateKey = (("4bb44946a3da43768148eba6ec494ac435cc964d40a8d5ca3d100eafaf47f083"))
const publicKey = ("03c85fe76cd20a53e7b13fd77763ca7ba88d9c6d9325b62c310740522d8c4f1525")
const messageHash = ("3050b039b245c2b7425f4918aea4c8950aee2cf15fc36dfff413f991ad7ca38c")

const signature =  (secp256k1.sign((messageHash), privateKey))
const verified = secp256k1.verify({r:signature.r, s:signature.s}, messageHash, publicKey)

console.log(signature)
console.log(verified)