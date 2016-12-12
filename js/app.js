console.log('js loaded');

$(start);

function start(){
  game.appendHtml();
  game.makeSubmitListen();
  game.makePlayButtonListen();
  game.makeKeysListen();
  game.audioStuff();
}

var game = {

  songPath: 'ChildishGambino-Redbone.mp3',
  $game: $('#game'),
  html: '',
  form: '',
  playButton: '',
  songTag: '',
  userLyricsHtml: '',
  lyricsString: '',
  paragraphyHtml: [],
  paragraphyTesting: [],
  lineTesting: [],
  currentCharacterIndex: 0,
  currentCharacterOnLineIndex: 0,
  linesArray: [],
  lineDivs: [],
  newLineIndex: 0,
  currentLineIndex: 0,
  songDuration: 0,
  animationDuration: 30000,
  height: 300,
  numberOfLinesOnScreen: 0,
  linesOnScreen: [],
  currentCharacterIndexes: [],
  stringsToRemove: ['', '[Verse]', '[Verse 1]', '[Verse 2]', '[Verse 3]', '[Verse 4]', '[Verse 5]', '[Bridge 1]', '[Bridge 2]', '[Pre-Hook]','[Outro]', '[Hook]'],
  $linesContainer: $(document.createElement('div')).addClass('lyric-container'),
  lyricsContainer: '',
  hit: 0,
  missed: 0,
  keysPressed: 0,
  time: 3,

  appendHtml: function appendHtml(){
    this.html = this.createHtml();
    $('body').prepend(this.html);
  },

  createHtml: function createHtml(){
    this.accuracyContainer = this.createAccuracyContainer();
    this.lyricsContainer = this.createLyricsContainer();
    this.form = this.createForm();
    this.playButton = this.createPlayButton();
    var main = document.createElement('main');
    $(main).attr('id', 'game');
    $(main).append([this.accuracyContainer, this.lyricsContainer, this.form, this.playButton]);
    return main;
  },

  createAccuracyContainer: function(){
    var div = document.createElement('div');
    var h1 = document.createElement('h2');
    $(h1).attr('id', 'hit');
    $(h1).html('hit:');
    var h2 = document.createElement('h2');
    $(h2).attr('id', 'missed');
    $(h2).html('missed:');
    var h3 = document.createElement('h2');
    $(h3).attr('id', 'accuracy');
    $(h3).html('accuracy:');
    $(div).append([h1, h2, h3]);
    return div;
  },

  createLyricsContainer: function createLyricsContainer(){
    var div = document.createElement('div');
    $(div).addClass('lyrics-container');
    return div;
  },

  createForm: function createForm(){
    var form = document.createElement('form');
    $(form).attr('id', 'user-form');

    var textarea = document.createElement('textarea');
    $(textarea).attr('placeholer', 'Lyrics Outer HTML');
    $(textarea).attr('id', 'user-lyrics-html');

    var url = document.createElement('input');
    $(url).attr('type', 'text');
    $(url).attr('placeholer', 'Youtube URL');
    $(url).attr('id', 'youtube-url');

    var mins = document.createElement('select');
    $(mins).attr('id', 'mins');
    for (var i = 0; i < 10; i++) {
      var value = i;
      var text = i + ' mins';
      var option = document.createElement('option');
      $(option).attr('value', value);
      $(option).html(text);
      $(mins).append(option);
    }

    var secs = document.createElement('select');
    $(secs).attr('id', 'secs');
    for (i = 0; i < 50; i+=10) {
      value = i;
      text = i + ' secs';
      option = document.createElement('option');
      $(option).attr('value', value);
      $(option).html(text);
      $(secs).append(option);
    }

    var button = document.createElement('button');
    $(button).attr('type', 'submit');
    $(button).html('Submit');
    $(button).attr('id', 'submit');

    $(form).append([textarea, url, mins, secs, button]);

    return form;
  },

  createPlayButton: function createPlayButton(){
    var playButton = document.createElement('button');
    $(playButton).html('play').attr('class', 'play');
    $(playButton).attr('id', 'play');
    return playButton;
  },

  makePlayButtonListen: function makePlayButtonListen(){
    $('#play').on('click', this.playButtonCallback.bind(this))
  },

  playButtonCallback: function playButtonCallback(){
    this.startCountDown();
    this.currentCharacterIndex = 0;
    setInterval(this.checkLinePosition, 500);
  },

  startCountDown: function startCountDown(){
    var h2 = document.createElement('h2');
    $(h2).html(this.time);
    $(h2).attr('class', 'count-down');
    $('#game').prepend(h2);
    this.countDown();
  },

  countDown: function countDown(){
    setInterval(this.countDownInterval.bind(this), 1000);
  },

  countDownInterval: function countDownInterval(){
    $('.count-down').html(--this.time);
    if (this.time === 0) {
      clearInterval(this.countDown);
      $('.count-down').remove();
      this.displayNewLine();
      $('video').get(0).play();
    }
  },

  makeSubmitListen: function makeSubmitListen (){
    $('#user-form').on('submit', this.submitCallback.bind(this));
  },

  submitCallback: function submitCallback(e){
    e.preventDefault();
    this.getLyrics();
    this.parseLyrics();
    this.createLyricSpans();
    this.getDuration();
    this.handleAudio();
  },

  getLyrics: function getLyrics(){
    this.userLyricsHtml = $('#user-lyrics-html').val();
  },

  parseLyrics: function parseLyrics(){

    function makeLyricsAString(){
      var div = document.createElement('div');
      $(div).html(this.userLyricsHtml);
      this.lyricsString = div.textContent;
    }
    makeLyricsAString.bind(this);

    function splitLinesIntoArrayElements(){
      console.log(this.userLyricsHtml);
      var HtmlLinesArray = this.userLyricsHtml.split('<br>');
      for (var i = 0; i < HtmlLinesArray.length; i++) {
        var div = document.createElement('div');
        div.innerHTML = HtmlLinesArray[i];
        var text = div.textContent;
        this.linesArray.push(text);
      }
    }
    splitLinesIntoArrayElements.bind(this);

    function insertChoruses(){
      // //find chorus
      // var chorusStart = this.linesArray.indexOf('[Chorus]') + 1;
      // var chorusEnd = this.linesArray.indexOf('[Verse 1]') -1;
      //
      // //insert choruses after required x1 - x5 etc
      // for (var repeat = 0; repeat <= 10; repeat++) {
      //   var index = '[Chorus ' + repeat + 'x]';
      //   if (repeat === 0){
      //     index = '[Chorus]';
      //     console.log(index);
      //   }
      //   var chorusInsert = this.linesArray.indexOf(index) +1;
      //   //insert chorus
      //   console.log(chorusInsert);
      //   if (chorusInsert > 0){
      //     for (var j = 0; j <= repeat; j++) {
      //       for (var i = 0; i <= (chorusEnd-chorusStart); i++) {
      //         this.linesArray.splice(chorusInsert, 0, this.linesArray[chorusEnd - i]);
      //       }
      //     }
      //   }
      // }
    }
    insertChoruses.bind(this);

    function removeEnters(){
      //remove enter (ascii 10)
      for (var i = 0; i < this.linesArray.length; i++) {
        for (var j = 0; j < this.linesArray[i].length; j++) {
          var index = this.linesArray[i][j].indexOf(String.fromCharCode(10));
          if (index > -1) {
            this.linesArray[i] = '';
          }
        }
      }
    }
    removeEnters.bind(this);

    function removeUnwantedStrings(){
      for (var j = 0; j < 100; j++) {
        for (var i = 0; i < this.stringsToRemove.length; i++) {
          var index = this.linesArray.indexOf(this.stringsToRemove[i]);
          if (index > -1) {
            this.linesArray.splice(index, 1);
          }
        }
      }
    }
    removeUnwantedStrings.bind(this);

  },

  createLyricSpans: function createLyricSpans(){
    //creating array of line divs elements this.function create spans and line divs
    for (var i = 0; i < this.linesArray.length; i++) {
      var line = this.linesArray[i];
      var lineDiv = document.createElement('div');
      $(lineDiv).addClass('line' + i);
      var lineTesting = [];
      for (var j = 0; j < line.length; j++) {
        var span = document.createElement('span');
        span.className = this.currentCharacterOnLineIndex;
        this.currentCharacterOnLineIndex += 1;
        $(span).html(line[j]);
        // this.paragraphyHtml.push(span);
        // this.paragraphyTesting.push(span);
        lineTesting.push(span);
        $(lineDiv).append(span);
      }
      // var lineBreak = document.createElement('br');
      // this.paragraphyHtml.push(lineBreak);
      // this.$linesContainer.append(lineDiv);
      this.lineDivs.push(lineDiv);
      this.lineTesting.push(lineTesting);
      this.currentCharacterOnLineIndex = 0;
    }
  },

  getDuration: function getDuration(){
    var mins = $('#mins').val();
    var secs = $('#secs').val();
    this.songDuration = (mins*60000) + (secs*1000);
  },

  handleAudio: function handleAudio(){
    var video = document.createElement('video');
    $(video).attr('controls', 'true');
    var source = document.createElement('source');
    $(source).attr('id', 'song-source');
    $(source).attr('src', $('#youtube-url').val());
    $(source).attr('type', 'video/mp4');
    $(video).append(source);
    $('#game').append(video);
    this.audioStuff();
  },

  displayNewLine: function displayNewLine(){
    this.numberOfLinesOnScreen += 1;
    $('.lyrics-container').prepend(this.lineDivs[this.newLineIndex]);
    this.linesOnScreen.unshift(this.lineDivs[this.newLineIndex]);
    this.currentCharacterIndexes.unshift(0);

    //potential for animate function when llineDivs vs LineTesting resolved
    $(this.lineDivs[this.newLineIndex]).animate({
      top: this.height
    }, this.animationDuration, 'linear' );
  },

  checkLinePosition: function checkLinePosition(){
    var newLine = this.lineDivs[this.newLineIndex];
    var currentLine = this.lineDivs[this.currentLineIndex];
    var top = this.height/(((this.linesArray.length)*this.animationDuration)/this.songDuration);

    //should new line be sent out
    var pix = parseInt($(newLine).attr('style').split(' ')[1].split('p')[0]);
    if(pix > top){
      this.newLineIndex += 1;
      this.displayNewLine();
    }

    //should old line be removed
    pix = parseInt($(currentLine).attr('style').split(' ')[1].split('p')[0]);
    if (pix === 300){
      $(this.lineDivs[this.currentLineIndex]).remove();
      this.linesOnScreen.pop();
      this.currentCharacterIndexes.pop();
      this.currentLineIndex += 1;
      this.numberOfLinesOnScreen -= 1;
    }
  },

  makeKeysListen: function makeKeysListen(){
    $(window).on('keypress', this.keyCallback.bind(this));
  },

  keyCallback: function keyCallback(e){
    this.updateAccuracy();
    this.testIfCorrectKey(e);
  },

  testIfCorrectKey: function testIfCorrectKey(e){
    this.keysPressed += 1;
    for (var i = 0; i < 10; i++) {
      var className = this.linesOnScreen[i].className;
      var selector = '.' + className + ' span:nth-child(' + (game.currentCharacterIndexes[i] + 1) +')';
      if ($(selector)[0].innerHTML === String.fromCharCode(e.which)){
        var currentSpan = $(selector)[0];
        console.log(currentSpan);
        $(currentSpan).addClass('correct');
        console.log(game.currentCharacterIndexes[i]);
        game.currentCharacterIndexes[i] += 1;
        game.hit += 1;
      }
    }
  },

  updateAccuracy: function updateAccuracy(){
    console.log('pressed');
    $('#hit').html('hit: ' + game.hit);
    $('#missed').html('missed: ' + (game.keysPressed - game.hit));
    $('#accuracy').html('accuracy: ' + Math.round((game.hit/game.keysPressed)*100) + '%');
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
  }

};
