// constants for keys used in storage
const stateKey = 'Dictionare_stateOn';
const guideKey = 'Dictionare_guideOn';
const cacheKey = 'Dictionare_cache';

// function to handle text selection logic
function selectionHandler() {
    // get the text and the co-ordinates of the selected area 
    let {text,x,y} = getSelectedText();
    x = Math.round(x);
    y = Math.round(y);

    // if text is not empty, so text has been selected
    if(text)
    {
        // create overlay to show word and it's meaning
        createOverlay(x,y,text);
        // add listener to overlay to close, speak word and to expand details
        // of the word.
        appendListeners(text);
    }
};

// get the current state of extention, 
chrome.storage.local.get([stateKey, cacheKey], results => {
    const currentState = results[stateKey] || true;
    const cache = results[cacheKey];
    // if extention is enables
    if(currentState)
    {
        // add listener for text selection
        document.addEventListener('mouseup', selectionHandler);
    }
});

// add change lister for storage items
chrome.storage.onChanged.addListener(function(changes) {
    // if the state of extention has changes
    if(changes.hasOwnProperty(stateKey))
    {
        // get new state
        const newValue = changes[stateKey].newValue;
        // extention off
        if(!newValue)
        {
            // remove selection listener
            document.removeEventListener('mouseup', selectionHandler);
        }else{
            // extention on, add selection listener
            document.addEventListener('mouseup', selectionHandler);
        }
    }
});
