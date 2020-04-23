// constants for keys to be used for storeing extention state
const stateKey = 'Dictionare_stateOn';
const guideKey = 'Dictionare_guideOn';

// load off extention state from storage
chrome.storage.local.get([stateKey, guideKey], results => {
    // create variable to store extention state
    let stateOn = results[stateKey];
    let guideOn = results[guideKey];
    // get reference to toggle button 
    const toggleButton = document.querySelector('.ext_toggle');
    // make button active and change color of button depending 
    // on whether extention is on or off
    toggleButton.removeAttribute('disabled');
    const text = stateOn ? "TURN OFF" : "TURN ON";
    const className = stateOn ? " ext_on" : " ext_off";
    toggleButton.textContent = text;
    toggleButton.className += className;
    // update badge color and text
    chrome.browserAction.setBadgeText({text : "ON"});
    chrome.browserAction.setBadgeBackgroundColor({color : "#28a745"})

    // add click listener to the toggle button
    toggleButton.addEventListener('click', function() {
        // if extention is currently running 
        if(stateOn)
        {
            // turn the toggle button red and change text to TURN ON
            const classNames = toggleButton.className.split(" ");
            toggleButton.className = classNames[0] + " ext_off";
            toggleButton.textContent = "TURN ON";
            // update badge on the extention to OFF, which is visible next to searchbar
            chrome.browserAction.setBadgeText({text : "OFF"});
            chrome.browserAction.setBadgeBackgroundColor({color : "#dc3545"})
            // update the state of extention in storage to inactive
            stateOn = false;
            chrome.storage.local.set({[stateKey] : stateOn});
        }else
        {
            // turn the toggle button green and change text to TURN OFF
            const classNames = toggleButton.className.split(" ");
            toggleButton.className = classNames[0] + " ext_on";
            toggleButton.textContent = "TURN OFF";
            // update badge
            chrome.browserAction.setBadgeText({text : "ON"});
            chrome.browserAction.setBadgeBackgroundColor({color : "#28a745"})
            // update the state of extention in storage to active
            stateOn = true;
            chrome.storage.local.set({[stateKey] : stateOn});
        }
    });
});