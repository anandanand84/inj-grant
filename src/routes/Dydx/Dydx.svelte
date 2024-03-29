<script lang="ts">
	import { Checkbox, Button, Tag, TextInput } from 'carbon-components-svelte';
	import MessageTypes from './messagetypes';
	import { notifier } from 'components/notifications';
	import { SigningStargateClient } from '@cosmjs/stargate';
	import { MsgGrant } from "cosmjs-types/cosmos/authz/v1beta1/tx";
	import { GenericAuthorization } from 'cosmjs-types/cosmos/authz/v1beta1/authz';
	import { signAndSend } from './stargate';
	import { Long } from 'cosmjs-types/helpers';

	let chain_id = 'dydx-mainnet-1';
	let injGranter = 'inj10rml8mrs56mead9aqkypmud5n507qanajk876x';
	let injGrantee = 'inj1hxe7yg289u6v46h2ttdyc5ptr4nc0rp8u9u083';
	let osmoGrantee = 'osmo14fw7mzzquffn4fve95r6h42x042srtc0h4megr';
	let osmoGranter = 'osmo1hmn2t2jud93eugk7s8kan23jl3nfetnj4r6afp';
	let msgType = '/cosmos.bank.v1beta1.MsgSend';

	
	async function initKepler() {
		if (typeof window === 'undefined') return;

		if (window.keplr == null) {
			alert('Go install Keplr >:(');
		} else {
			try {
				// If this fails, user is not logged in to Keplr
				await window.keplr.enable(chain_id);

				const offlineSigner =
					window.getOfflineSigner != null ? window.getOfflineSigner(chain_id) : null;
				if (offlineSigner == null) return 'error';

				const accounts = await offlineSigner.getAccounts();

				console.log(accounts);

				return {
					account: accounts[0],
					signer: offlineSigner
				};
			} catch (err) {
				console.log(err);
			}
		}
		return { address: '', signer: null };
	}

	let validatorClient;

	let post;

	let account;

	let wallet;

	let toAddress = 'dydx14fw7mzzquffn4fve95r6h42x042srtc0khxd7x';

	let signer;

	let days = 30;

	let values = MessageTypes;

	let selectedGrant: any[] = values.filter((a) => true);

	async function connect() {
		let kepler: any = await initKepler();
		account = kepler.account;
		signer = kepler.signer;
	}

	function disconnect() {
		account.set('');
		wallet.set(null);
	}

	async function approveGrants() {
		let expires = new Date();
		expires.setDate(new Date().getDate() + parseInt(days.toString()));

		let data = {
			grantee: toAddress,
			granter: account.address as string,
			grant: {
				authorization: {
					msg: msgType
				},
				expiration: new Date()
			}
		};
		let msg = MsgGrant.fromPartial({
			grantee: toAddress,
			granter: account.address as string,
			grant: {
				authorization: {
					typeUrl: "/cosmos.authz.v1beta1.GenericAuthorization",
					value: GenericAuthorization.encode({ msg: msgType}).finish()
				},
				expiration: {
					seconds: Long.fromNumber(Date.now() / 1000),
					nanos: 0
				}
			}
		})

		let grantMsg = {
			typeUrl: "/cosmos.authz.v1beta1.Grant",
			value: msg
		}

		// window.grantMsg = grantMsg
		// return value;
		// value.grant.expiration = { value : expires.toISOString()};
		// console.log(value.grant.expiration);
		// value.grant.expiration;
		// let grantMessage = {
		// 	typeUrl: '/cosmos.authz.v1beta1.MsgGrant',
		// 	value: msg.toProto()
		// };
		// let signedTx = await signer.sign(account.address, {
		//     chain_id: "dydx-mainnet-1",
		//     fee: {
		//         amount: [],
		//         gas: "200000"
		//     },
		//     msgs: messages,
		//     memo: "memo",
		//     signatures: null
		// });
		// console.log(signedTx);
		await signAndSend(chain_id, msg);
		// let raw = TxRaw.fromJSON(signedTx);
		// console.log(raw);
		// signer.keplr.sendTx("dydx-mainnet-1", signedTx, 'sync')
		// console.log(messages);
		// await post.send(wallet, async ()=>messages, false, null, "memo", null, async ()=>account);
	}
</script>

<div class="flex flex-row w-full justify-end">
	<div class="p-5">
		{#if account}
			<Tag on:click={disconnect}>Connected: {account.address}</Tag>
		{:else}
			<Button on:click={connect}>Connect</Button>
		{/if}
	</div>
</div>

<div class="flex flex-row flex-wrap">
	<div class="max-w-2xl mt-5 mr-10 flex-1 shadow-2xl p-10">
		<div class="flex flex-row mb-5">
			<TextInput
				bind:value={toAddress}
				labelText="Enter address"
				placeholder="Enter address to assign permissions to"
			/>
			<div class="ml-5" />
			<TextInput
				style="width: 90px;"
				bind:value={days}
				labelText="Expires in days"
				placeholder="Expires in days"
			/>
		</div>

		<div class="mt-10 mb-10" style="height: 450px; overflow: auto;">
			{#each values as value}
				<Checkbox class="mt-3" bind:group={selectedGrant} labelText={value} {value} />
			{/each}
		</div>

		<div class="flex flex-row w-full justify-end mt-10">
			<Button kind="primary" on:click={approveGrants}>Approve Grants</Button>
		</div>
	</div>
	<!-- <div class="ml-10 mt-10 shadow-2xl p-10 flex flex-col justify-between" style="width: 1124px">
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
    </div> -->
</div>
