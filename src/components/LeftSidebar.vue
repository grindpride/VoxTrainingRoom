<template lang="pug">
  aside.left-sidebar
    h2.left-sidebar__title Menu {{itemsCount}}
    ul
      li(v-for="{name, icon} in sidebarItems" @click="clickItem") {{name}}
    input(v-model="inputValue")
    button(@click="addElement") add
    div {{inputValue}}
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";

  interface SidebarItem {
    name: string;
    icon?: string | number;
  }

  @Component({
    components: {}
  })
  export default class LeftSidebar extends Vue {
    private inputValue: string = "";

    private sidebarItems: SidebarItem[] = [
      {name: "Calendar", icon: "calendar"},
      {name: "Document", icon: 2},
      {name: "Events"}
    ];

    private clickItem = function (e: Event) {
      console.log(e.target);
    };

    private input(e: Event) {
      this.inputValue = e.target.value;
    }

    private addElement() {
      this.sidebarItems.push({name: this.inputValue});
      this.inputValue = "";
    }

    private get itemsCount(): number {
      return this.sidebarItems.filter(item => item.name.length > 3).length;
    }
  }
</script>

<style lang="postcss">
  .left-sidebar {
    color: yellow;

    &__title {
      color: green;
    }
  }
</style>
