const express = require('express');
const telegram = require('./telegram.js');
const spotify = require('./spotify.js');
const database = require('./database.js');

async function sendReleasesNotifications(offset) {

  // get new releases from spotify
  let albums = await spotify.getNewReleases(3, offset.value);

  // check which albums were already announced
  const foundAlbums = await database.find(albums);

  // keep only unannounced albums
  albums = albums.filter((album) => !foundAlbums.includes(album))

  // send telegram notifications
  albums.forEach((album) => telegram.sendTelegramMessage(album));

  // save just announced albums to database (mark as announced)
  database.write(albums);
}

// set up web app
const app = express();

app.set('port', (process.env.PORT || 5000));

app.get('/', function (req, res) {
  res.send("https://t.me/rap_premiery");
})

// offset used for getting new releases from spotify
// without it api limits could be exceeded
// wrapped in object to pass by reference
var offset = { value: 0 }; 

// interval in miliseconds
const tenMinutes = 1000 * 60 * 10;

app.listen(app.get('port'), function () {

  // set interval for continous releases checking
  setInterval(() => {
    sendReleasesNotifications(offset)

    // only 3 releases at once
    if (offset.value < 9) {
      offset.value += 3;
    }
    else {
      offset.value = 0;
    }

  }
    , tenMinutes);

})





