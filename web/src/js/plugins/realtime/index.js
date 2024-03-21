import { _getAjax, _postAjax, _setTimeout } from '../../utils/utils';

let fg = 0;
function read(cb) {
  _getAjax(
    '/user/realtime',
    { flag: fg },
    { load: false, timeout: 30 * 1000, stopErrorMsg: 1 }
  )
    .then((res) => {
      fg = res.data.flag; //更新标识
      read(cb);
      if (res.code == 0) {
        cb && cb(res.data.data);
      }
    })
    .catch((err) => {
      _setTimeout(() => {
        read(cb);
      }, 5000);
    });
}
function send(data) {
  //发送指令
  _postAjax('/user/realtime', { data }, { load: false })
    .then((res) => {})
    .catch((err) => {});
}
const realtime = {
  read,
  send,
};
export default realtime;
