// constants for keys used in storage
const stateKey = 'Dictionare_stateOn';
const guideKey = 'Dictionare_guideOn';

// global variable to track if overlay is currently displayed
let overlayVisible = false;
let guideVisible = false;

// function to get coordinates and text of selected area
function getSelectionInfo() {
    let doc = window.document;
    let sel = doc.selection, range, rects, rect;
    let x = 0, y = 0, text ='';
    // find x and y coordinates of selection and text of selection
    if (sel) {
        if (sel.type == "Text") {
            range = sel.createRange();
            text = range.text;
            range.collapse(true);
            x = range.boundingLeft;
            y = range.boundingTop;
        }
    } else if (typeof window.getSelection != "undefined") {
        sel = window.getSelection();
        text = sel.toString();
        if (text != '' && sel.rangeCount) {
            range = sel.getRangeAt(0).cloneRange();
            if (range.getClientRects) {
                range.collapse(true);
                rects = range.getClientRects();
                if (rects.length > 0) {
                    rect = rects[0];
                }
                x = rect.left;
                y = rect.top;
            }
            // Fall back to inserting a temporary element
            if (x == 0 && y == 0) {
                var span = doc.createElement("span");
                if (span.getClientRects) {
                    // Ensure span has dimensions and position by
                    // adding a zero-width space character
                    span.appendChild( doc.createTextNode("\u200b") );
                    range.insertNode(span);
                    rect = span.getClientRects()[0];
                    x = rect.left;
                    y = rect.top;
                    var spanParent = span.parentNode;
                    spanParent.removeChild(span);

                    // Glue any broken text nodes back together
                    spanParent.normalize();
                }
            }
        }
    }
    // if use selected multiple words, extract the first word
    if(text != '')
    {
        text = (text.split(/\W/)[0]).trim();
    }

    return { x,y,text };
}


