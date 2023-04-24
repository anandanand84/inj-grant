import { type Readable, readable } from "svelte/store";
import { get } from "svelte/store";
import { account } from './walletstore';

let updateStore:any = () => {};

export interface AuthorizationObject {
    "@type": string;
    msg: string;
}
  
export interface GrantObject {
    granter: string;
    grantee: string;
    authorization: AuthorizationObject;
    expiration: string;
}

export const grants: Readable<GrantObject[]> = readable([], set => {
    updateStore = set;
    updateGrants();
});

export async function updateGrants() {
    let address = get(account);
    if (!address) return updateStore([]);
    let resp = await fetch(`/api/injective/getgrants/${address}`);
    let data = await resp.json();
    updateStore(data.grants);
}