<template>
  <v-container>
    <v-layout row wrap align-center>
      <v-flex xs12 md6 offset-md3>
        <div class="text-xs-center">
          <v-avatar size="125px">
            <img
              class="img-circle elevation-7 mb-1"
              src="https://raw.githubusercontent.com/vuetifyjs/docs/dev/static/doc-images/lists/1.jpg"
            >
          </v-avatar>
          <div class="headline">John <span style="font-weight:bold">Carter</span></div>
          <div class="subheading text-xs-center grey--text pt-1 pb-3">Lorem ipsum dolor sit amet</div>
        </div>
      </v-flex>
    </v-layout>
    <v-layout row wrap align-center>
      <v-flex xs12 md6 offset-md3>
        {{email}}
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  data () {
    return {
      tabs:[
          'Home', 'About', 'Other'
        ],
    }
  },
  computed: {
    email () {
      return !this.$store.getters.user ? false : this.$store.getters.user.email
    }
  },
  created () {
    this.$store.dispatch('fetchUserData')
  }
}
</script>
<style scoped>

</style>
