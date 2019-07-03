<template lang="pug">
  div(id="app")
    h2 Test
    LeftSidebar
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import LeftSidebar from "@/components/LeftSidebar.vue";

@Component({
  components: {
    LeftSidebar
  },
})
export default class App extends Vue {}
</script>

<style>
h2{
    color: red;
}
</style>
