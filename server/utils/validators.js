export const requireFields = (fields, body) => {
    const missing = fields.filter((f) => !body[f] && body[f] !== 0);
    if (missing.length) {
    const err = new Error(`Missing fields: ${missing.join(', ')}`);
    err.status = 400;
    throw err;
    }
    };


    