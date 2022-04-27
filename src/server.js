/*
 * Initialise Express
 */
const express = require('express');
const path = require('path');
const Pusher = require('pusher');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(express.static(path.join(__dirname)));
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
/*
 * Initialise Pusher
 */
const pusher = new Pusher({
  appId: "1401885",
  key: "cbcaeb94965a2f834945",
  secret: "24d40329eddc30a0217a",
  cluster: "us2",
  useTLS: true
});

app.set('PORT', process.env.PORT || 5000);

app.get('/', (req,res) => {  
  res.sendFile('/public/index.html', {root: __dirname});
});
let numOfVotes = 0;
app.get('/vote', (req, res) => {
  numOfVotes += 1;
  pusher.trigger('counter', 'vote', {votes: numOfVotes});
  res.status(200).send();
});
app.get('/curr-vote', (req, res) => {
  pusher.trigger('counter', 'vote', {votes: numOfVotes});
  res.status(200).send();
})

/*
 * Run app
 */
app.listen(app.get('PORT'), () => { console.log(`App listening on port ${app.get('PORT')}!`)});