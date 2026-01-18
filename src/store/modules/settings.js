import { getAllPublicSettings } from '@/api/setting'

const state = {
  allSettings: {}
}

const mutations = {
  SET_SETTINGS: (state, settings) => {
    state.allSettings = settings
  }
}

const actions = {
  fetchAllSettings({ commit }) {
    return new Promise((resolve, reject) => {
      getAllPublicSettings().then(response => {
        commit('SET_SETTINGS', response.data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