/* 
    @param {posx} : x co-ordinate of overlay
    @param {posy} : y co-ordinate of overlay
    @parma {word} : word which needs to be searched
*/
function createOverlay(posx, posy, word)
{
    // create a container for overlay
    const container = document.createElement('div');
    container.className = "dictionare_container";
    container.id = "dictionare_overlay"
    // set innerhtml to create the complete overlay
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
<div class="dictionare_row" style="padding-left: 25px;">
    <div class="dictionare_word_info_container">
        <div class="dictionare_lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>
    <div class="dictionare_right_container">
        <svg class="dictionare_pointer" id="dictionare_right" width="1em" height="1em" viewBox="0 0 16 16" fill="#aaa9ad" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M3.646 1.646a.5.5 0 01.708 0l6 6a.5.5 0 010 .708l-6 6a.5.5 0 01-.708-.708L9.293 8 3.646 2.354a.5.5 0 010-.708z" clip-rule="evenodd"/>
            <path fill-rule="evenodd" d="M7.646 1.646a.5.5 0 01.708 0l6 6a.5.5 0 010 .708l-6 6a.5.5 0 01-.708-.708L13.293 8 7.646 2.354a.5.5 0 010-.708z" clip-rule="evenodd"/>
          </svg>
    </div>
</div>`;
    // position the overlay and prepend it to body
    container.style.top = posy + "px";
    container.style.left = posx + "px";
    document.body.prepend(container);
}


/* this function is used to simulate click on a DOM element
    @param {element} : DOM element which needs to be clicked
*/
function simulateClick(element)
{
    // fire an on click event on the element
    if(element.fireEvent)
    {
        element.fireEvent("onclick");
    }else
    {
        const newEvent = document.createEvent('Events');
        newEvent.initEvent('click', true, false);
        element.dispatchEvent(newEvent);
    }
}

/*
    reference to function to handle click on right(more details) button
    this has been intentionally made global here because same function reference
    is used in two different functions
*/
let rightClickHandler;


/*
    function to append click listeners to various elements of overlay
    @param {word} : the current word, which is being displayed in overlay
*/
function appendListeners(word){
    // create references to overlay elements
    const speaker = document.getElementById('dictionare_speaker');
    const cross   = document.getElementById('dictionare_cross');
    const right   = document.getElementById('dictionare_right');
    // create click handlers for overlay elements
    const speakerClickHandler = () => {pronounceWord(word)};
    const crossClickHandler = () => {
        // remove all event listeners and overlay from DOM.
        speaker.removeEventListener('click', speakerClickHandler);
        cross.removeEventListener('click', crossClickHandler);
        if(rightClickHandler)
            right.removeEventListener('click', rightClickHandler);
        const detail_cross = document.getElementById('dictionare_detail_cross');
        if(detail_cross)
            simulateClick(detail_cross);
        document.body.removeChild(document.getElementById('dictionare_overlay'));
        overlayVisible = false;
    };
    // attach the event listeners
    speaker.addEventListener('click',speakerClickHandler); 
    cross.addEventListener('click', crossClickHandler);
}

/*
    This function makes the right option active, only after the data has been loaded
*/
function makeRightActive(syns, ants)
{
    const right = document.getElementById("dictionare_right");
    rightClickHandler = () => {addDetailsOverlay(syns, ants)}
    right.addEventListener('click', rightClickHandler);
}

/*
    function to modify(if reqd) x and y co-ordinates of overlay so that
    it does not go offscreen
    @param{x} : current x co-ordinate of overlay
    @param{y} : current y co-ordinate of overlay
    @return {new Coordinates} : updated co-ordinates to ensure no overflow.
 */
function ensureOnScreenOverlay(x,y){
    // get avaiable width and height of screen
    const width = document.documentElement.clientWidth;
    const height = document.documentElement.clientHeight;
    
    // no overflow over the left edge, use 10 for good user experience
    if(x <= 10)
        x = 20;
    
    // no overflow over the top edge
    if(y <= 10)
        y = 20; 
        
    // no overflow over the right edge
    if(x + 350 >= width - 10)
        x = width - 360;
        
    // no overlfow over the bottom edge
    if(y + 200 >= height - 10)
        y = height - 210;
        
    // round coordinates to integer    
    x = Math.round(x);
    y = Math.round(y);  

    return {x,y};
}

/*
    function to get more details overlay's co-ordinates
*/
function getDetailsOverlayCord()
{
    // get position of previous overlay
    const boundingRect = document.getElementById('dictionare_overlay').getBoundingClientRect();
    // try for right placing
    let x = boundingRect.left, y = boundingRect.top;
    // get screen width and height
    const width = document.documentElement.clientWidth;
    const height = document.documentElement.clientHeight;
    // if can be placed on the right
    if(x + 700 < width - 10)
    {
        x = x + 351;
    } // else try to place below
    else if(y + 400 < height - 10)
    {
        y = y + 201;
    } // else try to place on top
    else if(y - 200 > 10)
    {
        y = y - 201;
    } // else place to left
    else
    {
        x = x - 351;
    }
    
    return {x,y};
}

/* function to handle click for close button on the detail overlay */
function closeDetailOverlay()
{
    document.getElementById('dictionare_detail_cross').removeEventListener('click', closeDetailOverlay);
    document.body.removeChild(document.getElementById('dictionare_detail_overlay'));
}

/*
    function to add the more details overlay
*/
function addDetailsOverlay(syns, ants)
{
    const {x,y} = getDetailsOverlayCord();
    const detailsContainer = document.createElement('div');
    detailsContainer.className += 'dictionare_container';
    detailsContainer.id = "dictionare_detail_overlay"
    detailsContainer.innerHTML = `<div class="dictionare_cross_container">
    <svg class="dictionare_pointer" id="dictionare_detail_cross" width="1em" height="1em" viewBox="0 0 16 16" fill="#0000000" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M11.854 4.146a.5.5 0 010 .708l-7 7a.5.5 0 01-.708-.708l7-7a.5.5 0 01.708 0z" clip-rule="evenodd"/>
        <path fill-rule="evenodd" d="M4.146 4.146a.5.5 0 000 .708l7 7a.5.5 0 00.708-.708l-7-7a.5.5 0 00-.708 0z" clip-rule="evenodd"/>
      </svg>
</div>
<div class="dictionare_detail_main">
    <div>
        <div class="dictionare_syn_header">Synonyms :</div>
        <div class="dictionare_syn">${syns}</div>
    </div>
    <div>
        <div class="dictionare_syn_header">Antonyms :</div>
        <div class="dictionare_syn">${ants}</div>
    </div>
</div>`;
    detailsContainer.style.left = x + "px";
    detailsContainer.style.top = y + "px";
    document.body.prepend(detailsContainer);
    document.getElementById('dictionare_detail_cross').addEventListener('click', closeDetailOverlay);
}

/* function to update overlay, remove spinning indicator and show word definition */
function updateOverlay(def){
    document.querySelector('.dictionare_word_info_container').innerHTML = def;
}


/* function to add listeners to user guide elements */
function addGuideListeners() {
    const okayButton = document.getElementById('dictionare_okay');
    const checkBox = document.getElementById('dictionare_guide_check');
    // handle clicks on checkbox
    const checkBoxHandler = () => {
        if(checkBox.checked)
        {
            // don't show use guide next time
            chrome.storage.local.set({[guideKey] : false});
        }else{
            chrome.storage.local.set({[guideKey] : true});
        }
    }
    // handle clicks on okay button
    const okayButtonHandler = () => {
        checkBox.removeEventListener('click', checkBoxHandler);
        okayButton.removeEventListener('click', okayButtonHandler);
        guideVisible = false;
        document.body.removeChild(document.getElementById('dictionare_guide_container'));
    }

    okayButton.addEventListener('click', okayButtonHandler);
    checkBox.addEventListener('click', checkBoxHandler);
}

/* function to display user guide */
function displayUserGuide()
{
    const container = document.createElement('div');
    container.className = "dictionare_d-flex dictionare_column dictionare_fixed-width";
    const videoUrl = chrome.runtime.getURL("demos/demo.mp4");
    container.id = "dictionare_guide_container";
    container.innerHTML = `<div class="dictionare_title-text">
    The demo below explains how to use Dictionare :
</div>
<div class="dictionare_d-flex dictionare_content_center">
    <video class="dictionare_video_responsive" controls autoplay>
        <source src=${videoUrl} type="video/mp4">
        Your browser does not support mp4 videos
    </video>
</div>
<div class="dictionare_footer-text">
    Shotcuts to turn extention on and off :
    <ul>
        <li>To turn extension on : <strong>Cntl / Command + I</strong></li>
        <li>To turn extention off : <strong>Cntl / Command + Shift + I</strong></li>
    </ul>
    <label for="dictionare_guide_check">
        <input type="checkbox" id="dictionare_guide_check">
        Do not show this again
    </label> 
</div>
<div class="dictionare_d-flex dictionare_content_center">
    <button class="dictionare_okay_button" id="dictionare_okay">got it</button>
</div>`;
    const width = document.documentElement.clientWidth;
    const posx = (width - 800)/ 2;
    container.style.left = posx + "px";
    container.style.top = "10px";
    document.body.prepend(container);
    guideVisible = true;
    addGuideListeners();
}