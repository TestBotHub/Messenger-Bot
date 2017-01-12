'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('Hello World');
});

app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'nekonote') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

let _sender;
app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging;
    for (let i=0;i<messaging_events.length;i++) {
        let event = messaging_events[i];
        let sender = event.sender.id;
        if (sender != '634244020111911' && event.message && event.message.text) {
            let text = event.message.text;
            io.emit('command', text);
            sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200));
            _sender = sender;
        }
    }
    res.sendStatus(200);
});

const token = process.env.FB_PAGE_ACCESS_TOKEN;

function sendTextMessage(sender, text) {
    let messageData = {text: text};
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: token},
        method: 'POST',
        json: {
            recipient: {id: sender},
            message: messageData,
        }
    }, function (error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}
//
// app.listen(app.get('port'), function() {
//     console.log('running on port', app.get('port'));
// });

const io = require('socket.io')(
  app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'));
  })
);

io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
    socket.on('result', (data) => {
      sendTextMessage(_sender, data);
    });
});
