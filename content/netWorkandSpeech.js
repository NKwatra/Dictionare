function pronounceWord(word){
   const synthesis = window.speechSynthesis;
   let wordUtterance = new SpeechSynthesisUtterance(word);
   synthesis.speak(wordUtterance);
}
