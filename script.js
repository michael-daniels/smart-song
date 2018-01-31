
function checkSavedContent() {
  //this function loops to check local storage for save names up to i. As long as the save names continue to be found, they are inserted in the save list for the user to select and have an inline onclick event attached to them. As soon as it returns null for one, break out of the loop which will stop population of the save list.
  for (i = 1; i < 100; i++) {
    if (localStorage.getItem(`smartsong-save196234-${i}`) === null) {
      break;
    } else {
      document.getElementById('saveList').innerHTML += `<a href="#"><div id="save-${i}" class="save-list-item" onclick="populateSavedContentOnSaveClick(${i})">Song ${i}</div></a>`;

    }
  }
}
checkSavedContent();

//Add click listener to plus tab, loop over current local storage keys from least to greatest, once one is not found, create a slot in storage from which a tab will be created.
document.getElementById('createNewTab').addEventListener('click', function(){

    let newTabNumber = localStorage.length + 1;

    localStorage.setItem(`smartsong-save196234-${newTabNumber}`, "");

    let anchorTag = document.createElement('a');
    anchorTag.href="#";

    let divSaveNumber = document.createElement('div');
    divSaveNumber.id = `save-${newTabNumber}`;
    divSaveNumber.classList.add('save-list-item');
    divSaveNumber.onclick = function(){
      populateSavedContentOnSaveClick(newTabNumber);
    }
    divSaveNumber.innerText = `Song ${newTabNumber}`;

    anchorTag.appendChild(divSaveNumber);
    document.getElementById('saveList').appendChild(anchorTag);

    // for (i = 1; i < 5; i++) {
    //
    //   if (localStorage.getItem(`smartsong-save196234-${i}`) === null) {
    //
    //     localStorage.setItem(`smartsong-save196234-${i}`, "");
    //
    //     document.getElementById('saveList').innerHTML += `<a href="#"><div id="save-${i}" class="save-list-item" onclick="populateSavedContentOnSaveClick(${i})">Song ${i}</div></a>`;
    //     return;
    //   }
    // }

});

let lastSaveLoaded = 1;

function populateSavedContentOnLoad() {
  //this function load save number 1 on document load
  document.forms.theForm.textInput.value = localStorage.getItem(`smartsong-save196234-${lastSaveLoaded}`);
}
populateSavedContentOnLoad();

function populateSavedContentOnSaveClick(numberPassedFromSaveList) {
  //this takes the dynamically created save number from the save list that the user clicked on and will retrieve that saved content from local storage and populate it into the text area for editing
  lastSaveLoaded = numberPassedFromSaveList;
  document.forms.theForm.textInput.value = localStorage.getItem(`smartsong-save196234-${lastSaveLoaded}`);
}

//This event autosaves the tab contents to local storage every time the contents of the text area are changed. It uses the variable lastSaveLoaded to track which save was last clicked by the user (which means thats whats showing in the text area) to determine which local storage key to save the content to.
document.forms.theForm.textInput.addEventListener('input', function() {
  let theTextAreaContent = document.forms.theForm.textInput.value;
  localStorage.setItem(`smartsong-save196234-${lastSaveLoaded}`, theTextAreaContent);
})

//This function gets the word that the user clicks from the results and inserts it where the users cursor was last placed in the text area.
function getClickedWord(wordId) {
  let theClickedWord = document.getElementById(wordId).innerHTML;
  let selStart = document.forms.theForm.textInput.selectionStart;
  //let selEnd = document.forms.theForm.textInput.selectionEnd;

  console.log(selStart);
  //console.log(selEnd);

  let textAreaArray = document.forms.theForm.textInput.value.split('');

  console.log(textAreaArray);
  console.log(theClickedWord);
  textAreaArray[selStart] = theClickedWord + " ";

  console.log(textAreaArray);

  document.forms.theForm.textInput.value = textAreaArray.join('');


}

//feature toggle - these events toggle which feature is showing on click of the features button and also perform the API fetch and returns the results.
document.getElementById('rhymeButton').addEventListener('click', function() {
  document.getElementById('nextWordRow').style.display = "none";
  document.getElementById('rhymeRow').style.display = "block";
  document.getElementById('rhymeRow').innerHTML = "";

  let wordToRhyme = document.getSelection().toString();

  let wordLastTyped;
  wordLastTyped = document.forms.theForm.textInput.value.split(' ');
  wordLastTyped = wordLastTyped[wordLastTyped.length - 1];

  console.log("Word to rhyme: ", wordToRhyme);
  console.log("Last word typed: ", wordLastTyped);
  //console.log("API Call URL",`https://api.datamuse.com/words?rel_rhy=${wordToRhyme}&lc=${wordLastTyped}`)

  fetch(`https://api.datamuse.com/words?rel_rhy=${wordToRhyme}&lc=${wordLastTyped}`)
    .then(
      function(response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }

        response.json().then(function(data) {
          //console.log(data);

          if (data.length === 0) {
            document.getElementById('rhymeRow').innerHTML = "No results found..."
          } else {

            for (i = 0; i < data.length; i++) {
              let rhymeRowTemplate = ` <a id="rhyme${i + 1}" href="#" class="rhyme-row-template" onclick="getClickedWord('rhyme${i + 1}')">${data[i].word}</a> |`;
              //console.log(rhymeRowTemplate);
              document.getElementById('rhymeRow').innerHTML += rhymeRowTemplate;
            }

          }



        });
      }
    )
    .catch(function(err) {
      console.log('Fetch Error :-S', err);
    });

});

document.getElementById('nextWordButton').addEventListener('click', function() {
  document.getElementById('nextWordRow').style.display = "block";
  document.getElementById('rhymeRow').style.display = "none";
  document.getElementById('nextWordRow').innerHTML = "";

  let nextWordSuggestion = document.getSelection().toString();

  fetch('https://api.datamuse.com/words?lc=' + nextWordSuggestion)
    .then(
      function(response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }

        response.json().then(function(data) {

          if (data.length === 0) {
            document.getElementById('nextWordRow').innerHTML = "No results found..."
          } else {

          for (i = 0; i < data.length; i++) {
            let nextWordRowTemplate = ` <a id="nextWord${i + 1}" href="#" class="next-word-row-template" onclick="getClickedWord('nextWord${i + 1}')">${data[i].word}</a> |`;
            //console.log(nextWordRowTemplate);
            document.getElementById('nextWordRow').innerHTML += nextWordRowTemplate;
          }
        }

        });
      }
    )
    .catch(function(err) {
      console.log('Fetch Error :-S', err);
    });

});

//--------------------


//get highlighted word and word to the left of highlighted word, assign to variables

//pass higlighted word and word to left into function that fetches api results

//use template string to pass all results into scrolling results div
