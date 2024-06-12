import { type Handle } from "@sveltejs/kit";

const handleApiProxy: Handle = async ({ event }) => {
  // strip `/api-proxy` from the request path
  let newurl = event.request.url.replace(/(https?:\/\/[^\/]+)\/cosmos/, 'https://sentry.lcd.injective.network/cosmos');
    console.log("new url", newurl);
    let request = new Request(
        newurl,
        event.request
    );

  const proxiedUrl = new URL(newurl);

  // Strip off header added by SvelteKit yet forbidden by underlying HTTP request
  // library `undici`.
  // https://github.com/nodejs/undici/issues/1470
  event.request.headers.delete("connection");

  return fetch(proxiedUrl.toString(), {
    // propagate the request method and body
    body: event.request.body,
    method: event.request.method,
    headers: event.request.headers,
  }).catch((err) => {
    console.log("Could not proxy API request: ", err);
    throw err;
  });
};

export const handle: Handle = async ({ event, resolve }) => {
  // intercept requests to `/api-proxy` and handle them with `handleApiProxy`
  if (event.url.pathname.includes('/cosmos/')) {
    return await handleApiProxy({ event, resolve });
  }

  return await resolve(event);
};