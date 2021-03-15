const server = require('server');
const { get, socket } = server.router;
const { render } = server.reply;

const updateCounter = ctx => {
  ctx.io.emit('count', Object.keys(ctx.io.sockets.sockets).length);
};

server([
  get('/', ctx => render('index.html')),
  socket('connect', updateCounter),
  socket('disconnect', updateCounter),
  socket('message', ctx => {
    console.log(ctx.data);
    ctx.io.emit('message', ctx.data);
  })
]);

var request = require("request");
var url = "https://geolocation-db.com/json";

request({
    url: url,
    json: true
}, function (error, response, body) {

    if (!error && response.statusCode === 200) {
        console.log(body); 
    }
});
