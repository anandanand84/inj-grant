<ul class="toasts">
	{#each toasts as toast (toast.id)}
	<ToastNotification
		lowContrast
		kind="{toast.type}"
		title="{toast.title}"
		on:click="{()=> {
			if(toast.link)
				window.open(toast.link, "blank")
		}}"
		subtitle="{toast.msg}"
		caption={new Date().toLocaleString()}
	/>
	<div 
        class:progress="{toast.autoClose}" 
        style="animation-duration: {toast.timeout}ms;"
        on:animationend={() => { if(toast.autoClose) removeToast(toast.id) } }>
	</div>
	{/each}
</ul>

<style>

	:global(.icon) {
		cursor: pointer;
	}


	:global(.toasts) {
		list-style: none;
		position: fixed;
		top: 50px;
		right: 0;
		padding: 0;
		margin: 0;
		z-index: var(--toast-z-index, 9999);
	}
	
	:global(.toasts) > .toast {
		position: relative;
		margin: 10px;
		/* min-width: 375px;
		max-width: 40vw; */
		width: 40vw;
		position: relative;
		animation: animate-in 350ms forwards;
		color: #fff;
	}
	
	:global(.toasts) > .toast > .content {
		padding: 10px;
		font-weight: 500;
	}
	
	:global(.toasts) > .toast > .progress {
		position: absolute;
		bottom: 0;
		background-color: rgb(0, 0, 0, 0.3);
		height: 6px;
    width: 100%;
	  animation-name: shrink;
	  animation-timing-function: linear;
	  animation-fill-mode: forwards;
	}
	
	:global(.toasts) > .toast:before,
	:global(.toasts) > .toast:after {
			content:"";
			position:absolute;
			z-index:-1;
			top:50%;
			bottom:0;
			left:10px;
			right:10px;
			border-radius:100px / 10px;
	}
	
	:global(.toasts) > .toast:after {
			right:10px;
			left:auto;
			transform:skew(8deg) rotate(3deg);
	}
	
	@keyframes animate-in { 
		0% { 
			width: 0; 
			opacity: 0; 
			transform: scale(1.15) translateY(20px);
		}
		100% { 
			width: 40vw;
			opacity: 1; 
			transform: scale(1) translateY(0);
		}
	}
	
	@keyframes shrink { 
		0% { 
			width: 40vw; 
		}
		100% { 
			width: 0; 
		}
	}
	
</style>

<script lang="ts" context="module">
	export interface Toast {
		id?: number,
		title: string,
		msg: string,
		timeout: number,
		autoClose?: boolean,
		link: string,
		type: 'success' | 'error' | 'warning' | 'info'
	};
</script>

<script lang="ts">
  import { notification } from './store.js'
  import { onMount, onDestroy } from 'svelte'
  import { ToastNotification } from 'carbon-components-svelte';
  



  	export let timeout = 3000;

	let count = 0
	let toasts:Toast[] = [ ]
  	let unsubscribe

	function animateOut(node:HTMLElement, { delay = 0, duration = 300 }) {
		function vhTOpx (value:any) {
			var w = window,
				d = document,
				e = d.documentElement,
				g = d.getElementsByTagName('body')[0],
				x = w.innerWidth || e.clientWidth || g.clientWidth,
				y = w.innerHeight|| e.clientHeight|| g.clientHeight;

			return (y*value)/100;
		}
		
		return {
			delay,
			duration,
			css: (t:any) => `opacity: ${(t-.5) * 1}; transform-origin: top right; transform: scaleX(${(t-.5)*1});`
		}
	}

	function createToast (toast:Toast) {
		
		toasts = [{
			id: count,
			autoClose: toast.timeout > 0, 
			...toast,
			timeout: toast.timeout || -1
		}, ...toasts];
		count = count + 1
  }
  
  unsubscribe = notification.subscribe((value:Toast) => {
    if (!value) { return }
    createToast(value)
    notification.set(null)
  })
  
  onDestroy(unsubscribe)
	
  function removeToast (id:number) { 
	toasts = toasts.filter(t => t.id != id)
  }
</script>