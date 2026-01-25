import { getAllSettings } from '@/api/setting'

const state = {
  config: {}
}

const mutations = {
  SET_CONFIG: (state, config) => {
    state.config = config
  }
}

const actions = {
  fetchAll({ commit }) {
    return new Promise((resolve, reject) => {
      getAllSettings().then(response => {
        // console.log('Fetched settings:', response.data)
        commit('SET_CONFIG', response.data)
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
