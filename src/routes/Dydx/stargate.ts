import { SigningStargateClient } from "@cosmjs/stargate";
import { Tendermint37Client } from "@cosmjs/tendermint-rpc";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";


export async function signAndSend(chainId, msgAny) {
    if (typeof window === 'undefined' || window.keplr == null) return
    await window.keplr.enable(chainId)
    let wallet = window.keplr.getOfflineSigner(chainId);
    const [firstAccount] = await wallet.getAccounts();
    const client = await SigningStargateClient.offline(
        wallet
    );
    const fee = {
        amount: [
            {
                denom: "uatom",
                amount: "100",
            },
        ],
        gas: "180000", // 180k
    };
    console.log(msgAny);
    wallet.signDirect(firstAccount, )
    const rawTx = await client.sign(
        firstAccount.address,
        [msgAny],
        fee,
        "",
        {
            accountNumber: 123123,
            sequence: 12,
            chainId: chainId
        }
    );

    let signedTx = Uint8Array.from(TxRaw.encode(rawTx).finish());
    let result = await window.keplr.sendTx(chainId, signedTx, 'sync');

    console.log(result);
}