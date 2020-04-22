const stateKey = 'Dictionare_stateOn';
const guideKey = 'Dictionare_guideOn';
const cacheKey = 'Dictionare_cache';

function selectionHandler() {
    const text = getSelectedText();
    if(text)
    {
        createOverlay(330,400,text);
        appendListeners(text);
    }
};


chrome.storage.local.get([stateKey, cacheKey], results => {
    const currentState = results[stateKey] || true;
    const cache = results[cacheKey];
    if(currentState)
    {
        document.addEventListener('mouseup', selectionHandler);
    }
});