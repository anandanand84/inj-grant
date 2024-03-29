<script lang="ts">
    import NotificationLayout from 'components/notifications/NotificationLayout.svelte';
	import '../app.css';
	import "carbon-components-svelte/css/all.css";
	import { Theme } from 'carbon-components-svelte';
	import type { CarbonTheme } from 'carbon-components-svelte/types/Theme/Theme.svelte';
    let theme:CarbonTheme = "g90";
    import Injective from './Injective/Injective.svelte';
	// import Dydx from './Dydx/Dydx.svelte';
</script>
<NotificationLayout/>
<Theme bind:theme persist persistKey="__carbon-theme" />
<Injective></Injective>
<!-- <Dydx></Dydx> -->