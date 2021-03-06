// document.ready function that runs form select
$(document).ready(function () {
  $('select').formSelect();
});
// keypress functions that run a click listener in lieu of subitting
$('#gamename').keypress(function (event) {
  if (event.keyCode === 13) {
    $('#search').click();
  }
});
// keypress functions that run a click listener in lieu of subitting
$('#gamenumber').keypress(function (event) {
  if (event.keyCode === 13) {
    $('#findagame').click();
  }
});
// hides pick and text errors
$('#pickerror').hide();
$('#texterror').hide();
// click listener for random game button
$('#findagame').click(function () {
// assigning  static variables to Jquery calls
  let genreArray = $('#genre').val();
  let genreSelection;
  let platformSelection = $('#platform').val();
  let perspectiveSelection = $('#perspective').val();
  let resultSelection = $('#gamenumber').val();
//  if the length of the genre array is 0, platform is null, perspective selection is null, or the result selection is null, return an error message
  if (genreArray.length == 0 || platformSelection === null || perspectiveSelection === null || resultSelection === '') {

    $('#pickerror').show();
    setTimeout(function() {
      $('#pickerror').hide();
    }, 5000);

  } else {
    // attributes to be displayed while the data is being pulled
    genreSelection = genreArray.toString();
    $('#search-results-header').text('Finding you a random game...');
    $('#loading-bar').attr('class', 'progress');
    $('#results-container').attr('class', '');
    $('#main-container').attr('class', 'hide');
    // axios call to IGDB
    axios({
    
      url: "https://cors-anywhere.herokuapp.com/https://api-v3.igdb.com/games",
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'user-key': "8bf9fa37b1dfeca73818d322443b91fd",

      },

      data: 'where genres = [' + genreSelection + '] & platforms = (' + platformSelection + ') & player_perspectives = (' + perspectiveSelection + '); fields name, release_dates.human, genres.name, cover.url, similar_games.name, time_to_beat.normally, summary, age_ratings.rating, platforms.name; limit 500;',
      // then promise
    }).then(response => {
      // if there is no data, user will be shown error message
      if (response.data.length === 0) {

        $('#search-results-header').text('No Search Results! Please Try Again!');
        $('#loading-bar').attr('class', 'hide');

      } else if (resultSelection < response.data.length) {
        // setting attributes to be shown in html
        $('#search-results-header').text('You might like...');
        $('#loading-bar').attr('class', 'hide');
        $('#food-results-container').attr('class', 'container')
        // loop that grabs data from the results
        for (let i = 0; i < resultSelection; i++) {
          // assigns random number to be put into the index of the data array
          let randomPick = response.data[Math.floor(Math.random() * response.data.length)];
          const removeArray = response.data.indexOf(randomPick);

          if (removeArray > -1) {
            response.data.splice(removeArray, 1);
          };
          // setting variables to be displayed in html
          let pageBreak = $('<br>');
          let pageBreak2 = $('<br>');
          let pageBreak3 = $('<br>');
          let pageBreak4 = $('<br>');
          let gameTitle = $('<h5>');
          gameTitle.attr('class', 'header');
          let gameGenre = $('<p>');
          gameTitle.text(randomPick.name);
          let searchImg = $('<img>');
          let imgDiv = $('<div>');

          imgDiv.attr('class', 'card-image title-img');
          let textDiv = $('<div>');
          textDiv.attr('class', 'card-stacked');
          let textContentDiv = $('<div>');
          textContentDiv.attr('class', 'card-content');
          let horizontalCardDiv = $('<div>');
          horizontalCardDiv.attr('class', 'card horizontal');
          let gameSummary = $('<p>');
          let availableConsoles = $('<p>');
          let consoleArray = [];
          let ageRating = $('<p>');
          var ratingArray = [];
          let similarGamesContent = $('<p>');
          let similarGamesArray = [];
          // as long as similar games are not undefined, loop will run grabbing similar games data
          if (randomPick.similar_games != undefined) {
            for (let l = 0; l < randomPick.similar_games.length; l++) {
              let similarGames = randomPick.similar_games[l].name
              similarGamesArray.push(' ' + similarGames)
            }
          }
          //  as long as age rating is not undefined, loop will run grabbing age ratings, comparing their values from IGDB with our values, and displaying the according letter or age rating
          if (randomPick.age_ratings != undefined) {

            for (let k = 0; k < randomPick.age_ratings.length; k++) {

              let rating = '';
              if (randomPick.age_ratings[k].rating === 1) {
                rating = 'Three';
              } else if (randomPick.age_ratings[k].rating === 2) {
                rating = 'Seven';
              } else if (randomPick.age_ratings[k].rating === 3) {
                rating = 'Twelve';
              } else if (randomPick.age_ratings[k].rating === 4) {
                rating = 'Sixteen';
              } else if (randomPick.age_ratings[k].rating === 5) {
                rating = 'Eighteen';
              } else if (randomPick.age_ratings[k].rating === 6) {
                rating = 'RP';
              } else if (randomPick.age_ratings[k].rating === 7) {
                rating = 'EC';
              } else if (randomPick.age_ratings[k].rating === 8) {
                rating = 'E';
              } else if (randomPick.age_ratings[k].rating === 9) {
                rating = 'E10';
              } else if (randomPick.age_ratings[k].rating === 10) {
                rating = 'T';
              } else if (randomPick.age_ratings[k].rating === 11) {
                rating = 'M';
              } else if (randomPick.age_ratings[k].rating === 12) {
                rating = 'AO';
              };
              ratingArray.push(' ' + rating);

            };

          };
          // as long as the platforms are not undefined, loop will run grabbing the all available platforms for the game
          if (randomPick.platforms != undefined) {

            for (let j = 0; j < randomPick.platforms.length; j++) {

              let name = randomPick.platforms[j].name;
              consoleArray.push(' ' + name);

            };

          };
          // variables being created to be displayed in the html
          ageRating.text('ESRB/PEGI Rating: ' + ratingArray.toString());
          availableConsoles.text('Available Consoles: ' + consoleArray.toString());
          similarGamesContent.text('Similar Games: ' + similarGamesArray.toString() + ' ');
          gameSummary.text(randomPick.summary);
          // if the cover information is not undefined, image source will be set to the cover url for the game
          if (randomPick.cover != undefined) {

            searchImg.attr('src', 'https://' + randomPick.cover.url.replace('t_thumb', 't_cover_big'));

          };
          // appeneding data retrieved to the html
          imgDiv.append(searchImg);
          textContentDiv.append(gameTitle, gameGenre, pageBreak2, gameSummary, pageBreak3, availableConsoles, pageBreak4, ageRating, pageBreak, similarGamesContent);
          textDiv.append(textContentDiv);
          horizontalCardDiv.append(imgDiv, textDiv);
          $('#card-panel').append(horizontalCardDiv);

        };

      } else if (resultSelection > response.data.length) {

        $('#search-results-header').text('Random Games');
        $('#loading-bar').attr('class', 'hide');
      // same code running as above
        for (let i = 0; i < response.data.length; i++) {

          let pageBreak = $('<br>');
          let pageBreak2 = $('<br>');
          let pageBreak3 = $('<br>');
          let pageBreak4 = $('<br>');
          let gameTitle = $('<h5>');
          gameTitle.attr('class', 'header');
          let gameGenre = $('<p>');
          gameTitle.text(response.data[i].name);
          let searchImg = $('<img>');
          let imgDiv = $('<div>');
          imgDiv.attr('class', 'card-image title-img');
          let textDiv = $('<div>');
          textDiv.attr('class', 'card-stacked');
          let textContentDiv = $('<div>');
          textContentDiv.attr('class', 'card-content');
          let horizontalCardDiv = $('<div>');
          horizontalCardDiv.attr('class', 'card horizontal');
          let gameSummary = $('<p>');
          let availableConsoles = $('<p>');
          let consoleArray = [];
          let ageRating = $('<p>');
          let ratingArray = [];
          let similarGamesContent = $('<p>');
          let similarGamesArray = [];

          if (response.data[i].similar_games != undefined) {

            for (let l = 0; l < response.data[i].similar_games.length; l++) {

              let similarGames = response.data[i].similar_games[l].name;
              similarGamesArray.push(' ' + similarGames);

            };

          };

          if (response.data[i].age_ratings != undefined) {

            for (let k = 0; k < response.data[i].age_ratings.length; k++) {

              let rating = '';
              if (response.data[i].age_ratings[k].rating === 1) {
                rating = 'Three';
              } else if (response.data[i].age_ratings[k].rating === 2) {
                rating = 'Seven';
              } else if (response.data[i].age_ratings[k].rating === 3) {
                rating = 'Twelve';
              } else if (response.data[i].age_ratings[k].rating === 4) {
                rating = 'Sixteen';
              } else if (response.data[i].age_ratings[k].rating === 5) {
                rating = 'Eighteen';
              } else if (response.data[i].age_ratings[k].rating === 6) {
                rating = 'RP';
              } else if (response.data[i].age_ratings[k].rating === 7) {
                rating = 'EC';
              } else if (response.data[i].age_ratings[k].rating === 8) {
                rating = 'E';
              } else if (response.data[i].age_ratings[k].rating === 9) {
                rating = 'E10';
              } else if (response.data[i].age_ratings[k].rating === 10) {
                rating = 'T';
              } else if (response.data[i].age_ratings[k].rating === 11) {
                rating = 'M';
              } else if (response.data[i].age_ratings[k].rating === 12) {
                rating = 'AO';
              };
              ratingArray.push(' ' + rating);

            };

          };

          if (response.data[i].platforms != undefined) {

            for (let j = 0; j < response.data[i].platforms.length; j++) {

              let name = response.data[i].platforms[j].name;
              consoleArray.push(' ' + name);

            };

          };

          ageRating.text('ESRB/PEGI Rating: ' + ratingArray.toString());
          availableConsoles.text('Available Consoles: ' + consoleArray.toString());
          similarGamesContent.text('Similar Games: ' + similarGamesArray.toString() + ' ');
          gameSummary.text(response.data[i].summary);

          if (response.data[i].cover != undefined) {

            searchImg.attr('src', 'https://' + response.data[i].cover.url.replace('t_thumb', 't_cover_big'));

          };

          imgDiv.append(searchImg);
          textContentDiv.append(gameTitle, gameGenre, pageBreak2, gameSummary, pageBreak3, availableConsoles, pageBreak4, ageRating, pageBreak, similarGamesContent);
          textDiv.append(textContentDiv);
          horizontalCardDiv.append(imgDiv, textDiv);
          $('#card-panel').append(horizontalCardDiv);

        };

      };
      // error to be displayed in console if it exists
    }).catch(err => {
      console.error(err);
    });
//  food API
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://tasty.p.rapidapi.com/recipes/list?tags=under_30_minutes&from=0&sizes=50",
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "tasty.p.rapidapi.com",
        "x-rapidapi-key": "93a850cf5fmsh9786891d2e2471fp1069fdjsnb7305163276b"
      }
    }
    // food API call //getting info and creating different elements for the page
    $.ajax(settings).done(function (response) {
      let randomFoodPick = response.results[Math.floor(Math.random() * response.results.length)];
        const removeFoodArray = response.results.indexOf(randomFoodPick)
        if (removeFoodArray > -1) {
          response.results.splice(removeFoodArray, 1);
        };
        let instructionsArray = [];
        let componentsArray = [];
        let foodNameHElement = $('<h5>')
        let foodDescriptionPEl = $('<p>')
        let foodImgEl = $('<img height = "50%", width = "50%">')
        let foodTimeEl = $('<p>')
        let foodIngredientsEl = $('<p>')
        let foodInstructionsEl =$('<p>')
        let foodName = response.results[removeFoodArray].name;
        let foodDescription = response.results[removeFoodArray].description;
        let foodTime = response.results[removeFoodArray].total_time_minutes;
        if (response.results[removeFoodArray].instructions != undefined) {
          for (let m = 0; m < response.results[removeFoodArray].instructions.length; m++) {
            let instructions =  response.results[removeFoodArray].instructions[m].display_text;
            instructionsArray.push(' ' + instructions);
          };
        }


        
        if (response.results[removeFoodArray].sections[0].components != undefined) {
          for (let n = 0; n < response.results[removeFoodArray].sections[0].components.length; n++) {
            let components = response.results[removeFoodArray].sections[0].components[n].raw_text;
            componentsArray.push(' ' + components);
          };
        } 

// assigning info from api call to the correct elements
        foodNameHElement.text(foodName)
        foodDescriptionPEl.text('Description: ' + foodDescription)
        foodImgEl.attr('src', response.results[removeFoodArray].thumbnail_url)
        foodImgEl.attr('class', 'foodImg')
        foodTimeEl.text('Average time to make: ' + foodTime)
        foodIngredientsEl.text('Ingredients: ' + componentsArray)
        foodInstructionsEl.text('Instructions: ' + instructionsArray)
        $('#food-card-panel').append(foodImgEl, foodNameHElement, foodDescriptionPEl, foodImgEl, foodIngredientsEl, foodInstructionsEl)
      });
  }
  });

