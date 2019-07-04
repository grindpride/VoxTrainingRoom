<template lang="pug">
  div(id="app")
    LeftSidebar
    Schedule
    RightSidebar
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import LeftSidebar from '@/components/layout/LeftSidebar.vue';
  import Schedule from '@/components/layout/Schedule.vue'
  import RightSidebar from '@/components/layout/RightSidebar.vue'

  @Component({
    components: {
      LeftSidebar,
      Schedule,
      RightSidebar
    },
  })
  export default class App extends Vue {
  }
</script>

<style>
  #app {
    display: grid;
    grid-template-columns: 250px 1fr 400px;
    justify-items: stretch;
    height: 100vh;
  }
</style>
