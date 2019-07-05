<template lang="pug">
  .input__wrapper.select
    label.input_label Event type
    .input.input_select
      input(disabled="true" value="Management")
      i.icon
        include ../../../public/svg/arrow.svg
    .dropdown
      ul
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';

  @Component
  export default class AppSelect extends Vue {

  }
</script>

<style scoped>

</style>
