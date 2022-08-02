/**
 * This file is the entrypoint of browser builds.
 * The code executes when loaded in a browser.
 */
import 'whatwg-fetch' // Automatically polyfill Fetch API.
import main from './main'

main()
