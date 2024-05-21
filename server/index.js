const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const {secp256k1} = require("ethereum-cryptography/secp256k1.js")
const {keccak256} = require("ethereum-cryptography/keccak")
const { toHex, utf8ToBytes} = require("ethereum-cryptography/utils.js")


app.use(cors());
app.use(express.json());

const balances = {
  "0x2c310740522d8c4f1525": 100,
  "0xf2a477abbe7bdeae623d": 50,
  "0x7d9df8a3dfb3081d62ba": 75,
};
const publicKeys={
  "0x2c310740522d8c4f1525":"03c85fe76cd20a53e7b13fd77763ca7ba88d9c6d9325b62c310740522d8c4f1525", //4bb44946a3da43768148eba6ec494ac435cc964d40a8d5ca3d100eafaf47f083
  "0xf2a477abbe7bdeae623d":"02ea361fc8def5e61d66c5729162dc8c63cfa28496e977f2a477abbe7bdeae623d", //dfbe5b3cd6ad66eb90d64a70d5c51ad0be755ec78c6bbfa782fccebb98cca46b
  "0x7d9df8a3dfb3081d62ba":"036e81e3dc6f4ad5acad1a4c99619f2a01337fd3929aa17d9df8a3dfb3081d62ba", //82c3bd37d6ae84650198c99877b84dd6e16051fc062b988a93e043d2c3efe30a
}

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, message, messageHash, signature } = req.body; 

  if(!message || !messageHash || !signature) 

  if(toHex(keccak256(utf8ToBytes(JSON.stringify(message)))) != messageHash) 
    return res.status(400).send({ message: "Message has been tampered" });
  if(!secp256k1.verify({r:BigInt(signature.r.slice(0, signature.r.length-1)), s:BigInt(signature.s.slice(0, signature.s.length-1))}, messageHash, publicKeys[sender]))
    return res.status(400).send({ message: "Invalid Signature" });

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
