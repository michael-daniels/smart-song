//feature toggle ----
document.getElementById('rhymeButton').addEventListener('click', function() {
  document.getElementById('nextWordRow').style.display = "none";
  document.getElementById('rhymeRow').style.display = "block";

  let wordToRhyme = document.getSelection().toString();
  //console.log(wordToRhyme);

  fetch('https://api.datamuse.com/words?rel_rhy=' + wordToRhyme)
    .then(
      function(response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }

        // Examine the text in the response
        response.json().then(function(data) {
          // let responseLength = data.length;
          // let randomResponse = Math.floor(Math.random() * ((20 - 1) - 0 + 1)) + 0;
          // let theWord = data[randomResponse].word;
          console.log(data);



          for (i = 0; i < data.length; i++) {
            let rhymeRowTemplate = ` <a href="#">${data[i].word}</a> |`;
            console.log(rhymeRowTemplate);
            document.getElementById('rhymeRow').innerHTML += rhymeRowTemplate;


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

  let nextWordSuggestion = document.getSelection().toString();

  fetch('https://api.datamuse.com/words?lc=' + nextWordSuggestion)
    .then(
      function(response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }

        // Examine the text in the response
        response.json().then(function(data) {
          // let responseLength = data.length;
          // let randomResponse = Math.floor(Math.random() * ((20 - 1) - 0 + 1)) + 0;
          // let theWord = data[randomResponse].word;
          console.log(data);



          for (i = 0; i < data.length; i++) {
            let nextWordRowTemplate = ` <a href="#">${data[i].word}</a> |`;
            console.log(nextWordRowTemplate);
            document.getElementById('nextWordRow').innerHTML += nextWordRowTemplate;


          }

        });
      }
    )
    .catch(function(err) {
      console.log('Fetch Error :-S', err);
    });

});
//--------------------


//get entire value of textarea and split it to an array, assign to variable


//get highlighted word and word to the left of highlighted word, assign to variables

//pass higlighted word and word to left into function that fetches api results

//use template string to pass all results into scrolling results div
