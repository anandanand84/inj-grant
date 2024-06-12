import fetch from 'node-fetch';

/** @type {import('./$types').RequestHandler} */
export async function GET({ request, params }) {
    let url =  `https://sandbox.trade.dvchain.co/cosmos/authz/v1beta1/grants/granter/${params.address}`;
    let resp = await fetch(url);
    let data = await resp.json();
    return new Response(JSON.stringify(data));
}