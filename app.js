const telegram = require('./telegram');
const spotify = require('./spotify.js');

async function sendReleasesNotifications(offset) {

  let albums = await spotify.getNewReleases(3, offset.value);

  //albums.forEach((album) => telegram.sendTelegramMessage(album));
}

// wrapped in object to pass by reference
var offset = {value: 0};

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
, 2000);




