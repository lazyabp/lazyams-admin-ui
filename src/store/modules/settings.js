import { allSettings } from '@/api/setting'

const state = {
  settings: {}
}

const mutations = {
  SET_SETTINGS: (state, settings) => {
    state.settings = settings
  }
}

const actions = {
  fetchAllSettings({ commit }) {
    return new Promise((resolve, reject) => {
      allSettings().then(response => {
        // console.log('Fetched settings:', response.data)
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
