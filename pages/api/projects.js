
const deta = require("./_deta");
const projects_db = deta.Base("projects");

export default async function handler(req, res) {
    const projects = await projects_db.fetch({}, {limit: 20});

    res.json(projects.count > 0 ? projects.items : {})
}
