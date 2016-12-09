**WDIPROJECT1**

General Assembly Web Development Immersive course project 1 - HTML, CSS and JavaScript Game

**code karaoke**

code blocks pass from the top of the screen to the bottom.

user must type the code before it disappears from the screen.

user receives a percentage score at the end of the game.  similar to guitar hero.

backing track is playing.

code snippets are the lyrics.

lyrics have been converted to code speak.

for example:

Daylight
I wake up feeling like you won't play right<br>
I used to know, but now that shit don't feel right<br>
It made me put away my pride<br>
So long<br>
You made a nigga wait for some, so long<br>
You make it hard for a boy like that to know wrong<br>
I'm wishing I could make this mine, oh<br>

becomes:

~~~var Daylight = {
wakeUp: function wakeUp(I){
    return !playRight;
  }
};

var I = 'used to know';
var thatShit = !feelRight;

function it(){
  me.put('../away', function (pride, res) {
    var bad = pride.feeling;
  });
};

setTimeout(soLong(), 200000);

$('nigga').addEventListener('click', function(){
  setTimeout(function(){
    return SOME
  }, 60000);
});l

var boy.doWrong;
if (haveClimedEverest){
  boy.doWrong = true;
} else {
  boy.doWrong = false
};

var im = {
  wishing: function(){
    mine = this;
  }
};
~~~


needs:

1. light up the letters as the user correctly types them
2. only alows the next character to light up if the previous on has been typed correctly.  If user falls being can reset.
3. congratulation message once the user reaches the end
4. code blocks moving from top to bottom
5. code blocks being written to the dom and then removed?
6. mute button
7. pause button 

nice to have:

1. if user fails to complete a code block can start on the next incoming block / some intelligent logic about when the user is typing which block (number the blocks/unique starting characters
2. two songs with different pages and differently toned designs (light vs dark, easy vs hard)
3. speed up a slow down
4. percentage score at the end
5. sound effects for correct and incorrect key presses
6. box showing what the user has typed, i.e will have to match code exactly
7. score cookie / leader board
8. generate code lyrics from any set of lyrics and allow user input of audio and lyrics.