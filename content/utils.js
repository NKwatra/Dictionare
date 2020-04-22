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

function createOverlay(posx, posy)
{
    
}