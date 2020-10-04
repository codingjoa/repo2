
const map = new Map();
const keySymbol = Symbol('key');

function certification(tid, key) {
  const info = map.get(tid);
  if(!info) return null;
  if(info[keySymbol] === key) return true;
  return false;
}
function setInfo(tid, infos) {
  map.delete(tid);
  map.set(tid, infos);
}
function setKey(tid, key) {
  const info = map.get(tid);
  info && (info[keySymbol] = key);
}
function getInfo(tid) {
  return map.get(tid);
}

module.exports = {
  certification,
  setInfo,
  setKey,
  getInfo
};
