
const deta = require("./_deta");
const projects_db = deta.Base("projects");

export default async function handler(req, res) {
    const projects = await projects_db.fetch({}, {limit: 20});

    if (projects.count > 0) {
        // fetch user handle of each project and insert into the object
        const userMapped = await Promise.all(projects.items.map(async (project) => {
            const user = await deta.Base("users").fetch(project.user_id);
            return {
                ...project,
                user: user.items[0],
            };
        }))

        res.json(userMapped);
    } else {
        res.json({});
    }
}
