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
var todayConnect = new Date();
var dd = String(todayConnect.getDate()).padStart(2, '0');
var mm = String(todayConnect.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = todayConnect.getFullYear();
todayConnect = mm + '/' + dd + '/' + yyyy;

var Contry = localStorage.getItem("country");
var State = localStorage.getItem("state");
var City = localStorage.getItem("city");
var Latitude = localStorage.getItem("latitude");
var Longitude = localStorage.getItem("longitude");
var IP = localStorage.getItem("ip");

var datasLocationConnected = JSON.stringify({
  "username": user,
  "country": Contry,
  "state": State,
  "city": City,
  "latitude": Latitude,
  "longitude": Longitude,
  "ip": IP,
  "message": "connected",
  "saveddate": todayConnect
})

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

          console.log(Contry);

          // fetch('https://headquarter-backend.herokuapp.com/saveMessagesFromLiveChat', {
          //       method: 'POST',
          //       body: datasLocationConnected,
          //       cors: 'no-cors',
          //       headers:{
          //           'Content-Type': 'application/json'
          //       }
          //       }).then(res => res.json())
          //       .then(response => {
          //           console.log(JSON.stringify(response));
          //       })
          //       .catch(error => {
          //           console.log(JSON.stringify(error));
          //       });
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
    sendMessageToDatabase();
  }

  // Clear the input and focus it for a new message
  e.target.reset();
  $(e.target).find('input').focus();
});
