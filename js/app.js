console.log('js loaded');

$(start);

function start(){
  game.appendHtml();
  game.makeSubmitListen();
  game.makeKeysListen();
  setInterval(game.checkLinePosition, 2000);
  game.audioStuff();
  game.makeSongSubmitListen();
  game.makePlayButtonListen();
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

  lineTesting: [],

  currentCharacterIndex: 0,

  linesArray: [],

  lineDiv: '',

  lineDivs: [],

  currentLineIndex: 0,

  currentCharacterOnLineIndex: 0,

  $linesContainer: $(document.createElement('div')).addClass('lyric-container'),

  $lyricContainerContainer: $(document.createElement('div')).addClass('lyric-container'),

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

    return game.$button;
  },

  createSongTag: function createSongTag(){
    game.$song = $(document.createElement('audio'));
    game.$song.attr('src', game.songPath);
    game.$song.attr('id', 'song');
    return game.$song;
  },

  makePlayButtonListen: function makePlayButtonListen(){
    game.$button.on('click', function(){
      game.displayNewLine();
      game.currentCharacterIndex = 0;
      $('video').get(0).play();
    });
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
    $('#submit').on('click', game.submitCallback);
  },

  submitCallback: function submitCallback(e){
    e.target.preventDefault;
    game.getLyrics();
    game.convertLyrics();
    game.parseLyrics();
  },

  getLyrics: function getLyrics(){
    game.lyricsHtml = $('#user-text').val();
  },

  convertLyrics: function convertLyrics(){
    var div = document.createElement('div');
    div.innerHTML = game.lyricsHtml;
    game.lyrics = div.textContent;
  },

  parseLyrics: function parseLyrics(){
    var linesArray1 = game.lyricsHtml.split('<br>');

    //go through each string in the array, insert into a div and then bring back textContent of each element
    for (var i = 0; i < linesArray1.length; i++) {
      var div = document.createElement('div');
      div.innerHTML = linesArray1[i];
      var text = div.textContent;
      game.linesArray.push(text);
    }




    for (var i = 0; i < game.linesArray.length; i++) {
      game.linesArray[i] = game.linesArray[i].replace('<p>', '');
      game.linesArray[i] = game.linesArray[i].replace('</p>', '');
    }
    for (var i = 0; i < game.linesArray.length; i++) {
      var line = game.linesArray[i];
      game.lineDiv = document.createElement('div');
      game.lineDiv.className = 'line' + i;
      var lineTesting = [];
      for (var j = 0; j < line.length; j++) {
        var span = document.createElement('span');
        span.className = game.currentCharacterOnLineIndex;
        span.innerHTML = line[j];
        game.paragraphyHtml.push(span);
        game.paragraphyTesting.push(span);
        lineTesting.push(span);
        game.lineDiv.appendChild(span);
        // game.lineDiv.style.display = 'none';
        game.currentCharacterOnLineIndex += 1;
      }
      var lineBreak = document.createElement('br');
      game.paragraphyHtml.push(lineBreak);
      game.$linesContainer.append(game.lineDiv);
      game.lineDivs.push(game.lineDiv);
      game.lineTesting.push(lineTesting);
      game.currentCharacterOnLineIndex = 0;
    }

  },

  displayNewLine: function displayNewLine(){
    game.$lyricContainerContainer.html('');
    game.$lyricContainerContainer.append(game.lineDivs[game.currentLineIndex]);
    $('#game').prepend(game.$lyricContainerContainer);
    // game.currentCharacterIndex = 0;
    $(game.lineDivs[game.currentLineIndex]).animate({
      top: '300'
    }, 10000, 'linear' );
    game.currentCharacterOnLineIndex = 0;
  },

  checkLinePosition: function checkLinePosition(){
    var currentLine = game.lineDivs[game.currentLineIndex];
    if($(currentLine).attr('style') === 'top: 300px;'){
      console.log('next!');
      //remove current div
      //append new one and animate
      game.currentLineIndex += 1;
      game.displayNewLine();
    } else {
      console.log('not yet!');
    }
  },

  makeKeysListen: function makeKeysListen(){
    $(window).on('keypress', game.testIfCorrectKey);
  },

  testIfCorrectKey: function testIfCorrectKey(e){
    console.log(game.lineTesting[game.currentLineIndex][game.currentCharacterOnLineIndex]);
    if (
      game.lineTesting[game.currentLineIndex][game.currentCharacterOnLineIndex].innerHTML === String.fromCharCode(e.which)){
      console.log('pass!');
      var currentClass = '.' + [game.currentCharacterOnLineIndex];
      $(currentClass).addClass('correct');
      game.currentCharacterOnLineIndex += 1;
    } else {
      console.log('fails');
    }
  },

  displayLines: function displayLines(){

  },

  audioStuff: function audioStuff(){
    var videos = document.querySelectorAll('video');
    for (var i = 0, l = videos.length; i < l; i++) {
      var video = videos[i];
      var src = video.src || (function () {
        var sources = video.querySelectorAll('source');
        for (var j = 0, sl = sources.length; j < sl; j++) {
          var source = sources[j];
          var type = source.type;
          var isMp4 = type.indexOf('mp4') != -1;
          if (isMp4) return source.src;
        }
        return null;
      })();
      if (src) {
        var isYoutube = src && src.match(/(?:youtu|youtube)(?:\.com|\.be)\/([\w\W]+)/i);
        if (isYoutube) {
          var id = isYoutube[1].match(/watch\?v=|[\w\W]+/gi);
          id = (id.length > 1) ? id.splice(1) : id;
          id = id.toString();
          var mp4url = 'http://www.youtubeinmp4.com/redirect.php?video=';
          video.src = mp4url + id;
        }
      }
    }
  },

  makeSongSubmitListen: function makeSongSubmitListen(){
    $('#submit-song').on('click', function(){
      console.log('clicked');
      $('.song').html('');
      var $video = $(document.createElement('video'));
      $video.attr('controls', 'true');
      $video.css('display', 'none');
      var $source = $(document.createElement('source'));
      $source.attr('id', 'song-source');
      $source.attr('src', $('#user-song').val());
      $source.attr('type', 'video/mp4');
      $video.append($source);
      $('aside').append($video);
      game.audioStuff();
    });
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
