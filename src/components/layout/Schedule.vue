<template lang="pug">
  main.schedule
    .schedule__wrapper
      .schedule__header
        h3.schedule__date 22 March 2018
        .schedule__actions
          //input.search
          .search-icon
            SvgIcon(name="search")
          .layout-icon
            SvgIcon(name="layout")
      .schedule__content.vox-scroll
        .schedule-appointemnt(v-for="hour in hours")
          .schedule-appointemnt__time {{hour}}
          .schedule-appointemnt__desc
            .schedule-appointemnt__time-line
            .schedule-appointemnt__task
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import SvgIcon from '@/components/ui/SvgIcon.vue';

  @Component({
    components: {SvgIcon}
  })
  export default class Schedule extends Vue {
    private hours: string[] = [
      "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00",
      "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
    ];

  }
</script>

<style>
  .schedule {
    padding: 0px 80px;

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 80px;
      position: relative;
      background: var(--white);
      top: 0;
      z-index: 3;
      border-bottom: 2px solid var(--gray-3);
    }

    &__date {
      font-size: 20px;
      color: var(--dark-blue-200);
    }

    &__content {
      padding-top: 6px;
      position: relative;
      max-height: calc(100vh - 180px);
      margin-top: 70px;
      margin-bottom: 30px;
    }

    &__actions {
      display: flex;
      align-items: center;
      width: 60px;
      justify-content: space-between;

      svg {
        width: 20px;
        height: 20px;
        stroke: #8998b4;
        cursor: pointer;

        &:hover {
          stroke: var(--dark-blue-100);
        }
      }
    }

    &-appointemnt {
      height: 70px;
      display: flex;
      align-items: center;

      &__desc {
        margin-left: 40px;
        height: 100%;
        width: 100%;
      }

      &__time {
        align-self: flex-start;
        position: relative;
        bottom: 8px;
        font-size: 16px;
        color: #a4b0c3;
        user-select: none;

        &-line {
          height: 1px;
          background: var(--gray-3);
          width: 100%;
        }
      }

      &__task {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        font-size: 18px;
        color: var(--dark-blue-200);
        font-weight: 600;
        width: 100%;
        z-index: 2;
        height: 100%;
        left: 0;

        &_default,
        &_design,
        &_finance,
        &_management {
          position: absolute;
          width: calc(100% - 80px);
          margin-left: 80px;
        }

        &_default {
          opacity: 0.15;
          background: var(--grey-blue);
          border-left: 4px solid var(--dark-blue-100);
        }

        &_finance {
          background: rgba(133, 118, 237, 0.15);
          border-left: 4px solid #8576ed;
        }

        &_design {
          background: rgba(61, 131, 249, 0.15);
          height: 250%;
          border-left: 4px solid #3d83f9;
        }

        &_management {
          background: rgba(238, 165, 124, 0.15);
          border-left: 4px solid #eea57c;
          height: 200%;
        }

        p,
        span {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin-left: 35px;
        }

        p {
          width: 260px;
          font-size: 18px;
        }

        span {
          margin-top: 16px;
          width: 310px;
          font-size: 14px;
          opacity: 0.7;
        }
      }
    }
  }
</style>
