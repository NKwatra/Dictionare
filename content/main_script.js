// function to handle text selection logic
function selectionHandler() {
    // get the text and the co-ordinates of the selected area 
    let {text,x,y} = getSelectionInfo();
    
    // ensure that placing overlay at this position would not make it go off the screen
    let coordinates = ensureOnScreenOverlay(x,y);
    x = coordinates.x;
    y = coordinates.y;

    // if text is not empty, so text has been selected
    if(text)
    {
        // if some previous overlay is visible, remove it
        if(overlayVisible)
        {
            overlayVisible = false;
            simulateClick(document.getElementById('dictionare_cross'));
        }

        // create overlay to show word and it's meaning
        createOverlay(x,y,text);
        overlayVisible = true;
        // fetch information for the current word
        loadWordInfo(text).then(data => {
            let info = extractData(data);
            updateOverlay(info["def"]);
            makeRightActive(info["syn"], info["ant"]);
        });

        // add listener to overlay to close, speak word and to expand details
        // of the word.
        appendListeners(text);
    }
};

// get the current state of extention, 
chrome.storage.local.get([stateKey], results => {
    const currentState = results[stateKey];
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

// listen for messages from pop up to show guide
chrome.runtime.onConnect.addListener(function(port){
    // check if msg is from correct extension
    if(port.name === 'Dictionare')
    {
        // add event listener to listen for messages
        port.onMessage.addListener(function(msg){
            // display user guide if asked to
            if(msg["showGuide"] && !guideVisible)
            {
                displayUserGuide();
            }
        })
    }
})
