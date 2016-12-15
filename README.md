#GA WDI24 Project 1 - Typing Karaoke

##Brief

To produce an in browser game using the HTML, CSS, JavaScript and jQuery skills acquired during the first two weeks of the Web Development Immersive course.

##Game

###Overview
I decided to create a music based typing game similar to karaoke where the user can select a song of their choice to test their typing speed.  Hence combining my musical interests with my want to improve my typing ability.

The user is continually displayed the number of characters hit, missed and a completion rate. The aim of the game is to keep this completion rate as near as possible to 100%.

###Screenshots

Home Page
![screen shot 2016-12-14 at 10 03 31](https://cloud.githubusercontent.com/assets/20629455/21177873/f161d160-c1e4-11e6-82c5-96d69390f574.png)

'Chilled' level lyrics waterfall with highlighted characters
![screen shot 2016-12-14 at 10 04 11](https://cloud.githubusercontent.com/assets/20629455/21177872/f1619f42-c1e4-11e6-81b8-10da088712ae.png)

'Impossible' level lyric waterfall
![screen shot 2016-12-14 at 10 04 53](https://cloud.githubusercontent.com/assets/20629455/21177874/f16203b0-c1e4-11e6-94fb-7629d2dff81c.png)

Import form
![screen shot 2016-12-14 at 10 05 08](https://cloud.githubusercontent.com/assets/20629455/21177875/f16704b4-c1e4-11e6-927d-08815ac2d429.png)

###Mechanics
####Importing lyrics
The user is able to copy and paste the outer html of the lyrics they would like to use.

On 'submit' the html:

1. lyric string is split into individual lines by  `<br>` and stored in an array. 
2. Common unwanted elements (e.g '[Chorus]') are removed.
3. each element (line) in the array is split into characters
4. each character is placed into a span
5. each line of spans is stored 



The lyrics of the song are parsed into individual characters and displayed line by line.

Each user key press is then compared to the lines on screen.  If the user types correctly the relevant character is highlighted.


##Wins
key detection
lyric and sound importing
modular

##Known issues to be addressed
footer - no links and floating
header - no link to homepage
css
multiple keys get highlighted
sound sometimes doesnt load
screen sixes mess it up
reset between instances
score
animation between instances
used more for each instead of loops!


##Added features
cycling of colours
different colours for chilled and impossible
song search
social media share
win animation
line timing improvements
responsive
proper app reset between levels
health
flash screen when incorrect key pressed


presentations

say what you enjoyed first!

ideas: virtual pet graph

call backs, sequential functions?

collision logic


