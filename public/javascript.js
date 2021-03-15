// Protect against Injection in input
function escapeHtml(text) {
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  
  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Clear storage onclick
function clearTheUserNameStorage() {
  localStorage.clear();
}


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

var userContry = localStorage.getItem('country', location.country_name);
var userState = localStorage.getItem('state', location.state);
var userCity = localStorage.getItem('city', location.city);
var userLatitude = localStorage.getItem('latitude', location.latitude);
var userLongitude = localStorage.getItem('longitude', location.longitude);
var userIP = localStorage.getItem('ip', location.IPv4);

var user = localStorage.getItem("user");
if (!user) { 
  document.getElementById('inputMessage').disabled = true;
  document.getElementById('buttonMessage').disabled = true;
} else {
  document.getElementById('inputMessage').disabled = false;
  document.getElementById('buttonMessage').disabled = false;
}
window.onload = setTimeout(function(){
  if (!user) {
    // Ask for the username if there is none set already
      // user = prompt('Choose a name:');
      swal("Choose a name:", {
        content: "input",
      })
      .then((value) => {
        user = value
        if (!user) {
          // alert('We cannot work with you like that!');
          swal("WRONG!, You need a Name", "Please refresh page and enter a name", "error");
        } else {
          // Store it in the Local Storafe for future use
          localStorage.setItem('user', user)
          document.getElementById('inputMessage').disabled = false;
          document.getElementById('buttonMessage').disabled = false;
        }
      });
    // if (!user) {
    //   alert('We cannot work with you like that!');
    // } else {
    //   // Store it in the Local Storafe for future use
    //   localStorage.setItem('user', user)
    //   document.getElementById('inputMessage').disabled = false;
    //   document.getElementById('buttonMessage').disabled = false;
    // }
  }
}, 10000);



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

socket.on('location', function (data) {
  $('.user_location').html('<p><strong>' + data.userContry + '</strong></p> ' + data.userState + ' ' + data.userCity + ' ' + data.userLatitude + ' ' + data.userLongitude + ' ' + data.userIP);
});

// When the form is submitted
$('form').submit(function (e) {
  // Avoid submitting it through HTTP
  e.preventDefault();

  // Retrieve the message from the user
  var rawMessage = $(e.target).find('input').val();
  var message = escapeHtml(rawMessage);

  // Send the message to the server
  // socket.emit('message', {
  //   // user: cookie.get('user') || 'Anonymous',
  //   user: localStorage.getItem('user') || 'Incognito',
  //   message: message
  // });

  // Test with alert message empty
  // if(document.getElementById("inputMessage").value.length == 0) {
  //       // alert("Message cannot be empty")
  //       swal("Wrong!", "Message cannot be empty", "error");
  //   } else {
  //     socket.emit('message', {
  //       user: localStorage.getItem('user') || 'Incognito',
  //       message: message
  //     });
  //   }

  // If the message is empty you cannot send socket
  if(document.getElementById("inputMessage").value.length != 0) {
    socket.emit('message', {
      user: localStorage.getItem('user') || 'Incognito',
      message: message
    });
  }

  socket.emit('message', {
    location: userContry
  });

  // Clear the input and focus it for a new message
  e.target.reset();
  $(e.target).find('input').focus();
});
