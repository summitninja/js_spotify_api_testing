import SpotifyApi from "./lib/SpotifyApi.js";
import express from "express";
const app = express();

const client = new SpotifyApi(process.env.CLIENT_ID, process.env.CLIENT_SECRET);

app.get("/", async (req, res) => {
  var tracks = await client.Search("track:never give you up", ["track"]);
  res.send(tracks);
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
