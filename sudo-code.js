//what is shown on screen will not be the actual string being tested for

//lyrics appear on screen for a certain time
//users key presses compared character by charater to string of on screen text
//if user presses the right key
  //the letter lights up and the game moves to the next character
//if wrong key
  //nothing happens
//once all charaters are lit up the code block goes away

//////////dificult characters
// 1.tab

/////converting lyrics to array of numbers/////////
//create fucntion to split lyrics into lines and then arrays of characters

/////////comparing user input to one on screen code block / code block array
  //make keys listen on keypress
    //if (key presssed = currentCodeBlock.currentKeyIndex)
      //then update styling of character to show correct key pressed
      //update currentKeyIndex
      //if currentKeyIndex = codeArray.length
        //turn current code block green
    //else
      //do nothing

//show next block

/////////showing blocks of code on a timeline
//lyrics split into blocks
//blocks shown at (song length / number of blocs) * (random number between 0.8 and 1.2)


//saturday todo
//1. backing track with song length
//2. function to convert lyrics to lines and then characters
//3. when user types code lights up
//4. make lines appear line by line roughly in time with the music (get song length).
//4. user input of text and song

// var duration = 500;
// var delayDuringLines = 500;
// var delayBetweenLines = (delayDuringLines + (2*duration));
//
// var classNames = '';
// for (var i = 0; i < game.linesArray.length; i++) {
//   classNames += '.line' + i;
//   classNames += ', ';
// }
//
// classNames = classNames.substring(0, classNames.length - 2);
//
// console.log(classNames);
//
// $(classNames).each(function(i) {
//   $(this).delay( i*(delayBetweenLines) ).slideDown(duration, function(){
//     $(this).delay( (delayDuringLines) ).slideUp(duration);
//   });
// });

// setInterval(checkHover, 1000);

// displayLyrics: function displayLyrics(){
//   game.$lyricContainerContainer.append(game.$linesContainer);
//   $('#game').prepend(game.$lyricContainerContainer);
//   game.currentCharacterIndex = 0;
// },

// testIfCorrectKey: function testIfCorrectKey(e){
//   if (game.paragraphyTesting[game.currentCharacterIndex].innerHTML === String.fromCharCode(e.which)){
//     console.log('pass!');
//     var currentClass = '.' + [game.currentCharacterIndex];
//     $(currentClass).addClass('correct');
//     game.currentCharacterIndex += 1;
//   } else {
//     console.log('fails');
//   }
// },

//refactor code
//show accuracy score
//make inputs disappear on play
//puase button
