export function slugify(name = '', location = '') {
  const slugPart = (s) => s.toString().toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  const a = slugPart(name);
  const b = slugPart(location);
  return b ? `${a}-${b}` : a;
}
