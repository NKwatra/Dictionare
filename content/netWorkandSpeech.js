/* 
   function to play pronounciation of a word
   @param {word} : word which is to be pronounced.
*/
function pronounceWord(word){
   const synthesis = window.speechSynthesis;
   let wordUtterance = new SpeechSynthesisUtterance(word);
   synthesis.speak(wordUtterance);
}

/*
   function to find the information for a word
   @param {word} : word which needs to be searched
*/
function loadWordInfo(word){
   const url = `https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${word}?key=${userKey}`;
   return fetch(url).then(response => response.json()).then(data => data);
}

/*
   function to extract useful data from the json sent by api
*/
function extractData(data){
   let wordObject = {};
   try
   {
      let firstSense = data[0];
      wordObject["def"] = firstSense["shortdef"];
      wordObject["syn"] = firstSense["meta"]["syns"][0] || [];
      wordObject["ant"] = firstSense["meta"]["ants"][0] || [];
      console.log(firstSense, wordObject);
   }catch(error)
   {
      wordObject = {
         def : "There was some error in finding word, please try again",
         syn : [],
         ant : []
      }
      console.log(error);
   }

   /* filter data as per the requirement */
   if(wordObject["def"] instanceof Array)
   {
      if(wordObject["def"].length >= 5)
      {
         wordObject["def"] = wordObject["def"].slice(0,5);
      }
      let definition = "<ol>";
      for(let i = 0; i < wordObject["def"].length; i++)
      {
         definition += "<li>" + wordObject["def"][i] + "</li>"
      }
      definition += "</ol>";
      wordObject["def"] = definition;
   }

   if(wordObject["syn"].length > 6)
   {
      wordObject["syn"] = wordObject["syn"].slice(0,6);
   }

   if(wordObject["ant"].length > 6)
   {
      wordObject["ant"] = wordObject["ant"].slice(0,6);
   }

   wordObject["syn"] = wordObject["syn"].length > 0 ? wordObject["syn"].join(", ") : "Sorry, no synonyms found";
   wordObject["ant"] = wordObject["ant"].length > 0 ? wordObject["ant"].join(", ") : "Sorry, no antonyms found";

   return wordObject;
}
