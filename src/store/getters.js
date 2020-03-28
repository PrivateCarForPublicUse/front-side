const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  addRouters: state => state.permission.addRouters,
  userId: state => state.user.userid,
  num: state => state.user.num
}
export default getters
