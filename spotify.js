/* SPOTIFY */

const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

const matchingGenres = [
    'polish hip hop', 'polish trap', 'polish alternative rap',
    'polish viral rap', 'polish old school hip hop'
];

async function authorize(){
    const authorizationResponse = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(authorizationResponse.body.access_token);
}

async function getNewReleases(limit, offset){

    await authorize();

    const releases = (await spotifyApi.getNewReleases({country: "PL", limit: limit, offset: offset})).body.albums.items;

    var matchingReleases = [];

    for(const release of releases){

        const artistOfThis = (await spotifyApi.getArtist(release.artists[0].id)).body;

        if( artistOfThis.genres.some( (genre) => matchingGenres.includes(genre) )){

            matchingReleases.push(release);
        }
    }

    return matchingReleases;
}

module.exports.getNewReleases = getNewReleases;

