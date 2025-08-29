export const pick = (obj, keys) => keys.reduce((acc, k) => (obj[k] !== undefined ? (acc[k] = obj[k], acc) : acc), {});


export const paginateQuery = (query, { page = 1, limit = 12 } = {}) => {
const skip = (Math.max(1, Number(page)) - 1) * Math.max(1, Number(limit));
return query.skip(skip).limit(Math.max(1, Number(limit)));
};