export function getPaginationParams(query) {
  const page = Math.max(parseInt(query.page) || 1, 1);
  const limit = Math.max(parseInt(query.limit) || 12, 1);
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}
