import { hydrateAuth } from 'svelte-google-auth/server'
import { getOAuth2Client, isSignedIn } from 'svelte-google-auth'
import { listDriveFiles, listStorageQuota, listAerialFolderDetails } from '$lib/aerial/server/google/drive.js'

/**
 * @type {import('@sveltejs/kit').ServerLoad}
 */
export const load = async ({ locals, url }) => {
    let driveFiles, storageQuota, aerialFolder
    if (isSignedIn(locals)) {
        const client = getOAuth2Client(locals)
        driveFiles = await listDriveFiles(client)
        storageQuota = await listStorageQuota(client)
        aerialFolder = await listAerialFolderDetails(client)
    }

    return {
        // By calling hydateAuth, certain variables from locals are parsed to the client
        // allowing the client to access the user information and the client_id for login
        ...hydrateAuth(locals),
        driveFiles,
        storageQuota,
        aerialFolder,
        // We must know the pathname change beforehand for the page transition to be accurate
        url: url.pathname
    }
}
