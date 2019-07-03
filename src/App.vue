<template lang="pug">
  div(id="app")
    LeftSidebar
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import LeftSidebar from "@/components/layout/LeftSidebar.vue";

  @Component({
    components: {
      LeftSidebar
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
