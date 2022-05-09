const telegram = require('./telegram.js');
const spotify = require('./spotify.js');
const database = require('./database.js');

async function sendReleasesNotifications(offset) {

  // get new releases from spotify
  let albums = await spotify.getNewReleases(3, offset.value);

  // check which albums were already announced
  const foundAlbums = await database.find(albums);

  // keep only unannounced albums
  albums = albums.filter( (album) => !foundAlbums.includes(album))

  // send telegram notifications
  albums.forEach((album) => telegram.sendTelegramMessage(album));

  // save just announced albums to database (mark as announced)
  database.write(albums);
}

// wrapped in object to pass by reference
var offset = {value: 0};

// set interval for continous releases checking
setInterval(()=>
  {
  sendReleasesNotifications(offset)

  if(offset.value < 9){
    offset.value += 3;
  }
  else{
    offset.value = 0;
  }

  }
, 10000);

