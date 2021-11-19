// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const fetch = require("node-fetch");
const crypto = require("crypto");

const deta = require("./_deta");
const users_db = deta.Base("users");

export default async function handler(req, res) {
  const access_token = await getTokenFromCode(req.query.code);
  const response = await fetch("https://discord.com/api/users/@me", {
    headers: {
      authorization: `Bearer ${access_token}`,
    },
  });

  const userData = await response.json();

  const guildsResponse = await fetch(
    "https://discord.com/api/users/@me/guilds",
    {
      headers: {
        authorization: `Bearer ${access_token}`,
      },
    }
  );
  const guildsData = await guildsResponse.json();

  // make sure that the user is in the discord guild
  const isInGuild = guildsData.filter(
    (el) => el.id === process.env.DISCORD_GUILD_ID
  );

  if (isInGuild.length === 0) {
    return res
      .status(403)
      .send(
        "You must be in the Execute Big Discord Community first! Visit executebig.org/discord to learn more."
      );
  }

  const data = {
    key: userData.id,
    handle: userData.username + "#" + userData.discriminator,
    email: userData.email,
    avatar:
      "https://cdn.discordapp.com/avatars/" +
      userData.id +
      "/" +
      userData.avatar +
      ".png",
  };

  // create the user record in the database
  const inserted = await users_db.put(data);

  const timestamp = new Date().getTime();

  // hash uid + iat with key for validation
  const v_hash = crypto
    .createHash("sha256")
    .update(userData.id + timestamp + process.env.VALIDATION_KEY)
    .digest("hex");

  // create the cookie
  const cookie = {
    uid: userData.id,
    iat: timestamp,
    v: v_hash,
  };

  // set the cookie
  res.setHeader("Set-Cookie", [
    `uid=${userData.id}; Path=/; HttpOnly; Secure; SameSite=Lax`,
    `iat=${timestamp}; Path=/; HttpOnly; Secure; SameSite=Lax`,
    `v=${v_hash}; Path=/; HttpOnly; Secure; SameSite=Lax`,
  ]);
  res.redirect("/new");
}

async function getTokenFromCode(code) {
  const oauthResult = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    body: new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: process.env.APP_URL + "/api/callback",
      scope: "identify email guilds",
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const oauthData = await oauthResult.json();
  return oauthData.access_token;
}
