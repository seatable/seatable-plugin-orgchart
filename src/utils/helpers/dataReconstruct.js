export const dataReconstruct = (data) => {
  const _data = [];
  const keys = data.columns.map(c => c.key);

  data.rows.map(r => _data.push({...r, ...keys.map(k => ({[k]: r[k] }) )}));

  return _data;
};