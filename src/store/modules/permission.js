import { constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param permissions
 * @param route
 */
function hasPermission(permissions, route) {
  // console.log(permissions, route)
  if (route.meta && route.meta.permission) {
    return permissions.includes(route.meta.permission)
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param permissions
 */
export function filterAsyncRoutes(routes, permissions) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(permissions, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, permissions)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, obj) {
    const { permissions, menus } = obj // 从这里获取菜单
    return new Promise(resolve => {
      const accessedRoutes = filterAsyncRoutes([], permissions)
      const newAccessedRoutes = accessedRoutes.concat(menus) // 将基础菜单与获取的菜单合并，左侧菜单才会渲染
      commit('SET_ROUTES', newAccessedRoutes || [])
      resolve(newAccessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
