/** @type {import('@sveltejs/kit').HandleFetch} */
export async function handleFetch({ request, fetch }) {
    console.log("Handling fetch");
    console.log(request);
	if (request.url.includes('/cosmos/')) {
        // clone the original request, but change the URL
        console.log(request.url);
        let newurl = request.url.replace(/(https?:\/\/[^\/]+)\/cosmos/, 'https://sentry.lcd.injective.network/cosmos');
        console.log(newurl);
        request = new Request(
            newurl,
            request
        );
    }
    
    request.url

	return fetch(request);
}

export async function handle({ event, resolve }) {
    console.log("Hello");
    if (event.url.pathname === '/ping') {
        return new Response('pong');
	}
    if (event.url.pathname.includes('/cosmos/')) {
        console.log("Hello 1");
        let newurl = event.request.url.replace(/(https?:\/\/[^\/]+)\/cosmos/, 'https://sentry.lcd.injective.network/cosmos');
        console.log("new url", newurl);
        let request = new Request(
            newurl,
            event.request
        );
        try {
            let result = await fetch(request);
            console.log(result);
            return resolve(await result.json());
        } catch(err) {
            console.error(err);
        }
    }
	return await resolve(event);
}