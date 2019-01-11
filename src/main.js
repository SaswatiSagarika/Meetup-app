import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import * as firebase from 'firebase'
import 'vuetify/dist/vuetify.min.css'
import {store} from './store'
import DateFilter from './filters/date'
import AlertCmp from './components/Shared/Alert.vue'
import EditMeetupDetailsDialog from './components/Meetup/Edit/EditMeetupDetailDialog.vue'
import EditMeetupDateDialog from './components/Meetup/Edit/EditMeetupDateDialog.vue'
import EditMeetupTimeDialog from './components/Meetup/Edit/EditMeetupTimeDialog.vue'
import RegisterDialog from './components/Meetup/Registration/RegisterDialog.vue'

Vue.use(Vuetify, { theme: {
  primary: '#D32F2F',
  secondary: '#BDBDBD',
  accent: '#FF5252',
  error: '#D50000',
  info: '#42A5F5',
  success: '#81C784',
  warning: '#FFA000'
}})


Vue.config.productionTip = false

Vue.filter('date', DateFilter)
Vue.component('app-alert', AlertCmp)
Vue.component('app-edit-meetup-details-dailog', EditMeetupDetailsDialog)
Vue.component('app-edit-meetup-date-dialog', EditMeetupDateDialog)
Vue.component('app-edit-meetup-time-dialog', EditMeetupTimeDialog)
Vue.component('app-meetup-register-dialog', RegisterDialog)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created () {
    firebase.initializeApp ({
      apiKey: 'AIzaSyBNcBgI9x7mTYlDI40lVoEI_sibRAK7RW0',
      authDomain: 'devmeetup-vuejs-2bce9.firebaseapp.com',
      databaseURL: 'https://devmeetup-vuejs-2bce9.firebaseio.com',
      projectId: 'devmeetup-vuejs-2bce9',
      storageBucket: 'gs://devmeetup-vuejs-2bce9.appspot.com'
    })
    
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('autoSignIn', user)
        this.$store.dispatch('fetchUserData')
        this.$store.dispatch('fetchUserDetails')
        
      }
    })
    this.$store.dispatch('loadMeetups')
  }
})
