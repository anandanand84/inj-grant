import { writable } from "svelte/store";

export const account = writable("");

export function setAccount(address:string) {
  account.set(address);
}
