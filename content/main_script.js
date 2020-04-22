const stateKey = 'Dictionare_stateOn';
const guideKey = 'Dictionare_guideOn';
const cacheKey = 'Dictionare_cache';

function selectionHandler() {
    const text = getSelectedText();
    if(text)
    {
        alert("Selected text is : " + text);
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