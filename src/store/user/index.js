import * as firebase from 'firebase'
import { SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } from 'constants';

export default {
  state: {
    user: null
  },
  mutations: {
    registerUserForMeetup (state, payload) {
      const id = payload.id
      if (state.user.registeredMeetups.findIndex(meetup => meetup.id) >= 0 ) {
        return
      }
      state.user.registeredMeetups.push(id)
      state.user.fbKeys[id] = payload.fbKey
    },
    unregisterUserForMeetup (state, payload) {
      const registeredMeetups = state.user.registeredMeetups
      registeredMeetups.splice(registeredMeetups.findIndex(meetup => meetup.id === payload), 1)
      Reflect.deleteProperty(state.user.fbKeys, payload)
    },
    setUser (state, payload) {
      state.user = payload
    }
  },
  actions: {
    registerUserForMeetup ({commit, getters}, payload) {
      commit('setLoading', true)
      const user = getters.user
      firebase.database().ref('/users/' + user.id).child('/registrations/')
        .push(payload)
        .then(data => {
          commit('setLoading', false)
          commit('registerUserForMeetup', {id: payload, fbKey: data.key })
        })
        .catch( error => {
            console.log(error)
            commit('setLoading', false)
          }
        )
    },
    unregisterUserFromMeetup ({commit, getters}, payload) {
      commit('setLoading', true)
      const user = getters.user
      if(!user.fbKeys){
        return
      }
      const fbKey = user.fbKeys[payload]
      firebase.database().ref('/users/' +user.id + '/registrations/').child(fbKey)
        .remove()
        .then (() => {
          commit('setLoading', false)
          commit('unregisterUserForMeetup', payload)
        })
        .catch( error => {
            console.log(error)
            commit('setLoading', false)
          }
        )
    },
    signUserUp ({commit, dispatch}, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            commit('setLoading', false)
            
            const newUser = {
              id: user.uid,
              registeredMeetups: [],
              fbKeys: {}
            }
            commit('setUser', newUser)
            console.log(newUser)
            setTimeout(function() {
              dispatch('storeUser', payload)
            }, 5000)
           
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error)
            console.log(error)
          }
        )
    },
    signUserIn ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            commit('setLoading', false)
            const newUser = {
              id: user.uid,
              registeredMeetups: [],
              fbKeys: {}
            }
            commit('setUser', newUser)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error)
            console.log(error)
          }
        )
    },
    autoSignIn ({commit}, payload) {
      commit('setUser', {
        id: payload.uid, 
        registeredMeetups: [], 
        fbKeys: {}})
    },
    storeUser ({commit, getters}, payload) {
     
      const user = getters.user
      firebase.database().ref('/users/'+ user.id).push(payload)
      .then(data => {
        console.log(data)
        let key = data.key
        commit('setUser', {
          ...user,
          userId: key
        })
        commit('setLoading', false)
      })
      .catch( error => {
          console.log(error)
          commit('setLoading', false)
        }
      )
    },
    fetchUserData ({commit, getters}) {
      commit('setLoading', true)
      firebase.database().ref('/users/' + getters.user.id + '/registrations' ).once('value')
        .then(data => {
          const values = data.val()
          const registeredMeetups = []
          const swappedPairs = {}
          for(let key in values){
            registeredMeetups.push(values[key])
            swappedPairs[values[key]] = key
          }
          const updatedUser = {
            id: getters.user.id,
            registeredMeetups: registeredMeetups,
            fbKeys: swappedPairs
          }
          commit('setLoading', false)
          commit('setUser', updatedUser)
        })
        .catch(
          error => {
            commit('setLoading', false)
            console.log(error)
          }
        )
    },
    fetchUserDetails ({commit, getters}) {
      commit('setLoading', true)
      firebase.database().ref('/users/' + getters.user.id + '/' +getters.user.userId  ).once('value')
        .then(data => {
          const values = data.val()
          
          const users = []
          for (let key in values) {
            const user = values[key]
            user.id = key
            users.push(user)
          }
          commit('setLoading', false)
          commit('setUser', updatedUser)
        })
        .catch(
          error => {
            commit('setLoading', false)
            console.log(error)
          }
        )
    },
    logout ({commit}) {
      firebase.auth().signOut()
      commit('setUser', null)
    }
  },
  getters: {
    user (state) {
      console.log(state.user)
      return state.user
    }
  }
}