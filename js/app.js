console.log('js loaded');

$(start);

function start(){
  Redbone.addToNav();
  Lyrics.addToNav();
  Import.addToNav();
  $('#nav li:first').addClass('highlighted');
  Redbone.start();
}

function Game(id, title, userInputs, youtubeUrl, linesArray, mins, secs, songPath) {
  this.songPath = songPath;
  this.id = id;
  this.title = title;
  this.youtubeUrl = youtubeUrl;
  this.mins = mins;
  this.secs = secs;
  this.form = '',
  this.playButton = '',
  this.userLyricsHtml = '',
  this.lyricsString = '',
  this.lineTesting = [],
  this.currentCharacterIndex = 0,
  this.currentCharacterOnLineIndex = 0,
  this.linesArray = linesArray,
  this.lineDivs = [],
  this.newLineIndex = 0,
  this.currentLineIndex = 0,
  this.songDuration = 0,
  this.animationDuration = 30000,
  this.height = 400,
  this.numberOfLinesOnScreen = 0,
  this.linesOnScreen = [],
  this.currentCharacterIndexes = [],
  this.stringsToRemove = ['', '[Verse]', '[Verse 1]', '[Verse 2]', '[Verse 3]', '[Verse 4]', '[Verse 5]', '[Bridge 1]', '[Bridge 2]', '[Pre-Hook]','[Outro]', '[Hook]', '[Intro: Wiley & Bushkin]', '[, Skepta]', '[Ver, Skepta]', '[, Skepta]', '[Ver, Skepta]', '[, Skepta]', '[Ver, Novelist]', '[Pre-Chorus]'],
  this.lyricsContainer = '',
  this.time = 3,
  this.hit = 0;
  this.total = 0;
  this.missed = 0;
  this.complete = 0;
  this.audio;

  this.start = function start(){
    $('audio').remove();
    $('main').html('').attr('id', this.id);
    this.createHtml();
    this.appendHtml();
    this.makeSubmitListen();
    this.makeKeysListen();
    this.audioStuff();
    if (!userInputs) {
      this.makePlayButtonListen();
      this.getLyrics.bind(this)();
      this.parseLyrics.bind(this)();
      this.createLyricSpans.bind(this)();
      this.getDuration.bind(this)();
      this.handleAudio.bind(this)();
    }
  };

  this.addToNav = function addToNav() {
    var nav     = document.getElementById('nav');
    var element = document.createElement('li');
    element.innerHTML = this.title;
    element.addEventListener('click', generate.bind(this));
    function generate(e){
      $('#nav li').removeClass('highlighted');
      $(e.target).addClass('highlighted');
      this.start();
    }
    nav.appendChild(element);
  };

  this.createHtml = function createHtml(){
    this.lyricsContainer = this.createLyricsContainer();
    this.form = this.createForm();
    this.playButton = this.createPlayButton();
  },

  this.appendHtml = function appendHtml(){
    $('main').append([this.playButton, this.lyricsContainer, this.form]);
  },

  this.createPercentageContainer = function(){
    var scoreDiv = document.createElement('div');
    $(scoreDiv).attr('class', 'score');
    var p1 = document.createElement('p');
    $(p1).attr('id', 'hit');
    $(p1).html('hit:');
    var p2 = document.createElement('p');
    $(p2).attr('id', 'missed');
    $(p2).html('missed:');
    var p3 = document.createElement('p');
    $(p3).attr('id', 'percentage');
    $(p3).html('complete:');
    $(scoreDiv).append([p1, p2, p3]);
    return scoreDiv;
  },

  this.createLyricsContainer = function createLyricsContainer(){
    var div = document.createElement('div');
    $(div).addClass('lyrics-container');
    var divContainer = document.createElement('div');
    $(divContainer).addClass('lyrics-container-contianer');
    this.percentageContainer = this.createPercentageContainer();
    $(divContainer).append(this.percentageContainer);
    $(divContainer).append(div);
    return divContainer;
  },

  this.createForm = function createForm(){
    var form = document.createElement('form');
    $(form).attr('id', 'user-form');

    var textarea = document.createElement('textarea');
    $(textarea).attr('placeholder', 'Lyrics Outer HTML');
    $(textarea).attr('id', 'user-lyrics-html');

    var url = document.createElement('input');
    $(url).attr('type', 'text');
    $(url).attr('placeholder', 'Youtube URL');
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

    if (!userInputs){
      $(form).css('display', 'none');
    }

    $(form).append([textarea, url, mins, secs, button]);


    return form;
  },

  this.createPlayButton = function createPlayButton(){
    var playButton = document.createElement('button');
    $(playButton).html('Play').attr('class', 'play');
    $(playButton).attr('id', 'play');
    return playButton;
  },

  this.makePlayButtonListen = function makePlayButtonListen(){
    $('#play').on('click', this.playButtonCallback.bind(this));
  },

  this.playButtonCallback = function playButtonCallback(){
    var duration = this.time;
    var height = this.height;
    $('#play').off();

    $('#play').fadeOut((duration/2)*1000, function(){
      $('.lyrics-container').animate({
        height: height,
        borderWidth: 2
      }, ((duration/2)*1000), 'swing', function(){
        $('.score').fadeIn(1000);
      });
      $('.lyrics-container-contianer').animate({
        marginTop: '5vh'
      }, ((duration/1.4)*1000));
    });

    this.startCountDown();
    this.currentCharacterIndex = 0;
    this.interval2 = setInterval(this.checkLinePosition.bind(this), 500);
  },

  this.startCountDown = function startCountDown(){
    var h2 = document.createElement('h2');
    $(h2).html(this.time);
    $(h2).attr('class', 'count-down');
    $(h2).css('display', 'none');
    $('main').prepend(h2);
    this.countDown();
  },

  this.countDown = function countDown(){
    this.interval = setInterval(this.countDownInterval.bind(this), 1000);
  },

  this.countDownInterval = function countDownInterval(){
    $('.count-down').html(--this.time);
    if (this.time <= 0) {
      clearInterval(this.interval);
      this.displayNewLine();
      if(!userInputs){
        var audio = document.createElement('audio');
        $(audio).attr('src', this.songPath);
        $(audio).attr('id', 'song');
        $(audio).css('display', 'none');
        $('body').append(audio);
        audio.play();
      } else {
        $('video').get(0).play();
      }
      $('.count-down').html('');
    }
  },

  this.makeSubmitListen = function makeSubmitListen (){
    $('#user-form').on('submit', this.submitCallback.bind(this));
  },

  this.submitCallback = function submitCallback(e){
    e.preventDefault();
    this.makePlayButtonListen();
    $('#user-form').fadeOut('fast');
    this.getLyrics.bind(this)();
    this.parseLyrics.bind(this)();
    this.createLyricSpans.bind(this)();
    this.getDuration.bind(this)();
    this.handleAudio.bind(this)();
  },

  this.getLyrics = function getLyrics() {
    this.userLyricsHtml = $('#user-lyrics-html').val();
  },

  this.parseLyrics = function parseLyrics(){

    function makeLyricsAString(){
      var div = document.createElement('div');
      $(div).html(this.userLyricsHtml);
      this.lyricsString = div.textContent;
    }
    makeLyricsAString.bind(this)();

    function splitLinesIntoArrayElements(){
      this.linesArray = [];
      var HtmlLinesArray = this.userLyricsHtml.split('<br>');
      for (var i = 0; i < HtmlLinesArray.length; i++) {
        var div = document.createElement('div');
        div.innerHTML = HtmlLinesArray[i];
        var text = div.textContent;
        this.linesArray.push(text);
      }
    }
    if (userInputs){
      splitLinesIntoArrayElements.bind(this)();
    }

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
    removeEnters.bind(this)();

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
    removeUnwantedStrings.bind(this)();

  },

  this.createLyricSpans = function createLyricSpans(){
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
        lineTesting.push(span);
        $(lineDiv).append(span);
      }
      this.lineDivs.push(lineDiv);
      this.lineTesting.push(lineTesting);
      this.currentCharacterOnLineIndex = 0;
    }
  },

  this.getDuration = function getDuration(){
    if (userInputs){
      var mins = $('#mins').val();
      var secs = $('#secs').val();
    } else {
      mins = this.mins;
      secs = this.secs;
    }
    this.songDuration = (mins*60000) + (secs*1000);
  },

  this.handleAudio = function handleAudio(){
    var video = document.createElement('video');
    $(video).attr('controls', 'true');
    var source = document.createElement('source');
    $(source).attr('id', 'song-source');
    $(source).attr('height', '0');
    if (userInputs){
      $(source).attr('src', $('#youtube-url').val());
    } else {
      $(source).attr('src', this.youtubeUrl);
    }
    $(source).attr('type', 'video/mp4');
    $(video).append(source);
    $('main').append(video);
    this.audioStuff();
  },

  this.displayNewLine = function displayNewLine(){
    this.numberOfLinesOnScreen += 1;
    $(this.lineDivs[this.newLineIndex]).css('top', -100);
    $('.lyrics-container').prepend(this.lineDivs[this.newLineIndex]);
    this.linesOnScreen.unshift(this.lineDivs[this.newLineIndex]);
    this.currentCharacterIndexes.unshift(0);

    //potential for animate function when llineDivs vs LineTesting resolved
    $(this.lineDivs[this.newLineIndex]).animate({
      top: this.height*1.1
    }, this.animationDuration, 'linear' );
  },

  this.checkLinePosition = function checkLinePosition(){
    if ($('main').attr('id') !== this.id){
      clearInterval(this.interval2);
    } else {
      var newLine = this.lineDivs[this.newLineIndex];
      var currentLine = this.lineDivs[this.currentLineIndex];
      var top = (((this.songDuration/this.linesArray.length)/this.animationDuration)*(this.height*1.2))-100;

      // should new line be sent out
      try {
        var pix = parseInt($(newLine).attr('style').split(' ')[1].split('p')[0]);
      } catch(e) {
        return false;
      }
      if (pix > top) {
        this.newLineIndex += 1;
        this.displayNewLine();
      }

      //should old line be removed
      pix = parseInt($(currentLine).attr('style').split(' ')[1].split('p')[0]);
      if (pix > this.height*1.05){
        this.updatePercentage();
        $(this.lineDivs[this.currentLineIndex]).remove();
        this.linesOnScreen.pop();
        this.currentCharacterIndexes.pop();
        this.currentLineIndex += 1;
        this.numberOfLinesOnScreen -= 1;
      }
    }
  },

  this.makeKeysListen = function makeKeysListen(){
    $(window).on('keypress', this.keyCallback.bind(this));
  },

  this.keyCallback = function keyCallback(e){
    this.testIfCorrectKey(e);
  },

  this.testIfCorrectKey = function testIfCorrectKey(e){
    for (var i = 0; i < this.linesOnScreen.length; i++) {
      var className = this.linesOnScreen[i].className;
      var selector = '.' + className + ' span:nth-child(' + (this.currentCharacterIndexes[i] + 1) +')';
      try {
        if ($(selector)[0].innerHTML === String.fromCharCode(e.which)){
          var currentSpan = $(selector)[0];
          $(currentSpan).addClass('correct');
          this.currentCharacterIndexes[i] += 1;
        }
      } catch(e) {
        return false;
      }
    }
  },

  this.updatePercentage = function updatePercentage(){
    var line = this.linesOnScreen[this.linesOnScreen.length -1];
    var classOfLine = '.' + line.className;
    var allSpans = classOfLine + ' span';
    var correctClass = classOfLine + ' span.correct';
    this.total += $(allSpans).length;
    this.hit += $(correctClass).length;
    this.missed = this.total - this.hit;
    this.complete = this.hit / this.total;
    $('#hit').html('hit: ' + this.hit);
    $('#missed').html('missed: ' + this.missed);
    $('#percentage').html('complete: ' + Math.round(this.complete*100) + '%');
  },

  this.audioStuff = function audioStuff(){
    var videos = document.querySelectorAll('video');
    for (var i = 0, l = videos.length; i < l; i++) {
      var video = videos[i];
      var src = video.src || (function () {
        var sources = video.querySelectorAll('source');
        for (var j = 0, sl = sources.length; j < sl; j++) {
          var source = sources[j];
          var type = source.type;
          var isMp4 = type.indexOf('mp4') !== -1;
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
  };

}


var Redbone = new Game('redbone', 'Chilled', false, 'https://www.youtube.com/watch?v=Kp7eSUU9oy8', [
  'Daylight',
  'I wake up feeling like you won\'t play right',
  'I used to know, but now that shit don\'t feel right',
  'It made me put away my pride',
  'So long',
  'You made a nigga wait for some, so long',
  'You make it hard for a boy like that to know wrong',
  'I\'m wishing I could make this mine, oh',
  'If you want it, yeah',
  'You can have it, oh, oh, oh',
  'If you need it, oooh',
  'We can make it, oh',
  'If you want it',
  'You can have it',
  'But stay woke',
  'Niggas creepin',
  'They gon\' find you',
  'Gon\' catch you sleepin\' (Oooh)',
  'Now stay woke',
  'Niggas creepin',
  'Now dont you close your eyes',
  'Too late',
  'You wanna make it right, but now it\'s too late',
  'My peanut butter chocolate cake with Kool-Aid',
  'I\'m trying not to waste my time',
  'If you want it, oh',
  'You can have it, you can have it',
  'If you need it',
  'You better believe in something',
  'We can make it',
  'If you want it',
  'You can have it, aaaaah',
  'But stay woke',
  'Niggas creepin\'',
  'They gon\' find you',
  'Gon\' catch you sleepin\'',
  'Put your hands up on me',
  'Now stay woke',
  'Niggas creepin\'',
  'Now, don\'t you close your eyes',
  'But stay woke',
  'Niggas creepin\'',
  'They gon\' find you',
  'Gon\' catch you sleepin\', ooh',
  'Now stay woke',
  'Niggas creepin\'',
  'Now, don\'t you close your eyes',
  'Baby get so scandalous, oh',
  'How\'d it get so scandalous?',
  'Oh, oh, baby, you...',
  'How\'d it get...',
  'How\'d it get so scandalous?',
  'Ooh, we get so scandalous',
  'But stay woke',
  'But stay woke'], 5, 27, '../ChildishGambino-Redbone.mp3');

var Lyrics = new Game('lyrics', 'Impossible', false, 'https://www.youtube.com/watch?v=q5jGFujaJ40', [
  'Come off the stage! Move!',
  'They don\'t want to hear you! They don\'t want to hear you!',
  'What, is that what you think? Is that what you think?',
  'Oi blud, calm, calm, calm',
  'Lyrics for lyrics, calm',
  'Yeah, hear me on the radio, wah gwan?',
  'See me on the TV, hi mum',
  'Murk MCs when the mic\'s in my palm',
  'Lyrics for lyrics, calm',
  'Hear me on the radio, wah gwan?',
  'See me on the TV, hi mum',
  'Murk MCs when the mic\'s in my palm',
  'Lyrics for lyrics, calm',
  'Yeah, you got murked last week',
  'Couldn\'t even get a rewind, that\'s peak',
  'Couldn\'t get out your punchlines on time',
  'Now you wanna diss me? Oh blud, what a cheek',
  'Sidewinder, you got air on the roads',
  'Eskimo Dance, you was spitting off-beat',
  'Lord of the Mics, you was spitting that heat',
  'But right now, your bars ain\'t on fleek',
  'You don\'t wanna clash me, you will get murked',
  'Bury MCs six feet in the dirt',
  'I know you saw the police outside',
  'You saw the blood on Devilman\'s shirt',
  'Got rude, that didn\'t work',
  'And your girl looks like she don\'t work',
  'Mental',
  'Man wouldn\'t beat that even if I was burse',
  'Yeah, hear me on the radio, wah gwan?',
  'See me on the TV, hi mum',
  'Murk MCs when the mic\'s in my palm',
  'Lyrics for lyrics, calm',
  'Hear me on the radio, wah gwan?',
  'See me on the TV, hi mum',
  'Murk MCs when the mic\'s in my palm',
  'Lyrics for lyrics, calm',
  'Them man are fake, them man are sus',
  'I\'m the boss these pagans wanna touch',
  'I\'m the kind of boss that the opps gotta rush',
  'Cause I make it ring something like bells on the bus',
  '1 on 1, fair and square, man are fucked',
  'Swinging out my sword, swinging out my nunchuks',
  'Running out of corn? Man\'ll get a gun buck',
  'Tell a pussyhole look sharp, fix up',
  'Where you from? Huh, what\'s wrong?',
  'What\'s going on? Why you got your screwface on?',
  'Dead that, forget that',
  'Diss track? Nobody wanna hear that song',
  'Better get your thinking hats on',
  'You don\'t wanna diss me, that\'s long',
  'Cause I\'m a don, lyrically gone',
  'You want to clash but you\'re gonna get banged on',
  'Yeah, hear me on the radio, wah gwan?',
  'See me on the TV, hi mum',
  'Murk MCs when the mic\'s in my palm',
  'Lyrics for lyrics, calm',
  'Hear me on the radio, wah gwan?',
  'See me on the TV, hi mum',
  'Murk MCs when the mic\'s in my palm',
  'Lyrics for lyrics, calm',
  'Yo, I\'m a king, lyrically ming',
  'You want to clash but you\'re gonna get tucked in',
  'Drew for the buck ting when I bucked him',
  'And in the jawside\'s right where I bucked him',
  'Don\'t really care if you go to gym',
  'Get put down by the lead like drawing',
  'To kick your door in, anybody snoring',
  'When I bore in\'s gonna get a full face',
  'Full of piss you\'re in, deep shit you\'re in',
  'N-O-V-D-D-D that you\'re warring',
  'Not gonna be me that you\'re boring',
  'I\'m gonna jack manaman, take your rings',
  'And all of your bling, Lewisham king',
  'It\'s not a ting to draw the ting if you wanna swing',
  'But if you get jooked, don\'t sing',
  'Not a long ting to do the hype ting',
  'Yeah, hear me on the radio, wah gwan?',
  'See me on the TV, hi mum',
  'Murk MCs when the mic\'s in my palm',
  'Lyrics for lyrics, calm',
  'Hear me on the radio, wah gwan?',
  'See me on the TV, hi mum',
  'Murk MCs when the mic\'s in my palm',
  'Lyrics for lyrics, calm'], 2, 36, '../Lyrics.mp3');


var Import = new Game('import', 'Import', true);
