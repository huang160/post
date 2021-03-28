import ajax from "./ajax";

// 职位发布
export const reqPosition = (postMsg) => ajax('/posts/postAdd', postMsg, 'POST')
// 职位列表信息
export const reqPositionMsg = () => ajax('/posts/position')
// 职位更改
export const reqUpdatePost = (postMsg) => ajax('/posts/updatepost', postMsg, 'POST')
// 职位信息获取
export const reqPostMsg = (_id) => ajax('/posts/postmsg', {_id})
