<script lang="ts">
    import MessageTypes from './messagetypes';
    import { Checkbox, Button, Tag, TextInput } from "carbon-components-svelte";
    import { MsgSend, MsgGrant, MsgRevoke, MsgRewardsOptOut } from '@injectivelabs/sdk-ts'
    import { WalletStrategy, Wallet, MsgBroadcaster } from '@injectivelabs/wallet-ts'
    import { Network } from '@injectivelabs/networks'
    import { ChainId } from '@injectivelabs/ts-types'
    import { grants, updateGrants, type GrantObject } from './grantsstore';
	import { account, setAccount } from './walletstore';
    import { notifier } from 'components/notifications';
    import Grant from './Grant.svelte'
    
    let values = MessageTypes
    
    let selectedGrant:any[] = values.filter(a=>true);
    let days = 30;
    let sendAmount = 0.8;
    let shouldSendAmount = false;
    
    let walletStrategy = new WalletStrategy({
        chainId: ChainId.Mainnet,
        wallet: Wallet.Keplr
    });

    function disconnect() {
        setAccount("");
        walletStrategy.disconnectWallet();
    }

    function connect() {
        walletStrategy.getAddresses().then((address)=> {
            setAccount(address[0]);
            updateGrants();
            console.log(address[0]);
        });
    }
    
    walletStrategy.onAccountChange((account) => {
        setAccount(account);
        updateGrants();
        console.log(account);
    });


    let broadCaster = new MsgBroadcaster({
        walletStrategy: walletStrategy,
        network: Network.Mainnet,
        // networkEndpoints: {
        //     indexer: 'https://sentry.exchange.grpc-web.injective.network',
        //     grpc: 'https://sentry.chain.grpc-web.injective.network',
        //     rpc: 'https://sentry.tm.injective.network',
        //     rest: 'https://sentry.lcd.injective.network',
        //     chronos: 'https://sentry.exchange.grpc-web.injective.network',
        //     explorer: 'https://sentry.exchange.grpc-web.injective.network',
        // },
        networkEndpoints: {
            indexer: 'https://sentry.exchange.grpc-web.injective.network',
            grpc: 'https://sentry.chain.grpc-web.injective.network',
            rpc: '/',
            rest: '/',
            chronos: '/',
            explorer: '/',
        }
    });


    // inj18cmlptv4zuhg4ulqggu02dahjkx83m2de3tgef
    let toAddress = "";

    async function removeGrant(e:any) {
        let grant: GrantObject = e.detail;
        removeGrants([grant]);
    }

    async function removeGrants(grants: GrantObject[]) {
        let revokeMessages = grants.map((grant)=> {
                return MsgRevoke.fromJSON({
                grantee: grant.grantee,
                granter: grant.granter,
                messageType: grant.authorization.msg
            })
        });;
        
        let msgs = [...revokeMessages];

        let broadCastMessage = {
            address: $account,
            msgs
        }

        try {
            let result = await broadCaster.broadcast(broadCastMessage);
            if (result.code == 0 && result.txHash) {
                notifier.success(`Transaction successful`, `Transaction hash: ${result.txHash}`, 3000, ``);
            } else {
                notifier.error(`Error in transaction`, result.rawLog, 3000, ``);
            }
            console.log(result);
        }catch(err) {
            console.log(err);
            notifier.error(`Error in transaction`, (err as any).message, 3000, ``);
        }
        updateGrants();
    }

    async function optOut() {
        let optOutMessage = MsgRewardsOptOut.fromJSON({
            sender: $account
        });

        let msgs = [optOutMessage];

        let broadCastMessage = {
            address: $account,
            msgs
        }

        try {
            let result = await broadCaster.broadcast(broadCastMessage);
            if (result.code == 0 && result.txHash) {
                notifier.success(`Transaction successful`, `Transaction hash: ${result.txHash}`, 3000, ``);
            } else {
                notifier.error(`Error in transaction`, result.rawLog, 3000, ``);
            }
            console.log(result);
        }catch(err) {
            console.log(err);
            notifier.error(`Error in transaction`, (err as any).message, 3000, ``);
        }
    }

    async function approveGrants() {
        if (!toAddress || !$account) {
            notifier.error(`Error in transaction`, `Connect and enter a valid address`, 3000, ``);
            return;
        }
        
        const injectiveAddress = $account

        let grantMessages = selectedGrant.map((grant)=> {
            let grantMsg =  MsgGrant.fromJSON({
                grantee: toAddress,
                granter: injectiveAddress,
                messageType: grant,
                expiration: Math.floor(Date.now() / 1000) + (86400 * parseInt(days.toString())),
                expiryInYears: 1,
                expiryInSeconds: 86400 * 30
            })
            console.log(grantMsg);
            return grantMsg;
        })

        let msgs:any[] = [];

        if (grantMessages.length > 0) {
            msgs = [...grantMessages];
        }

        if (shouldSendAmount) {
            let val  = (Number(sendAmount) * Math.pow(10, 18)).toFixed(0);
            let amount = {
                denom: "inj",
                amount: val
            };
            const msg = MsgSend.fromJSON({
                amount,
                srcInjectiveAddress: injectiveAddress,
                dstInjectiveAddress: toAddress,
            });
            console.log(msg);
            msgs.push(msg as any);
        }

        let broadCastMessage = {
            address: injectiveAddress,
            msgs
        }

        console.log(broadCastMessage);
        console.log(broadCaster);

        try {
            let result = await broadCaster.broadcast(broadCastMessage);
            if (result.code == 0 && result.txHash) {
                notifier.success(`Transaction successful`, `Transaction hash: ${result.txHash}`, 3000, ``);
            } else {
                notifier.error(`Error in transaction`, result.rawLog, 3000, ``);
            }
            console.log(result);
        }catch (err) {
            console.log(err);
            notifier.error(`Error in transaction`, (err as any).message, 3000, ``);
        }
        updateGrants();
    }

    
