import ajax from './ajax'

export const login = admin => ajax('/login', admin, 'POST')
export const register = admin => ajax('/register', admin, 'POST')
export const adminMsg = () => ajax('/adminmsg')
export const admin = (page, username, str) =>
  ajax('/adminList', { page, username, str })
export const update = msg => ajax('/update', msg, 'POST')
export const adminDel = _id => ajax('/del', _id, 'POST')
export const ideMsg = (page, str) => ajax('/idemsg', { page, str })
export const ideUpdate = ({ _id, status, remark }) =>
  ajax('/status', { _id, status, remark }, 'POST')
export const postMsg = (page, str) => ajax('/postmsg', { page, str })
export const postUpdate = ({ _id, status, remark }) =>
  ajax('/postStatus', { _id, status, remark }, 'POST')
