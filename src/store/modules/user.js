import { login } from '@/api/auth'
import { getCurrentUser } from '@/api/user'
import { weixinCallback, googleCallback } from '@/api/socialite'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  userId: '',
  name: '',
  avatar: '',
  email: '',
  info: {},
  roles: [],
  permissions: [],
  menus: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_INFO: (state, info) => {
    state.info = info
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  },
  SET_MENUS: (state, menus) => {
    state.menus = menus
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ userName: username.trim(), password: password }).then(response => {
        // console.log(response)
        const { data } = response
        commit('SET_TOKEN', data.token)
        commit('SET_USERID', data.userId)
        setToken(data.token)
        commit('SET_NAME', username.trim())
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  weixinLogin({ commit }, code) {
    return new Promise((resolve, reject) => {
      weixinCallback({ code: code }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        commit('SET_USERID', data.userId)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  googleLogin({ commit }, code) {
    return new Promise((resolve, reject) => {
      googleCallback({ code: code }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        commit('SET_USERID', data.userId)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      getCurrentUser().then(response => {
        const data = response.data
        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { user, roleIds, permissions, menus } = data

        const roles = roleIds.map(String)

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_NAME', user.nickName)
        commit('SET_AVATAR', user.avatar)
        commit('SET_EMAIL', user.email)
        commit('SET_INFO', user)
        commit('SET_ROLES', roles)
        commit('SET_PERMISSIONS', permissions)
        commit('SET_MENUS', menus)

        // 获取动态路由
        dispatch('permission/generateRoutes', roles, { root: true })

        resolve({ ...data, roles })
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, dispatch }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_AVATAR', '')
      commit('SET_EMAIL', '')
      commit('SET_USERID', '')
      commit('SET_INFO', {})
      commit('SET_ROLES', [])
      commit('SET_PERMISSIONS', [])
      commit('SET_MENUS', [])
      removeToken()
      resetRouter()

      // reset visited views and cached views
      // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_AVATAR', '')
      commit('SET_EMAIL', '')
      commit('SET_USERID', '')
      commit('SET_INFO', {})
      commit('SET_ROLES', [])
      commit('SET_PERMISSIONS', [])
      commit('SET_MENUS', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
