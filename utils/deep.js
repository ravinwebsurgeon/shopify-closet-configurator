export default function checkObjDiffernce(obj1, obj2, path = '') {
  let changes = {};

  const isObject = val => val && typeof val === 'object' && !Array.isArray(val);

  const keys = new Set([...Object.keys(obj1 || {}), ...Object.keys(obj2 || {})]);

  for (let key of keys) {
    const fullPath = path ? `${path}.${key}` : key;
    const val1 = obj1?.[key];
    const val2 = obj2?.[key];

    if (isObject(val1) && isObject(val2)) {
      const diff = checkObjDiffernce(val1, val2, fullPath);
      if (Object.keys(diff).length > 0) {
        changes = { ...changes, ...diff };
      }
    } else if (val1 !== val2) {
      changes[fullPath] = { from: val1, to: val2 };
    }
  }

  return changes;
}
