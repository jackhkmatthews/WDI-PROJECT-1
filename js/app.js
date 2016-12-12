console.log('js loaded');

$(start);

function start(){
  game.appendHtml();
  game.makeSubmitListen();
  game.makeKeysListen();
  game.audioStuff();
  game.makeSongSubmitListen();
  game.makeDurationSubmitListen();
  game.makePlayButtonListen();
  setInterval(game.checkLinePosition, 2000);
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

  newLineIndex: 0,

  currentLineIndex: 0,

  currentCharacterOnLineIndex: 0,
  currentCharacterOnLineIndex0: 0,
  currentCharacterOnLineIndex1: 0,
  currentCharacterOnLineIndex2: 0,

  songDuration: 0,

  animationDuration: 10000,

  height: 300,

  numberOfLinesOnScreen: 0,

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
      game.displayCountDown();
      game.currentCharacterIndex = 0;
    });
  },

  displayCountDown: function displayCountDown(){
    var $h2 = $(document.createElement('h2'));
    $h2.html(3);
    $h2.attr('class', 'count-down');
    $('#game').append($h2);
    game.updateCountDown();
  },

  updateCountDown: function updateCountDown(){
    setTimeout(function(){
      $('.count-down').html(parseInt($('.count-down').get(0).innerHTML) - 1);
      setTimeout(function(){
        $('.count-down').html(parseInt($('.count-down').get(0).innerHTML) - 1);
        setTimeout(function(){
          game.displayNewLine();
          $('video').get(0).play();
          $('.count-down').remove();
        }, 1000);
      }, 1000);
    }, 1000);
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
    // game.$lyricContainerContainer.html('');
    game.numberOfLinesOnScreen += 1;
    game.$lyricContainerContainer.prepend(game.lineDivs[game.newLineIndex]);
    $('#game').prepend(game.$lyricContainerContainer);
    // game.currentCharacterIndex = 0;
    $(game.lineDivs[game.newLineIndex]).animate({
      top: '300'
    }, game.animationDuration, 'linear' );
    game.currentCharacterOnLineIndex = 0;
  },

  checkLinePosition: function checkLinePosition(){
    var newLine = game.lineDivs[game.newLineIndex];
    var currentLine = game.lineDivs[game.currentLineIndex];
    var top = (Math.random() * ((game.height*2) - 0) + 0) / (game.animationDuration/(game.songDuration/game.linesArray.length));
    var pix = parseInt($(newLine).attr('style').split(' ')[1].split('p')[0]);
    if(pix > top){
      game.newLineIndex += 1;
      game.displayNewLine();
    }
    pix = parseInt($(currentLine).attr('style').split(' ')[1].split('p')[0]);
    if (pix === 300){
      console.log('line should be removed');
      $(game.lineDivs[game.currentLineIndex]).remove();
      game.currentLineIndex += 1;
      game.numberOfLinesOnScreen -= 1;
    }
  },

  makeKeysListen: function makeKeysListen(){
    $(window).on('keypress', game.testIfCorrectKey);
  },

  testIfCorrectKey: function testIfCorrectKey(e){
    console.log(game.lineTesting[game.currentLineIndex][game.currentCharacterOnLineIndex0]);
    console.log(game.lineTesting[game.currentLineIndex +1][game.currentCharacterOnLineIndex1]);
    console.log(game.lineTesting[game.currentLineIndex+2][game.currentCharacterOnLineIndex2]);
    if (game.currentCharacterOnLineIndex0 === game.lineTesting[game.currentLineIndex].length){
      game.currentCharacterOnLineIndex0 = 0;
    }
    if (game.currentCharacterOnLineIndex1 === game.lineTesting[game.currentLineIndex +1].length){
      game.currentCharacterOnLineIndex0 = 0;
    }
    if (game.currentCharacterOnLineIndex2 === game.lineTesting[game.currentLineIndex+2].length){
      game.currentCharacterOnLineIndex0 = 0;
    }
    //first line on screen
    if (
      game.lineTesting[game.currentLineIndex][game.currentCharacterOnLineIndex0].innerHTML === String.fromCharCode(e.which)){
      console.log('pass!');
      var currentClass = '.' + [game.currentCharacterOnLineIndex0];
      $(currentClass).addClass('correct');
      game.currentCharacterOnLineIndex0 += 1;
    }
    // else if ( //second line on screen
    //   game.lineTesting[game.currentLineIndex +1][game.currentCharacterOnLineIndex1].innerHTML === String.fromCharCode(e.which)){
    //   console.log('pass!');
    //   currentClass = '.' + [game.currentCharacterOnLineIndex1];
    //   $(currentClass).addClass('correct');
    //   game.currentCharacterOnLineIndex1 += 1;
    // } else if (  //third line on screen
    //   game.lineTesting[game.currentLineIndex+2][game.currentCharacterOnLineIndex2].innerHTML === String.fromCharCode(e.which)){
    //   console.log('pass!');
    //   currentClass = '.' + [game.currentCharacterOnLineIndex2];
    //   $(currentClass).addClass('correct');
    //   game.currentCharacterOnLineIndex2 += 1;
    // }
    else {
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
  },

  makeDurationSubmitListen: function makeDurationSubmitListen(){
    $('#submit-duration').on('click', function(){
      var mins = $('#mins').val();
      var secs = $('#secs').val();
      console.log(mins, secs);
      game.songDuration = (mins*60000) + (secs*1000);
    });
  }

};


//10000mils to cover 300px or box
//(190000/linesArray1.length)

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
