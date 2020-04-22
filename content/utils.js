function getSelectedText(){
    let text = '';
    if(typeof window.getSelection != "undefined")
    {
        text = window.getSelection().toString();
    }else if(typeof document.selection != "undefined" && document.selection.type == "Text")
    {
        text = document.selection.createRange().text;
    }
    if(text != '')
    {
        text = (text.split(" ")[0]).trim();
    }
    return text;
}

function createOverlay(posx, posy, word)
{
    const container = document.createElement('div');
    container.className = "dictionare_container";
    container.id = "dictionare_overlay"
    container.innerHTML = `<div class="dictionare_cross_container ">
    <svg class="dictionare_pointer" id="dictionare_cross" width="1em" height="1em" viewBox="0 0 16 16" fill="#0000000" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M11.854 4.146a.5.5 0 010 .708l-7 7a.5.5 0 01-.708-.708l7-7a.5.5 0 01.708 0z" clip-rule="evenodd"/>
        <path fill-rule="evenodd" d="M4.146 4.146a.5.5 0 000 .708l7 7a.5.5 0 00.708-.708l-7-7a.5.5 0 00-.708 0z" clip-rule="evenodd"/>
      </svg>
</div>
<div class="dictionare_row">
    <div class="dictionare_word_container"><strong>${word}</strong></div>
    <div class="dictionare_speaker_container">
    <svg class="dictionare_pointer" id="dictionare_speaker" crosswidth="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.536 14.01A8.473 8.473 0 0014.026 8a8.473 8.473 0 00-2.49-6.01l-.708.707A7.476 7.476 0 0113.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/>
    <path d="M10.121 12.596A6.48 6.48 0 0012.025 8a6.48 6.48 0 00-1.904-4.596l-.707.707A5.483 5.483 0 0111.025 8a5.483 5.483 0 01-1.61 3.89l.706.706z"/>
    <path d="M8.707 11.182A4.486 4.486 0 0010.025 8a4.486 4.486 0 00-1.318-3.182L8 5.525A3.489 3.489 0 019.025 8 3.49 3.49 0 018 10.475l.707.707z"/>
    <path fill-rule="evenodd" d="M6.717 3.55A.5.5 0 017 4v8a.5.5 0 01-.812.39L3.825 10.5H1.5A.5.5 0 011 10V6a.5.5 0 01.5-.5h2.325l2.363-1.89a.5.5 0 01.529-.06z" clip-rule="evenodd"/>
  </svg>
    </div>
</div>
<div class="dictionare_row">
    <div class="dictionare_word_info_container">
        Lorem ipsum sit amid donor and some other random text.
    </div>
    <div class="dictionare_right_container">
        <svg class="dictionare_pointer" id="dictionare_right" width="1em" height="1em" viewBox="0 0 16 16" fill="#aaa9ad" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M3.646 1.646a.5.5 0 01.708 0l6 6a.5.5 0 010 .708l-6 6a.5.5 0 01-.708-.708L9.293 8 3.646 2.354a.5.5 0 010-.708z" clip-rule="evenodd"/>
            <path fill-rule="evenodd" d="M7.646 1.646a.5.5 0 01.708 0l6 6a.5.5 0 010 .708l-6 6a.5.5 0 01-.708-.708L13.293 8 7.646 2.354a.5.5 0 010-.708z" clip-rule="evenodd"/>
          </svg>
    </div>
</div>`;
    container.style.top = posy + "px";
    container.style.left = posx + "px";
    document.body.prepend(container);
}

function appendListeners(word){
    const speaker = document.getElementById('dictionare_speaker');
    const cross   = document.getElementById('dictionare_cross');
    const right   = document.getElementById('dictionare_right');
    const speakerClickHandler = () => {pronounceWord(word)};
    const rightClickHandler = () => {}
    const crossClickHandler = () => {
        speaker.removeEventListener('click', speakerClickHandler);
        cross.removeEventListener('click', crossClickHandler);
        right.removeEventListener('click', rightClickHandler);
        document.body.removeChild(document.getElementById('dictionare_overlay'));
    };
    speaker.addEventListener('click',speakerClickHandler); 
    cross.addEventListener('click', crossClickHandler);
}