export async function initKepler(chainId) {
    if (typeof window === 'undefined') return

    if (window.keplr == null) {
        alert('Go install Keplr >:(')
    } else {
        try {
            // If this fails, user is not logged in to Keplr
            await window.keplr.enable(chainId)
            
            const offlineSigner =
                window.getOfflineSigner != null
                    ? window.getOfflineSigner(chainId)
                    : null
            if (offlineSigner == null) return 'error'

            const accounts = await offlineSigner.getAccounts()

            console.log(accounts);

            return {
                account: accounts[0],
                signer: offlineSigner,
            }
        } catch (err) {
            console.log(err)
        }
    }
    return { address: '', signer: null }
}


// export async function delegate(accounts) {
//     const delegateMsg = MsgDelegate.fromPartial({
//         delegatorAddress: accounts[0].address,
//         validatorAddress:
//             'cosmosvaloper1address',
//         amount: { denom: 'stake', amount: '1000000000' }
//     })

//     const stargateClient = await SigningStargateClient.connectWithSigner(
//         rpcUrl,
//         offlineSigner
//     )

//     const test = await stargateClient.getAccount(accounts[0].address)
//     console.log({ test })

//     stargateClient.signAndBroadcast(
//         accounts[0].address,
//         [
//             {
//                 typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
//                 value: delegateMsg
//             }
//         ],
//         {
//             gas: '200000',
//             amount: [{ denom: 'stake', amount: '1000000000' }]
//         }
//     )
// }