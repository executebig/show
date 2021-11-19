// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const axios = require("axios");

export default function handler(req, res) {
  // redirect to the authorization url
  const redirect = process.env.APP_URL + "/api/callback";
  const scope = encodeURIComponent("identify guilds email");

  const url = `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${redirect}&response_type=code&scope=${scope}`;
  return res.redirect(url);
}
