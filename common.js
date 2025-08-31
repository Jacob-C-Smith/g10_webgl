/**
 * Common utility functions.
 *
 * @file common.js
 * 
 * @author Jacob Smith
 */

/**
 * Fetches text data from a given URL.
 *
 * @async
 * @param {string} url The URL to fetch the text from.
 * @returns {Promise<string>} A promise that resolves with the text content of the response.
 * @throws {Error} If the response status is not ok.
 */
async function fetchText(url)
{

    // initialized data
    const response = await fetch(url);
    
    // error check
    if (!response.ok) {
        throw new Error(`Failed to load: ${url}`);
    }

    // success
    return await response.text();
}

/**
 * Fetches JSON data from a given URL.
 *
 * @async
 * @param {string} url The URL to fetch the JSON data from.
 * @returns {Promise<any>} A promise that resolves with the JSON data.
 * @throws {Error} If the response status is not ok.
 */
async function fetchJson(url)
{

    // initialized data
    const response = await fetch(url);
    
    // error check
    if (!response.ok) {
        throw new Error(`Failed to load: ${url}`);
    }

    // success
    return await response.json();
}
