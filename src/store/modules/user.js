import { masterLogin, userLogin, login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  roles: -1,
  userid: -1,
  num: 0,
  userToReviewNum: 0,
  carToReviewNum: 0,
  routeToReviewNum: 0,
  reimburseToReviewNum: 0,
  sumToReviewNum: 0
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_USERID: (state, userid) => {
    state.userid = userid
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 用户登录
  userLogin({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      userLogin({ userName: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.account.token)
        setToken(data.account.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 管理员登录
  masterLogin({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      masterLogin({ masterName: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.account.token)
        setToken(data.account.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        let { isCompanyMaster, name, id } = data

        // roles must be a non-empty array
        if (!isCompanyMaster) { // || roles.length <= 0) {
          isCompanyMaster = -2
          // reject('getInfo: roles must be a non-null array!')
        }
        commit('SET_USERID', id)
        commit('SET_ROLES', isCompanyMaster)
        commit('SET_NAME', name)
        commit('SET_USER_ID', data.userId)
        commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', -1)
        commit('SET_USERID', -1)
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', -1)
      commit('SET_USERID', -1)
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

