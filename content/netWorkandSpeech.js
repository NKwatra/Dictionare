/* 
   function to play pronounciation of a word
   @param {word} : word which is to be pronounced.
*/
function pronounceWord(word){
   const synthesis = window.speechSynthesis;
   let wordUtterance = new SpeechSynthesisUtterance(word);
   synthesis.speak(wordUtterance);
}
