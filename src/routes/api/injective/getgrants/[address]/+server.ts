import fetch from 'node-fetch';

/** @type {import('./$types').RequestHandler} */
export async function GET({ request, params }) {
    let url =  `https://k8s.global.mainnet.lcd.injective.network/cosmos/authz/v1beta1/grants/granter/${params.address}`;
    let resp = await fetch(url);
    let data = await resp.json();
    return new Response(JSON.stringify(data));
}