
import { parseCookies } from "../../helpers/";
import crypto from "crypto";

const deta = require("./_deta");
const projects_db = deta.Base("projects");

export default function handler(req, res) {
  // redirect to the authorization url
  const p = req.body;
  const u = parseCookies(req);
  
  // validate user signature
  const v_hash = crypto
    .createHash("sha256")
    .update(u.uid + u.iat + process.env.VALIDATION_KEY)
    .digest("hex");

  if (v_hash !== u.v) {
    return res.status(400).send("Invalid login signature!");
  }

  // create the project
  const project = {
    name: p.name,
    batch: p.batch,
    source: p.source,
    demo: p.demo,
    user: u.uid,
    key: new Date().getTime().toString(),
  }

  // insert the project
  projects_db.put(project);
  res.redirect("/");
}
