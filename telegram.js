const TelegramBot = require('node-telegram-bot-api');

const telegramBot = new TelegramBot(process.env.BOT_TOKEN, {polling: true});

function sendTelegramMessage(album){
  
    let artistsString = album.artists[0].name;
  
    for(let i =1; i<album.artists.length; i++){
      artistsString += ", " + album.artists[i].name;
    }
  
    telegramBot.sendPhoto("@rappremierytest", album.images[0].url
    , { caption: `
    <b>📣 Nowy Album! </b>
  
    📀: ${album.name}
    👤: ${artistsString}
  
    ▶️ <a href="${album.external_urls.spotify}" >POSŁUCHAJ</a>
  
    `, parse_mode: "html"});
}

module.exports.sendTelegramMessage = sendTelegramMessage;

