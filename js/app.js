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
    var splitLyrics = game.lyricsHtml.split('<br>');
    for (var i = 0; i < splitLyrics.length; i++) {
      splitLyrics[i] = splitLyrics[i].replace('<p>', '');
      splitLyrics[i] = splitLyrics[i].replace('</p>', '');
    }
    console.log(splitLyrics);

    var divs = document.createElement('div');

    for (var i = 0; i < splitLyrics.length; i++) {
      var line = splitLyrics[i];
      var div = document.createElement('div');
      div.className = 'line' + i;
      console.log(div);
      for (var j = 0; j < line.length; j++) {
        var span = document.createElement('span');
        span.className = game.currentCharacterIndex;
        span.innerHTML = line[j];
        // span.style.display = 'none'
        game.paragraphyHtml.push(span);
        game.paragraphyTesting.push(span);
        div.appendChild(span);
        div.style.display = 'none';
        game.currentCharacterIndex += 1;
      }
      var lineBreak = document.createElement('br');
      game.paragraphyHtml.push(lineBreak);
      divs.appendChild(div);
    }

    console.log(divs);


    var $div = $(document.createElement('div'));
    // $div.append(game.paragraphyHtml);
    $div.append(divs);
    $('#game').prepend($div);

    game.currentCharacterIndex = 0;

    $('.line1').fadeIn();

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
