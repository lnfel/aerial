import * as path from "path"
import { fileURLToPath } from "url"
import tar from "tar"
import chalk from 'chalk'
import { readFile, writeFile, mkdir, open, rm } from 'node:fs/promises'
import { platform } from "os"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const defaultBuildBinPath = process.env.BUILD_ENVIRONMENT === 'production'
    ? path.join(__dirname, '../build/server/bin')
    : path.join(__dirname, '../src/lib/bin')

/**
 * Copy package.json to package output directory
 * 
 * https://github.com/sveltejs/kit/pull/8922
 */
async function copyPackageJSON() {
    console.log(chalk.yellow('Copying package.json'))

    // read file into JSON
    const pkg = JSON.parse(await readFile('package.json', 'utf-8'))
    const pkgLock = JSON.parse(await readFile('package-lock.json', 'utf-8'))

    // adjust pkg json however you like ..

    // write it to your output directory
    await writeFile('./build/package.json', JSON.stringify(pkg, null, 4))
    await writeFile('./build/package-lock.json', JSON.stringify(pkgLock, null, 4))

    console.log(`📁 ${chalk.green('package.json')} copied to build folder.`)
}

/**
 * Create storage/tmp folder for build directory
 */
async function initStorage() {
    console.log(chalk.yellow('Setting up storage'))

    await mkdir('./build/storage/tmp', { recursive: true })

    console.log(`📁 ${chalk.green('./build/storage/tmp')} folder created.`)
}

/**
 * Create binary dependency object
 * 
 * @param {String} name Name of the binary
 * @param {String} url Download url or binary tar file
 * @param {String} binPath custom bin path
 * @returns {Object} Binary dependency object
 */
const addBinaryDependency = async (name, url, binPath = defaultBuildBinPath) => {
    const extension = platform() === 'win32' ? '.exe' : ''
    /**
     * @namespace {Object} binary
     * @property {String} binary.name The binary name
     * @property {String} binary.url Url where to fetch the binary compressed tar, like a github release download link
     * @property {String} binary.binPath The bin directory
     * @property {String} binary.executablePath Path where the binary will be extracted to
     * @property {String} binary.installDirectory Path where to save the tar file, usually the same path where we also extract the binary
     */
    const binary = {
        name,
        url,
        binPath,
        executablePath: `${path.join(binPath, name)}${extension}`,
        installDirectory: path.join(binPath, getUrlLastPath(url))
    }

    return binary
}

/**
 * Extract last pathname from url
 * 
 * @param {String} url URL string
 * @returns {String} Last pathname of url
 */
const getUrlLastPath = (url) => {
    return new URL(url).pathname.split('/').at(-1)
}

/**
 * Download appropriate binary build depending on current platform
 */
const kmeansBinaryMap = {
    darwin: await addBinaryDependency("kmeans_colors", "https://github.com/okaneco/kmeans-colors/releases/download/0.5.0/kmeans_colors-0.5.0-macos-x86_64.tar.gz"),
    linux: await addBinaryDependency("kmeans_colors", "https://github.com/okaneco/kmeans-colors/releases/download/0.5.0/kmeans_colors-0.5.0-linux-x86_64.tar.gz"),
    win32: await addBinaryDependency("kmeans_colors", "https://github.com/okaneco/kmeans-colors/releases/download/0.5.0/kmeans_colors-0.5.0-windows-x86_64.tar.gz")
}

/**
 * To add new binary dependency use the addBinaryDependency helper
 * 
 * @returns {Promise<Array>} Promise<array>
 */
const binaries = async () => {
    console.log(kmeansBinaryMap[platform()])
    return [
        kmeansBinaryMap[platform()],
        // process.env.BUILD_ENVIRONMENT === 'production'
        //     ? await addBinaryDependency("kmeans_colors", "https://github.com/okaneco/kmeans-colors/releases/download/0.5.0/kmeans_colors-0.5.0-linux-x86_64.tar.gz")
        //     : await addBinaryDependency("kmeans_colors", "https://github.com/okaneco/kmeans-colors/releases/download/0.5.0/kmeans_colors-0.5.0-macos-x86_64.tar.gz")
        //     ,
    ]
}

/**
 * Download executable dependencies and extract to /build/server/bin on production or /src/lib/bin folder when on development
 * 
 * @param {Array} binaries 
 * @returns {Promise<void>} Promise<void>
 */
async function install(binaries) {
    console.log(chalk.yellow('Installing binaries.'))

    binaries.forEach(async (binary) => {
        console.log(`${chalk.yellow('Fetching from')} ${binary.url}`)
        const response = await fetch(binary.url)
        const file = await response.blob()
        const buffer = Buffer.from(await file.arrayBuffer())
        // /build/server/bin
        await mkdir(defaultBuildBinPath, { recursive: true })
        await writeFile(binary.installDirectory, buffer, { flag: 'w+' })

        // /src/lib/bin
        // await writeFile(binary.installDevelopmentDirectory, buffer, { flag: 'w+' })

        const filehandle = await open(binary.installDirectory)
        filehandle.createReadStream()
            .pipe(tar.x({
                C: binary.binPath
            }))
            .on('finish', async () => {
                await rm(binary.installDirectory)
                console.log(`📦 ${chalk.green(binary.name)} binary extracted.`)
            })
    })
}

(async () => {
    Promise.all([copyPackageJSON(), initStorage(), install(await binaries())])
        .catch((error) => {
            console.log(error)
        })
})()
