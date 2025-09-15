import "dotenv/config";
import fetch from "node-fetch";
import express from "express";
import cors from "cors";

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const refreshToken = process.env.REFRESH_TOKEN;

const tokenEndpoint = "https://accounts.spotify.com/api/token";
const currentPlaying = "https://api.spotify.com/v1/me/player/currently-playing";

const topArtists =
  "https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=10";
const topTracks =
  "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10";

async function getAccessToken() {
  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(clientId + ":" + clientSecret).toString("base64"),
    },
    body: "grant_type=refresh_token&refresh_token=" + refreshToken,
  });
  const json = await response.json();
  return json.access_token;
}

async function retrieveListeningData() {
  const access_token = await getAccessToken();
  const response = await fetch(currentPlaying, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + access_token,
    },
  });
  if (response.status != 200) {
    return { playing: false };
  } else {
    const json = await response.json();
    if (json.is_playing) {
      return {
        track: [{ name: json.item.name, url: json.item.external_urls.spotify }],
        artist: [
          {
            name: json.item.artists[0].name,
            url: json.item.artists[0].external_urls.spotify,
          },
        ],
        album: [
          {
            name: json.item.album.name,
            url: json.item.album.external_urls.spotify,
            image: json.item.album.images[0].url,
          },
        ],
        playing: true,
      };
    } else {
      return { playing: false };
    }
  }
}

async function retrieveTopArtists() {
  let topVals = {};
  const accessToken = await getAccessToken();
  const response = await fetch(topArtists, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
  if (response.status != 200) {
    return { error: "true" };
  } else {
    const json = await response.json();
    for (let i = 0; i < 10; i++) {
      topVals[i] = [
        { name: json.items[i].name, url: json.items[i].external_urls.spotify },
      ];
    }
    return topVals;
  }
}

async function getTopTracks() {
  let topVals = {};
  const access_token = await getAccessToken();
  const response = await fetch(topTracks, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + access_token,
    },
  });
  if (response.status != 200) {
    return { status: "error" };
  } else {
    const json = await response.json();
    for (let i = 0; i < 10; i++) {
      let track = "";
      track += json.items[i].name;
      track += " - ";
      track += json.items[i].artists[0].name;
      topVals[i] = [{ name: track, url: json.items[i].external_urls.spotify }];
    }
    return topVals;
  }
}

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("<h1>API Live</h1>");
  res.end();
});

app.get("/now-playing", async (req, res) => {
  try {
    const nowPlayingData = await retrieveListeningData();
    res.json(nowPlayingData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/top-artists", async (req, res) => {
  try {
    const data = await retrieveTopArtists();

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/top-tracks", async (req, res) => {
  try {
    const data = await getTopTracks();
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("*", async (req, res) => {
  res.status(404).json({ error: "Route does not exist" });
});

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