</script>


<div class="flex flex-row w-full justify-end">
    <div class="p-5">
    {#if $account && $account.length > 0}
            <Tag on:click={disconnect}>Connected: {$account}</Tag>
    {:else}
        <Button on:click={connect}>Connect</Button>
    {/if}
    </div>
</div>

<div class="flex flex-row flex-wrap">
<div class="max-w-2xl mt-5 mr-10 flex-1 shadow-2xl p-10">
    <div class="flex flex-row mb-5">
        <TextInput bind:value={toAddress} labelText="Enter address" placeholder="Enter address to assign permissions to" /> 
        <div class="ml-5">
        </div>  
        <TextInput style="width: 90px;" bind:value={days} labelText="Expires in days" placeholder="Expires in days" /> 
    </div>
    
    <div class="mt-10 mb-10" style="height: 450px; overflow: auto;">
        {#each values as value}
          <Checkbox class="mt-3" bind:group={selectedGrant} labelText={value} {value} />
        {/each}
        <Checkbox class="mt-3" bind:checked={shouldSendAmount} labelText="Send inj for gas fees" />
    </div>
    
    <TextInput bind:value={sendAmount} labelText="Enter amount to send" placeholder="Enter amount for gas fees" /> 
    
    <div class="flex flex-row w-full justify-end mt-10">
        <Button kind="primary" on:click={approveGrants}>Approve Grants</Button>
    </div>
    <div class="flex flex-row w-full justify-end mt-10">
        <Button kind="danger" on:click={optOut}>Opt Out Rewards</Button>
    </div>
</div>
<div class="ml-10 mt-10 shadow-2xl p-10 flex flex-col justify-between" style="width: 1124px">
    <h5 class="font-bold">EXISTING GRANTS</h5>
    <div style="height: 514px; overflow: auto;">
        {#each $grants as grant}
        <div class="flex flex-col justify-between p-2 ml-5 mr-5 mt-5 shadow-lg wrapper">
           <Grant {grant} on:remove={removeGrant}></Grant>
        </div>
        {/each}
        {#if $grants.length == 0}
            <div class="flex flex-col items-center justify-around p-2 ml-5 mr-5 mt-5" style="height:500px;">
                <h6>No grants found</h6>
            </div>
        {/if}
    </div>
    
    <div class="flex flex-row w-full justify-end mt-3">
        <Button kind="danger" on:click={()=> removeGrants($grants)}>Revoke all grants</Button>
    </div>
</div>

</div>