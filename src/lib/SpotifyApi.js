import axios from "axios";

class SpotifyApi {
  constructor(client_id = "", client_secret = "") {
    this.client_id = client_id;
    this.client_secret = client_secret;
    this.access_token = ""; // access token used to make request
    this.access_token_last_updated = 0; // time that access token was recived
    this.access_token_life_span = 0; // how long the token is good for
  }

  async _RefreshAccessToken() {
    //get a new access token, sets the class values and returns it
    return await axios
      .post(
        "https://accounts.spotify.com/api/token",
        "grant_type=client_credentials",
        {
          headers: {
            Authorization:
              "Basic " + btoa(this.client_id + ":" + this.client_secret),
          },
        }
      )
      .then((response) => {
        // validate that request status is 200 and data contains json
        // handle any errors
        this.access_token = response.data.access_token;
        this.access_token_last_updated = Date.now();
        this.access_token_life_span = response.data.expires;
        return response.data.access_token;
      });
  }

  async _GetAccessToken() {
    // checks if access token exists and is not expired and returns a valid access token or gets a new one

    // check if token is none then refresh it
    if (this.access_token == "") {
      return await this._RefreshAccessToken();
    }

    // Check if token has expired
    if (
      this.access_token_last_updated + this.access_token_life_span <
      Date.now()
    ) {
      return await this._RefreshAccessToken();
    }

    // The current token thats cached is likely valid so return it
    return this.access_token;
  }

  async Search(query, type) {
    return await axios
      .get("https://api.spotify.com/v1/search", {
        headers: {
          Authorization: "Bearer " + (await this._GetAccessToken()),
        },
        params: { q: query, type: type.join(",") },
      })
      .then((response) => {
        // error handling
        return response.data;
      });
  }
}
// export it as default for easy importing
export default SpotifyApi;
