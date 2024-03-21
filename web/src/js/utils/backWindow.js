let showWindowArr = [];

function add(id, close) {
  remove(id);
  showWindowArr.push({ id, close });
}
function remove(id) {
  showWindowArr = showWindowArr.filter((item) => item.id != id);
}
function back() {
  const obj = showWindowArr.pop();
  if (obj) {
    obj.close();
  }
}
function getValue() {
  return showWindowArr;
}
const backWindow = {
  add,
  remove,
  back,
  getValue,
};

export default backWindow;
