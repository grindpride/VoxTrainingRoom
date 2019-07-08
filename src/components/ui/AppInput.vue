<template lang="pug">
  .input__wrapper(:class="{input_short: short}")
    label.input__label(:for="id") {{label}}
    div.input(:class="{textarea: textarea}" @click="focus")
      input-type(:is="inputType" :placeholder="placeholder" :id="id" ref="inputField")
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import {idGenerator} from "@/lib/helpers";

  const generateId: Function = idGenerator();

  @Component
  export default class AppInput extends Vue {
    @Prop({default: ''}) placeholder: string;
    @Prop() label!: string;
    @Prop() short: boolean;
    @Prop() textarea: boolean;


    private get inputType(): string {
      if (this.textarea) {
        return 'textarea';
      }

      return 'input';
    }

    private get id(): string {
      return `input-${generateId()}`;
    }

    focus(): void {
      this.$refs.inputField.focus();
    }
  }
</script>

<style>
  .input {
    width: 100%;
    display: flex;
    align-items: center;
    border-radius: 4px;
    height: 40px;
    font-size: 12px;
    padding: 10px 16px;
    justify-content: space-between;
    background: var(--white);
    border: 1px solid var(--gray-2);

    &:active,
    &.active,
    &:focus-within,
    &:focus {
      border-color: #6e42fe;
    }

    &__wrapper {
      position: relative;
      width: 100%;
    }

    &__label {
      font-weight: 500;
      font-size: 12px;
      margin-bottom: 8px;
      display: block;
    }

    &_short {
      width: 67px;
    }
  }

  .textarea {
    font-size: 12px;
    padding-top: 16px;
    height: 148px;
  }

</style>
