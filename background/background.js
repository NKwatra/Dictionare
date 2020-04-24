// constants for keys to be used for storing extention state
const stateKey = 'Dictionare_stateOn';
const guideKey = 'Dictionare_guideOn';
const cacheKey = 'Dictionare_cache';

// constants for command names
const commandOn = 'turn_extension_on';
const commandOff = 'turn_extension_off';

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
        }
        // else the extention is just updated and we don't need to set the key-value pairs
    });

    // set the badge to display that extention is on
    chrome.browserAction.setBadgeText({text : "ON"});
    chrome.browserAction.setBadgeBackgroundColor({color : "#28a745"});
});

// fired when a new window is created in chrome
chrome.windows.onCreated.addListener(function() {
    // get the current state of extention and update batch to show extention state
    chrome.storage.local.get([stateKey], result => {
        const state = result[stateKey];
        const text = state ? "ON" : "OFF";
        const bgColor = state ? "#28a745" : "#dc3545";
        chrome.browserAction.setBadgeText({text});
        chrome.browserAction.setBadgeBackgroundColor({color : bgColor});
    });
}, {windowTypes : ['normal']});

/* listen for commands (shortcut keys) from the user */
chrome.commands.onCommand.addListener(function(command) {
    // turn on extension
    if(command === commandOn)
    {
        chrome.storage.local.set({[stateKey] : true});
        chrome.browserAction.setBadgeText({text : "ON" });
        chrome.browserAction.setBadgeBackgroundColor({color : "#28a745" });
    }
    // turn off extension
    else if(command == commandOff){
        chrome.storage.local.set({[stateKey] : false});
        chrome.browserAction.setBadgeText({text : "OFF" });
        chrome.browserAction.setBadgeBackgroundColor({color : "#dc3545" });
    }
});