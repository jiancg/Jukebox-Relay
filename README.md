# Jukebox Relay

An Express server that relays Spotify data like top artists, top tracks, and currently playing to my personal site.

`retrieveListeningData()` Returns information about the currently playing track, including metadata such as track title, artist, and album

`retrieveTopArtists()` the top 10 artists for the current month based on the user’s listening history

`getTopTracks()` for the current month, ranked by play count

## Tech Stack

- [Node.js](https://nodejs.org/en)
- [Node-Fetch](https://www.npmjs.com/package/node-fetch)
- [Express](https://expressjs.com/)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/jiancg/Jukebox-Relay.git
cd Jukebox-Relay
```

### 2. Install dependecies

```bash
npm install
```

### 3. Start The Development Server

```bash
node spotify.js
```
