<script>
    import { page } from "$app/stores"
    
    import Logo from "$lib/component/Logo.svelte"
    import GoogleClient from "$lib/component/GoogleClient.svelte"
    import { slide } from "svelte/transition"
    import { quintOut } from "svelte/easing"
    import { browser } from "$app/environment"
    import { pageTransitionsEnabled } from "$lib/aerial/stores/index.js"

    let preferencesToggle = false

    if (browser) {
        document.addEventListener('click', closePreferencesDropdown)
        pageTransitionsEnabled.set(localStorage.getItem("aerial:preferences:pageTransitionsEnabled"))
    }

    function togglePreferencesDropdown() {
        preferencesToggle = !preferencesToggle
    }

    function closePreferencesDropdown() {
        preferencesToggle = false
    }

    /**
     * @param {KeyboardEvent} event
     */
    function menuKeyboardListener(event) {
        if (event.code === 'Escape') {
            closePreferencesDropdown()
        }
    }

    /**
     * @param {Event & { target: HTMLInputElement }} event
     */
    function togglePageTransitions({ target }) {
        if (target.checked) {
            localStorage.setItem("aerial:preferences:pageTransitionsEnabled", true)
        } else {
            localStorage.removeItem("aerial:preferences:pageTransitionsEnabled")
        }
        pageTransitionsEnabled.set(localStorage.getItem("aerial:preferences:pageTransitionsEnabled"))
    }
</script>

<header class="flex items-center justify-between lg:px-[3rem]">
    <Logo />
    <div class="flex items-center gap-2">
        <a href="/" class="text-slate-700 dark:text-indigo-200 rounded-md border-2 border-indigo-300 px-1.5 py-1 outline-none hover:border-indigo-500 focus:border-indigo-500 focus:text-indigo-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            <span class="sr-only">Home</span>
        </a>
        <a href="/queue" class="text-slate-700 dark:text-indigo-200 rounded-md border-2 border-indigo-300 px-1.5 py-1 outline-none hover:border-indigo-500 focus:border-indigo-500 focus:text-indigo-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
            </svg>
            <span class="sr-only">Queue</span>
        </a>
        <GoogleClient data={$page.data} />

        <!-- Preferences -->
        <div class="dropdown-menu relative">
            <button on:click|stopPropagation={togglePreferencesDropdown} on:keydown={menuKeyboardListener} type="button" class="dropdown-toggle text-slate-700 dark:text-indigo-200 rounded-md border-2 border-indigo-300 px-1.5 py-1 outline-none hover:border-indigo-500 focus:border-indigo-500 focus:text-indigo-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span class="sr-only">Preferences</span>
            </button>

            {#if preferencesToggle}
                <div on:click|stopPropagation={()=>{}} on:keydown={menuKeyboardListener} transition:slide|global="{{delay: 250, duration: 300, easing: quintOut, axis: 'y'}}" class="dropdown-list absolute top-full right-0 flex flex-col gap-2 bg-indigo-200 rounded whitespace-nowrap p-4 mt-2" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
                    <span class="text-lg font-bold font-sculpin tracking-wide text-indigo-600">Preferences</span>

                    <label class="relative flex items-center cursor-pointer">
                        <input type="checkbox" bind:checked={$pageTransitionsEnabled} on:change={togglePageTransitions} value="" class="sr-only peer">
                        <div class="w-11 h-6 bg-indigo-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-400 dark:peer-focus:ring-indigo-300 rounded-full peer dark:bg-gray-400 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                        <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-800">Page transitions</span>
                    </label>
                </div>
            {/if}
        </div>
    </div>
</header>
