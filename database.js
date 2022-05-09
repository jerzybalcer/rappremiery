const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_CONN_STR);

async function write(albums) {
  try {
    await client.connect();

    const announced = client.db("RapPremiery").collection("announced");

    for(const album of albums){
        await announced.insertOne({name: album.name, artist: album.artists[0].name});
    }

  } finally {
    await client.close();
  }
}

async function find(albums) {
    try {
      await client.connect();
  
      const announced = client.db("RapPremiery").collection("announced");
  
      let foundAlbums = [];

      for(const album of albums){
          
          const response = await announced.findOne({name: album.name, artist: album.artists[0].name});

          if(response != null){
              foundAlbums.push(album);
          }
      }

      return foundAlbums;
  
    } finally {
      await client.close();
    }
  }

module.exports.write = write;
module.exports.find = find;