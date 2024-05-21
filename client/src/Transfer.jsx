import { useEffect, useState } from "react";
import server from "./server";
import {keccak256, } from 'ethereum-cryptography/keccak'
import {toHex, utf8ToBytes} from 'ethereum-cryptography/utils'

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [hashed, setHashed] = useState("");
  const [signaturer, setSignaturer] = useState("");
  const [signatures, setSignatures] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);


  useEffect(()=>{
    if(!sendAmount || !recipient) return;
    if(!parseInt(sendAmount)) return;
    const message = JSON.stringify({sender: address, amount: parseInt(sendAmount), recipient});
    const messageHash = toHex(keccak256(utf8ToBytes(message)));
    setHashed(messageHash);
  }, [sendAmount, recipient])


  async function transfer(evt) {
    evt.preventDefault();

    try {
      console.log("here")
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        message: ({sender: address, amount: parseInt(sendAmount), recipient}),
        signature:{
          r: (signaturer),
          s: (signatures)
        },
        messageHash: hashed
      });
      setBalance(balance);
    } catch (ex) {
      console.error(ex);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={(e)=>setSendAmount(e.target.value)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={(e)=>setRecipient(e.target.value)}
        ></input>
      </label>

    <div>
      Message to be Signed
      <div>
        {hashed}
      </div>
    </div>

      <label>
        Signature
        <input
          placeholder="Type signature for particular message"
          value={signaturer}
          onChange={setValue(setSignaturer)}
        ></input>
         <input
          placeholder="Type signature for particular message"
          value={signatures}
          onChange={setValue(setSignatures)}
        ></input>
      </label>

      {<input onClick={transfer} className="button" value="Transfer" />}
      
    </form>
  );
}

export default Transfer;
