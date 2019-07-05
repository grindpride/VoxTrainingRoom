<template lang="pug">
  div(id="app")
    AppModal
    LeftSidebar
    EventsSchedule
    RightSidebar
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import LeftSidebar from '@/components/layout/LeftSidebar.vue';
  import EventsSchedule from '@/components/layout/EventsSchedule.vue';
  import RightSidebar from '@/components/layout/RightSidebar.vue';
  import AppModal from '@/components/AppModal.vue';

  @Component({
    components: {
      AppModal,
      LeftSidebar,
      EventsSchedule,
      RightSidebar
    },
  })
  export default class App extends Vue {
    mounted() {
      window.addEventListener('click', this.emitWindowClick);
    }

    beforeDestroy() {
      window.removeEventListener('click', this.emitWindowClick);
    }

    private emitWindowClick(e: Event) {
      this.$root.$emit('window:click', e);
    }
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
