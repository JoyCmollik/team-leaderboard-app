const express = require('express');
const mongoose = require('mongoose');
const socketio = require('socket.io');

const app = express();

mongoose.connect('mongodb+srv://joy-sji:joy-sji@cluster0.xffnqhw.mongodb.net/leaderboard', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to MongoDB");
});

const playerSchema = new mongoose.Schema({
  name: String,
  points: Number
});

const Player = mongoose.model('Player', playerSchema);

app.use(express.static('public'));

app.get('/players', (req, res) => {
  Player.find().sort({ points: -1 }).exec((err, players) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(players);
    }
  });
});

const server = app.listen(3000, () => {
  console.log('Listening on port 3000');
});

const io = socketio(server);

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('addPlayer', (data) => {
    const player = new Player({ name: data.name, points: 0 });
    player.save().then(() => {
      io.emit('updateLeaderboard');
    });
  });

  socket.on('editPlayer', (data) => {
    Player.updateOne({ _id: data.id }, { name: data.name }).then(() => {
      io.emit('updateLeaderboard');
    });
  });

  socket.on('deletePlayer', (data) => {
    Player.deleteOne({ _id: data.id }).then(() => {
      io.emit('updateLeaderboard');
    });
  });

  socket.on('addPoints', (data) => {
    Player.updateOne({ _id: data.id }, { $inc: { points: data.points } }).then(() => {
      io.emit('updateLeaderboard');
    });
  });
});