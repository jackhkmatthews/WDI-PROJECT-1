console.log('js loaded');

$(start);


function start() {
  var usersInputs = [];
  var asciiArray1 = [118, 97, 114, 32, 68, 97, 121, 108, 105, 103, 104, 116, 32, 61, 32, 123, 13, 119, 97, 107, 101, 85, 112, 58, 32, 102, 117, 110, 99, 116, 105, 111, 110, 32, 119, 97, 107, 101, 85, 112, 40, 73, 41, 123, 13, 114, 101, 116, 117, 114, 110, 32, 33, 112, 108, 97, 121, 82, 105, 103, 104, 116, 59, 13, 125, 13, 125, 59];
  var currentCharacterIndex = 0;


  for (var i = 0; i < asciiArray1.length; i++) {
    var $span = $(document.createElement('span'));
    $span.html(String.fromCharCode(asciiArray1[i]));
    $span.attr('class', i);
    var $codeBlock = $('.code-block');
    $codeBlock.append($span);
  }

  $(window).on('keypress', function(e){
    // usersInputs.push(e.which);
    if (asciiArray1[currentCharacterIndex] === e.which){
      console.log('pass!');
      $('.' + currentCharacterIndex).css('color', 'green');
      currentCharacterIndex += 1;
    } else {
      console.log('fails');
    }
  });

  console.log(String.fromCharCode(118));

}
