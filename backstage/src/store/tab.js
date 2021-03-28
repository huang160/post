import Cookie from 'js-cookie'
export default {
  state: {
    isCollapse: false,
    currentMenu: null,
    menu: []
  },
  mutations: {
    setMenu(state, val) {
      state.menu = val
      Cookie.set('menu', JSON.stringify(val))
    },
    clearMenu(state) {
      state.menu = []
      Cookie.remove('menu')
    },
    addMenu(state, router) {
      if (!Cookie.get('menu')) {
        return
      }
      let menu = JSON.parse(Cookie.get('menu'))
      state.menu = menu
      let currentMenu = {
        path: '/',
        name: 'main',
        component: () => import('@/views/Main'),
        redirect: '/index'
      }
      router.addRoute(currentMenu)
      menu.forEach(item => {
        item.component = () => import(`@/views/${item.url}`)
        router.addRoute('main', item)
      })
    },
    selectMenu(state, val) {
      if (val.name !== 'home') {
        state.currentMenu = val
      } else {
        state.currentMenu = null
      }
    },
    collapseMenu(state) {
      state.isCollapse = !state.isCollapse
    }
  },
  actions: {}
}
