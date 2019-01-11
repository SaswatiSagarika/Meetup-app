<template>
  <v-container>
  <v-layout row wrap>
    <v-flex xs12 sm6 class="text-xs-center text-sm-right">
      <v-btn large router to="/meetups" class="info">Explore Meetup</v-btn>
    </v-flex>
    <v-flex xs12 sm6 class="text-xs-center text-sm-left">
      <v-btn large router to="/meetup/new" class="info">Organize Meetup</v-btn>
    </v-flex>
   
  </v-layout>
  <v-layout v-if="loading">
    <v-flex xs12 class="text-xs-center">
    <v-progress-circular :width="7" :size="70" indeterminate color="primary"></v-progress-circular>
    </v-flex>
  </v-layout>
  <v-layout row wrap class="mt-2"  v-if="!loading">
    <v-flex xs12>
      <v-carousel  style="cursor: pointer;" >
        <v-carousel-item 
          v-for="meetup in meetups" 
          :src="meetup.imageUrl" 
          :key="meetup.id"
          >
          <div class="title" @click="onLoadMeetup(meetup.id)">
            {{meetup.title}}
          </div>
          </v-carousel-item>
      </v-carousel>
    </v-flex>
  </v-layout>
  <v-layout row wrap class="mt-2">
    <v-flex xs12 class="text-xs-center">
      <p>join Meetups!!!</p>
     </v-flex>
  </v-layout>
  </v-container>
</template>
<script>
   export default {
    computed: {
      meetups () {
       return this.$store.getters.featuredMeetups
      },
      loading (){
        return this.$store.getters.loading
      }
    },
    methods: {
      onLoadMeetup (id) {
        this.$router.push('/meetups/' + id)
      }
    }
  }
</script>
<style scoped>
.title{
  position: absolute;
  bottom: 50px;
  background-color: rgba(0,0,0,0.5);
  color: white;
  font-size:2rem;
  padding: 20px;
}
</style>
