const stateKey = 'Dictionare_stateOn';
const guideKey = 'Dictionare_guideOn';
const cacheKey = 'Dictionare_cache';

function selectionHandler() {
    let {text,x,y} = getSelectedText();
    x = Math.round(x);
    y = Math.round(y);
    if(text)
    {
        createOverlay(x,y,text);
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