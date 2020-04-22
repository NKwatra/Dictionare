const stateKey = 'Dictionary_stateOn';
const guideKey = 'Dictionary_guideOn';
chrome.storage.local.get([stateKey, guideKey], results => {
    let stateOn = results[stateKey] || true;
    let guideOn = results[guideKey] || true;
    const toggleButton = document.querySelector('.ext_toggle');
    toggleButton.removeAttribute('disabled');
    const text = stateOn ? "TURN OFF" : "TURN ON";
    const className = stateOn ? "ext_on" : "ext_off";
    toggleButton.textContent = text;
    toggleButton.className += " " + className;
})