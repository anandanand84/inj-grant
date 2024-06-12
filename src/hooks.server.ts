import type { Handle } from "@sveltejs/kit";
import { Agent } from 'undici';
import { constants } from 'crypto'

let agent = new Agent({
    connect: {
      rejectUnauthorized: false,
      secureOptions: constants.SSL_OP_LEGACY_SERVER_CONNECT
    }
  })
const handleApiProxy: Handle = async ({ event, resolve }) => {
  // strip `/api-proxy` from the request path
    let newurl = event.request.url.replace(/(https?:\/\/[^\/]+)\/cosmos/, 'https://sentry.lcd.injective.network/cosmos');
    console.log("new url", newurl);
    // Strip off header added by SvelteKit yet forbidden by underlying HTTP request
    // library `undici`.
    // https://github.com/nodejs/undici/issues/1470
    event.request.headers.delete("connection");
    event.request.headers.delete("host");
    event.request.headers.delete("referer");
    
    let request = new Request(
        newurl,
        event.request
    );
    let result = event.fetch(request, {
    // propagate the request method and body
    body: event.request.body,
    method: event.request.method,
    headers: event.request.headers,
    
  }).catch((err) => {
    console.log("Could not proxy API request: ", err);
    throw err;
  });

  return result;
};

export const handle: Handle = async ({ event, resolve }) => {
  // intercept requests to `/api-proxy` and handle them with `handleApiProxy`
  if (event.url.pathname.includes('/cosmos/')) {
    return await handleApiProxy({ event, resolve });
  }

  return await resolve(event);
};