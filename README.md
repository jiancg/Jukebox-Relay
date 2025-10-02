# Jukebox Relay

An Express server that relays Spotify data like top artists, top tracks, and currently playing to my personal site.

## Server Routes

`/now-playing` returns the track that the user is currently listening to

`/top-artists` returns the user's top 10 most listened to artists for the last 4 weeks

`top-tracks` returns the user's top 10 most listened to tracks for the last 4 weeks

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
