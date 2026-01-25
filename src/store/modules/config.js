import { getAllConfigs } from '@/api/config'

const state = {
  configs: {}
}

const mutations = {
  SET_CONFIG: (state, config) => {
    state.configs = config
  }
}

const actions = {
  fetchAll({ commit }) {
    return new Promise((resolve, reject) => {
      getAllConfigs().then(response => {
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
