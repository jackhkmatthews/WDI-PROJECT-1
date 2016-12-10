console.log('js loaded');

$(start);

function start(){
  game.appendHtml();
  game.makeSubmitListen();
  game.makeKeysListen();
}

var game = {

  songPath: 'ChildishGambino-Redbone.mp3',

  $game: $('#game'),

  $html: '',

  $song: '',

  $button: '',

  lyricsHtml: '',

  paragraphyHtml: [],

  paragraphyTesting: [],

  currentCharacterIndex: 0,

  linesArray: [],

  linesContainer: '',

  lineDiv: '',

  appendHtml: function appendHtml(){
    game.$html = game.createHtml();
    $('#game').append(game.$html);
  },

  createHtml: function createHtml(){
    game.$button = game.createPlayButton();
    game.$song = game.createSongTag();
    $('#game').append([game.$button, game.$song]);
    return game.$main;
  },

  createPlayButton: function createPlayButton(){
    game.$button = $(document.createElement('button'));
    game.$button.html('play').attr('class', 'play');
    game.makePlayButtonListen();
    return game.$button;
  },

  createSongTag: function createSongTag(){
    game.$song = $(document.createElement('audio'));
    game.$song.attr('src', game.songPath);
    game.$song.attr('id', 'song');
    return game.$song;
  },

  makePlayButtonListen: function makePlayButtonListen(){
    game.$button.on('click', game.playAudio);
  },

  playAudio: function playAudio(e){
    e.preventDefault();
    console.log('music should play');
    document.getElementById('song').play();
  },

  pauseAudio: function pauseAudio(e){
    e.preventDefault();
    console.log('music should pause');
    document.getElementById('song').pause();
  },

  makeSubmitListen: function makeSubmitListen (){
    console.log($('#user-form'));
    $('#submit').on('click', game.submitCallback);
  },

  submitCallback: function submitCallback(e){
    e.target.preventDefault;
    game.getLyrics();
    game.displayLyrics();
    game.convertLyrics();
    game.currentCharacterIndex = 0;
  },

  getLyrics: function getLyrics(){
    game.lyricsHtml = $('#user-text').val();
  },

  displayLyrics: function displayLyrics(){
    game.linesArray = game.lyricsHtml.split('<br>');
    for (var i = 0; i < game.linesArray.length; i++) {
      game.linesArray[i] = game.linesArray[i].replace('<p>', '');
      game.linesArray[i] = game.linesArray[i].replace('</p>', '');
    }
    console.log(game.linesArray);

    game.linesContainer = document.createElement('div');

    for (var i = 0; i < game.linesArray.length; i++) {
      var line = game.linesArray[i];
      game.lineDiv = document.createElement('div');
      game.lineDiv.className = 'line' + i;
      console.log(game.lineDiv);
      for (var j = 0; j < line.length; j++) {
        var span = document.createElement('span');
        span.className = game.currentCharacterIndex;
        span.innerHTML = line[j];
        game.paragraphyHtml.push(span);
        game.paragraphyTesting.push(span);
        game.lineDiv.appendChild(span);
        game.lineDiv.style.display = 'none';
        game.currentCharacterIndex += 1;
      }
      var lineBreak = document.createElement('br');
      game.paragraphyHtml.push(lineBreak);
      game.linesContainer.appendChild(game.lineDiv);
    }

    console.log(game.linesContainer);


    var $div = $(document.createElement('div'));
    $div.append(game.linesContainer);
    $('#game').prepend($div);

    game.currentCharacterIndex = 0;


    // var an0 = function (){
    //   $('.line0').slideDown();
    // };
    // var an1 = function (){
    //   $('.line1').slideDown();
    //   $('.line1').slideDown();
    // };
    // var an2 = function (){
    //   $('.line2').slideDown();
    //   $('.line2').slideDown();
    // };
    // var an3 = function (){
    //   $('.line3').slideDown();
    //   $('.line3').slideDown();
    // };
    //
    // window.setTimeout(an0, 1000);
    // window.setTimeout(an1, 2000);
    // window.setTimeout(an2, 3000);
    // window.setTimeout(an3, 4000);

    var duration = 500;
    var delayDuringLines = 500;
    var delayBetweenLines = (delayDuringLines + (2*duration));

    var classNames = '';
    for (var i = 0; i < game.linesArray.length; i++) {
      classNames += '.line' + i;
      classNames += ', ';
    }
    classNames = classNames.substring(0, classNames.length - 2);

    console.log(classNames);

    $(classNames).each(function(i) {
      $(this).delay( i*(delayBetweenLines) ).slideDown(duration, function(){
        $(this).delay( (delayDuringLines) ).slideUp(duration);
      });
    });

  },

  convertLyrics: function convertLyrics(){
    var div = document.createElement('div');
    div.innerHTML = game.lyricsHtml;
    game.lyrics = div.textContent;
  },

  makeKeysListen: function makeKeysListen(){
    $(window).on('keypress', game.testIfCorrectKey);
  },

  testIfCorrectKey: function testIfCorrectKey(e){
    if (game.paragraphyTesting[game.currentCharacterIndex].innerHTML === String.fromCharCode(e.which)){
      console.log('pass!');
      var currentClass = '.' + [game.currentCharacterIndex];
      $(currentClass).addClass('correct');
      game.currentCharacterIndex += 1;
    } else {
      console.log('fails');
    }
  },

  displayLines: function displayLines(){

  }


};


//300000




//create play button
//make play button listen for clicks
  //if class = play
    //play audio
    //change class to pause
    //change inner html to pause
  //if class = puase
    //pause audio
    //change class to play
    //change inner html to play
