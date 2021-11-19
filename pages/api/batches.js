
const deta = require("./_deta");
const batches_db = deta.Base("batches");

export default async function handler(req, res) {
    const batches = await batches_db.fetch({'active': true})

    res.json(batches.count > 0 ? batches.items : {})
}
