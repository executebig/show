
const deta = require("./_deta");
const projects_db = deta.Base("projects");

export default async function handler(req, res) {
    let last_retrieved = req.query.last;
    const projects = await projects_db.fetch({}, {limit: 6, last: last_retrieved});
    const next_project = await projects_db.fetch({}, {limit: 1, last: projects.items[projects.count - 1].key});

    if (projects.count > 0) {
        last_retrieved = projects.items[projects.count - 1].key;

        // fetch user handle of each project and insert into the object
        const userMapped = await Promise.all(projects.items.map(async (project) => {
            const user = await deta.Base("users").fetch(project.user_id);
            return {
                ...project,
                user: user.items[0],
            };
        }))

        res.json({
            projects: userMapped,
            last_retrieved,
            hasNext: next_project && next_project.count > 0,
        });
    } else {
        res.json({});
    }
}