$('#search').click(function () {
// grabs user text input from search
  let gameName = $('#gamename').val();
  // if no text is submitted then the user will be shown an error
  if (gameName === '') {
    
    $('#texterror').show();
    setTimeout(function() {
      $('#texterror').hide();
    }, 5000);
    
  } else {
    //  creating elements to be shown while the data is being retrieved from IGDB api
    $('#search-results-header').text('Searching for your game...');
    $('#loading-bar').attr('class', 'progress');
    $('#results-container').attr('class', '');
    $('#main-container').attr('class', 'hide');
  // axios call to IGDB api
    axios({

    url: "https://cors-anywhere.herokuapp.com/https://api-v3.igdb.com/games",
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'user-key': "8bf9fa37b1dfeca73818d322443b91fd",

    },

    data: 'search "' + gameName + '"; fields name, release_dates.human, genres.name, cover.url, similar_games.name, time_to_beat.normally, summary, age_ratings.rating, platforms.name; limit 50;',

  })
// then promise
    .then(response => {
      // if no information can be retrieved, a message is displayed to the user
      if (response.data.length === 0) {

        $('#search-results-header').text('No Search Results! Please Try Again!');
        $('#loading-bar').attr('class', 'hide');

      } else {
        // creating elements to be shown in html
        $('#search-results-header').text('Searched Game')
        $('#loading-bar').attr('class', 'hide')
        $('#food-results-container').attr('class', 'container')
        for (var i = 0; i < response.data.length; i++) {
          // creating global variables to be inserted in HTML with Jquery
          let pageBreak = $('<br>');
          let pageBreak2 = $('<br>');
          let pageBreak3 = $('<br>');
          let pageBreak4 = $('<br>');
          let gameTitle = $('<h5>');
          gameTitle.attr('class', 'header');
          let gameGenre = $('<p>');
          gameTitle.text(response.data[i].name);
          let searchImg = $('<img>');
          let imgDiv = $('<div>');
          imgDiv.attr('class', 'card-image title-img');
          let textDiv = $('<div>');
          textDiv.attr('class', 'card-stacked');
          let textContentDiv = $('<div>');
          textContentDiv.attr('class', 'card-content');
          let horizontalCardDiv = $('<div>');
          horizontalCardDiv.attr('class', 'card horizontal');
          let gameSummary = $('<p>');
          let availableConsoles = $('<p>');
          let consoleArray = [];
          let ageRating = $('<p>');
          let ratingArray = [];
          let similarGamesContent = $('<p>');
          let similarGamesArray = [];
          // as long as the similar games are not undefined, loop will run that grabs similar game data
          if (response.data[i].similar_games != undefined) {

            for (let l = 0; l < response.data[i].similar_games.length; l++) {

              let similarGames = response.data[i].similar_games[l].name;
              similarGamesArray.push(' ' + similarGames);

            };

          };
          // as long as the age ratings are not undefined, loop will run grabbing the age rating data and assign it a text or number value depending on the value IGDB has given it
          if (response.data[i].age_ratings != undefined) {

            for (let k = 0; k < response.data[i].age_ratings.length; k++) {

              let rating = '';
              if (response.data[i].age_ratings[k].rating === 1) {
                rating = 'Three';
              } else if (response.data[i].age_ratings[k].rating === 2) {
                rating = 'Seven';
              } else if (response.data[i].age_ratings[k].rating === 3) {
                rating = 'Twelve';
              } else if (response.data[i].age_ratings[k].rating === 4) {
                rating = 'Sixteen';
              } else if (response.data[i].age_ratings[k].rating === 5) {
                rating = 'Eighteen';
              } else if (response.data[i].age_ratings[k].rating === 6) {
                rating = 'RP';
              } else if (response.data[i].age_ratings[k].rating === 7) {
                rating = 'EC';
              } else if (response.data[i].age_ratings[k].rating === 8) {
                rating = 'E';
              } else if (response.data[i].age_ratings[k].rating === 9) {
                rating = 'E10';
              } else if (response.data[i].age_ratings[k].rating === 10) {
                rating = 'T';
              } else if (response.data[i].age_ratings[k].rating === 11) {
                rating = 'M';
              } else if (response.data[i].age_ratings[k].rating === 12) {
                rating = 'AO';
              };
              ratingArray.push(' ' + rating);

            };

          };
          // if the platforms are not undefined, loop will run grabbing platform data
          if (response.data[i].platforms != undefined) {

            for (let j = 0; j < response.data[i].platforms.length; j++) {

              let name = response.data[i].platforms[j].name;
              consoleArray.push(' ' + name);

            };

          };
          // converts arrays to strings
          ageRating.text('ESRB/PEGI Rating: ' + ratingArray.toString());
          availableConsoles.text('Available Consoles: ' + consoleArray.toString());
          similarGamesContent.text('Similar Games: ' + similarGamesArray.toString() + ' ');
          gameSummary.text(response.data[i].summary);
          // as long as the cover img source is not undefined, cover image data will be pulled and set as the src attribute of the image
          if (response.data[i].cover != undefined) {

            var imgCover = response.data[i].cover.url;
            var imgReplace = 't_thumb';
            var imgNew = imgCover.replace(imgReplace, 't_cover_big');
            searchImg.attr('src', 'https://' + imgNew);

          };
          // appends all data grabbed from the api to the html
          imgDiv.append(searchImg);
          textContentDiv.append(gameTitle, gameGenre, pageBreak2, gameSummary, pageBreak3, availableConsoles, pageBreak4, ageRating, pageBreak, similarGamesContent);
          textDiv.append(textContentDiv);
          horizontalCardDiv.append(imgDiv, textDiv);
          $('#card-panel').append(horizontalCardDiv);

        };

      };

      })
      .catch(err => {
        console.error(err);
      });
      // food API to make it work on both buttons
      var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://tasty.p.rapidapi.com/recipes/list?tags=under_30_minutes&from=0&sizes=50",
        "method": "GET",
        "headers": {
          "x-rapidapi-host": "tasty.p.rapidapi.com",
          "x-rapidapi-key": "93a850cf5fmsh9786891d2e2471fp1069fdjsnb7305163276b"
        }
      }
      
      $.ajax(settings).done(function (response) {
        let randomFoodPick = response.results[Math.floor(Math.random() * response.results.length)];
        const removeFoodArray = response.results.indexOf(randomFoodPick)
        if (removeFoodArray > -1) {
          response.results.splice(removeFoodArray, 1);
        };
        let instructionsArray = [];
        let componentsArray = [];
        let foodNameHElement = $('<h5>')
        let foodDescriptionPEl = $('<p>')
        let foodImgEl = $('<img height = "50%", width = "50%">')
        let foodTimeEl = $('<p>')
        let foodIngredientsEl = $('<p>')
        let foodInstructionsEl =$('<p>')
        let foodName = response.results[removeFoodArray].name;
        let foodDescription = response.results[removeFoodArray].description;
        let foodTime = response.results[removeFoodArray].total_time_minutes;
        if (response.results[removeFoodArray].instructions != undefined) {
          for (let m = 0; m < response.results[removeFoodArray].instructions.length; m++) {
            let instructions =  response.results[removeFoodArray].instructions[m].display_text;
            instructionsArray.push(' ' + instructions);
          };
        }

        if (response.results[removeFoodArray].sections[0].components != undefined) {
          for (let n = 0; n < response.results[removeFoodArray].sections[0].components.length; n++) {
            let components = response.results[removeFoodArray].sections[0].components[n].raw_text;
            componentsArray.push(' ' + components);
          };
        } 
        foodNameHElement.text(foodName)
        foodDescriptionPEl.text('Description: ' + foodDescription)
        foodImgEl.attr('src', response.results[removeFoodArray].thumbnail_url)
        foodImgEl.attr('class', 'foodImg')
        foodTimeEl.text('Average time to make: ' + foodTime)
        foodIngredientsEl.text('Ingredients: ' + componentsArray)
        foodInstructionsEl.text('Instructions: ' + instructionsArray)
        $('#food-card-panel').append(foodImgEl, foodNameHElement, foodDescriptionPEl, foodImgEl, foodIngredientsEl, foodInstructionsEl)
      });
      
    
    }});