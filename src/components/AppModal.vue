<template lang="pug">
  .modal__wrapper
    .modal
      .modal__header
        p.modal__title Add event
        i.close-icon
          SvgIcon(name="cross")
      .modal__body
        .form-group
          AppInput(placeholder="Type something" label="Event name")
        .form-group
          AppInput(placeholder="09:00" label="From" short="true")
          .hyphen__wrapper
            .hyphen
          AppInput(placeholder="09:00" label="To" short="true")
        SvgIcon(name="select")
        .form-group
          AppInput(placeholder="Your event description" label="Event" textarea="true")
      .modal__footer
        button.btn.btn_save(type="submit" disabled) Save
        button.btn.btn_cancel Cancel
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import SvgIcon from '@/components/ui/SvgIcon.vue';
  import AppInput from '@/components/ui/AppInput.vue';

  @Component({
    components: {SvgIcon, AppInput}
  })
  export default class AppModal extends Vue {

  }
</script>

<style>
  .modal {
    width: 448px;
    color: #2d3033;
    background: var(--white);
    border-bottom: 1px solid var(--gray-2);
    border-radius: 3px;
    box-shadow: 0px 4px 20px rgba(9, 30, 66, 0.2), 0px 1px 0px var(--gray-2),
    0px -1px 0px var(--gray-2), -1px 0px 0px var(--gray-2),
    1px 0px 0px var(--gray-2);

    &__wrapper {
      position: fixed;
      top: 0;
      left: 0;
      display: flex;
      justify-content: center;
      background: rgba(1, 1, 1, 0.4);
      align-items: center;
      z-index: 10;
      width: 100%;
      height: 100%;
    }

    &__header {
      min-height: 56px;
      font-size: 18px;
      padding: 16px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &__body {
      padding: 24px;
      height: 505px;
      display: grid;
      grid-row-gap: 24px;
      border-top: 1px solid var(--gray-2);
      border-bottom: 1px solid var(--gray-2);
    }

    &__footer {
      padding: 16px 24px;
      display: flex;
      justify-content: flex-start;
      height: 64px;

      :not(:first-child) {
        margin-left: 8px;
      }
    }
  }

  .hidden {
    display: none;
  }

  .close-icon {
    cursor: pointer;
    width: 24px;
    height: 24px;

    svg {
      stroke: none;
    }
  }

  .form-group {
    display: flex;
    align-items: center;
  }

  .hyphen {
    width: 10px;
    height: 1px;
    background: #2d3033;
    position: relative;
    top: 10px;

    &__wrapper {
      margin: 0 8px;
    }
  }
</style>
