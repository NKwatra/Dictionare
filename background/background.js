// constants for keys to be used for storing extention state
const stateKey = 'Dictionare_stateOn';
const guideKey = 'Dictionare_guideOn';
const cacheKey = 'Dictionare_cache';

// listen for when extention is installed for first time or is updated 
chrome.runtime.onInstalled.addListener(function() {
    // get the current state of extention from storage
    chrome.storage.local.get([stateKey, guideKey, cacheKey], function(results) {
        const currentState = results[stateKey];
        const currentGuide = results[guideKey];
        const currentCache = results[cacheKey];
        // if above keys don't exists that means extention is installed for first time
        if(!currentState || !currentGuide || !currentCache)
        {
            // set up the key value pairs
            chrome.storage.local.set({
                [stateKey] : true,
                [guideKey] : true,
                [cacheKey] : []
            });
        }else
        {
            console.log(results[stateKey], results[guideKey], results[cacheKey]);
        }
        // else the extention is just updated and we don't need to set the key-value pairs
    });
});