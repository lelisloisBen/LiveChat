// ./public/javascript.js

// Get the current username from the cookies
// document.cookie = 'cross-site-cookie=bar; SameSite=None; Secure';
// var user = cookie.get('user');
// if (!user) {

//   // Ask for the username if there is none set already
//   user = prompt('Choose a username:');
//   if (!user) {
//     alert('We cannot work with you like that!');
//   } else {
//     // Store it in the cookies for future use
//     cookie.set('user', user);
//   }
// }

var user = localStorage.getItem("user");
window.onload = setTimeout(function(){
  if (!user) {
    // Ask for the username if there is none set already
      user = prompt('Choose a name:');
    if (!user) {
      alert('We cannot work with you like that!');
    } else {
      // Store it in the Local Storafe for future use
      localStorage.setItem('user', user)
    }
  }
}, 5000);



var socket = io();

// The user count. Can change when someone joins/leaves
socket.on('count', function (data) {
  $('.user-count').html(data);
});

// When we receive a message
// it will be like { user: 'username', message: 'text' }
socket.on('message', function (data) {
  $('.chat').append('<p><strong>' + data.user + '</strong>: ' + data.message + '</p>');
});

// When the form is submitted
$('form').submit(function (e) {
  // Avoid submitting it through HTTP
  e.preventDefault();

  // Retrieve the message from the user
  var message = $(e.target).find('input').val();

  // Send the message to the server
  socket.emit('message', {
    // user: cookie.get('user') || 'Anonymous',
    user: localStorage.getItem('user') || 'Incognito',
    message: message
  });

  // Clear the input and focus it for a new message
  e.target.reset();
  $(e.target).find('input').focus();
});
