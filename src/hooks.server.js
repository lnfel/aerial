import { SvelteGoogleAuthHook } from 'svelte-google-auth/server'
import client_secret from '../client_secret.json'
import { createHandler } from 'svelte-kit-bot-block'
import { sequence } from '@sveltejs/kit/hooks'
// import { cleanStorage, cleanLogs, cleanCronLogs } from '$lib/aerial/server/cron.js'

/**
 * On dev, code on top level in hooks gets triggered only on first request
 * In production it gets triggered on app startup
 * https://github.com/sveltejs/kit/issues/927
 * 
 * Probably not the best idea, somehow this increases CPU usage of the server and eventually leads to crash
 */
// cleanLogs.start()
// cleanStorage.start()
// cleanCronLogs.start()

/**
 * Create a client_secret A.K.A. OAuth web client ID
 * https://support.google.com/workspacemigrate/answer/9222992?hl=en
 * After creating one, download the json file of the client_secret
 */

const auth = new SvelteGoogleAuthHook(client_secret.web)

/**
 * Handle bot requests
 * 
 * @type {import('@sveltejs/kit').Handle}
 */
const svelteHandleBotBlock = createHandler({
    log: false,
    block: true
})

/**
 * Handle OAuth
 * 
 * @type {import('@sveltejs/kit').Handle}
 */
async function svelteHandleAuth({ event, resolve }) {
    return await auth.handleAuth({ event, resolve })
}

export const handle = sequence(svelteHandleBotBlock, svelteHandleAuth)
