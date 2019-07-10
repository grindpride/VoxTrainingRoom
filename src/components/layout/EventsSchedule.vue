<template lang="pug">
  main.schedule
    .schedule__wrapper
      .schedule__header
        h3.schedule__date {{dateTitle}}
        .schedule__actions
          //input.search
          .search-icon
            SvgIcon(name="search")
          .layout-icon
            SvgIcon(name="layout")
      .schedule__content.vox-scroll(
        ref="scheduleContainer"
        @mousedown.left="startEventSelection"

        @mouseup="stopEventSelection")
        .event(v-for="hour in hours" ref="slots")
          .event__time {{hour}}
          .event__desc
            .event__time-line
            .event__task
        .event__task(
          v-for="(event, ind) in currentDateEvents"
          :class="{[event.type.toLowerCase()]: true}"
          :style="event.styles")
          p {{event.name}}
          span {{event.desc}}
        .event__task.default(:style="currentEvent.styles")
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {State, Getter, Mutation} from 'vuex-class'

  import SvgIcon from '@/components/ui/SvgIcon.vue';
  import {EventCoords, ScheduleEvent, TimeSlotsCoords} from "@/lib/types";

  // @mousemove="setEventPosition"
  @Component({
    components: {SvgIcon}
  })
  export default class EventsSchedule extends Vue {
    @State currentEvent: ScheduleEvent;
    @State timeSlotsCoords: TimeSlotsCoords | null = null;

    @Getter dateTitle: string;
    @Getter currentDateEvents: ScheduleEvent[];

    @Mutation setTimeInterval!: ({top, bottom}: EventCoords) => void;
    @Mutation setTimeSlotCoords!: (timeSlotCoords: TimeSlotsCoords[]) => void;

    $refs!: {
      scheduleContainer: Element,
      slots: Element[]
    };

    private isCreatingEvent: boolean = false;
    private scheduleContainer: HTMLElement | null = null;
    private containerTop: number = 0;
    private paddingHeight: number = 0;
    private startingPoint: number = 0;
    private currentScrollTop: number = 0;
    private currentMousePositionY: number = 0;
    private mouseTrackStartPoint: number = 0;
    private startScrollTop: number = 0;
    private lastScrollTop: number = 0;
    private currentEventHeight: number = 0;
    private currentEventTop: number = 0;
    private startDirection: string = 'top';

    private hours: string[] = [
      "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00",
      "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
    ];

    private getTimeSlotsCoords(): TimeSlotsCoords[] {
      const coords = this.$refs.slots.map(($el: Element, ind: number) => {
        let {top}: { top: number } = $el.getBoundingClientRect();
        const {height}: { height: number } = $el.getBoundingClientRect();

        top -= this.containerTop;
        top = Math.ceil(top);

        return {
          top,
          height,
          bottom: top + height,
          time: this.hours[ind]
        };
      });

      return coords;
    }


    private setEventPosition(e: MouseEvent) {
      const isScrollEvent = e.type === 'scroll';
      this.currentScrollTop = this.scheduleContainer.scrollTop;

      if (this.isCreatingEvent) {
        // const mouseTrackValue = e.pageY - this.mouseTrackStartPoint;
        // console.log(mouseTrackValue)

        // const scrollTopDiff2: number = this.currentScrollTop - this.startScrollTop;
        const scrollTopDiff: number = this.currentScrollTop - this.lastScrollTop;
        console.log(scrollTopDiff);
        const currentScrollDirection = scrollTopDiff > 0 ? 'bottom' : 'top';



        if (this.scheduleContainer) {
          const withinPadding: boolean = e.pageY - this.containerTop <= this.paddingHeight;

          if (withinPadding) {
            return false;
          }

          if (currentScrollDirection === 'bottom') {
            console.log('bottom');
            /* console.log('bottom')
             if (e.pageY - this.containerTop < this.startingPoint) {
               console.log('popadaet')
               this.currentEvent.styles.top = `${e.pageY -
               this.containerTop +
               this.scheduleContainer.scrollTop}px`;
             }*/
            const scrollTrack = scrollTopDiff;
            console.log('scrollTrack', scrollTrack);
            if(this.startDirection === currentScrollDirection){
              this.currentEventHeight = this.currentEventHeight + scrollTrack;
            }else{
              console.log('else')
              this.currentEventHeight = this.currentEventHeight - scrollTrack;
              this.currentEventTop = this.currentEventTop - scrollTrack;
            }
            this.currentEvent.styles.top = `${this.currentEventTop}px`;
            this.currentEvent.styles.height = `${this.currentEventHeight}px`;
          } else {
            console.log('top');
            // if (e.pageY - this.containerTop < this.startingPoint) {
            //   this.currentEvent.styles.top = `
            //     ${e.pageY -
            //     this.containerTop +
            //     this.scheduleContainer.scrollTop}px
            //   `;
            // }

            const scrollTrack = Math.abs(scrollTopDiff);
            this.currentEventTop = this.currentEventTop - scrollTrack;
            this.currentEventHeight = this.currentEventHeight + scrollTrack;

            this.currentEvent.styles.top = `${this.currentEventTop}px`;
            this.currentEvent.styles.height = `${this.currentEventHeight}px`;

          }

          // this.startDirection = currentScrollDirection;

          console.log('currentEventHeight ', this.currentEventHeight);

          if(this.currentEventHeight < 0){
            this.startDirection = currentScrollDirection;
          }

          this.lastScrollTop = this.currentScrollTop;
        }
      }
    }

    private startEventSelection(e: MouseEvent) {
      // console.log(e.clientY, e.pageY)
      this.mouseTrackStartPoint = e.pageY;

      this.startScrollTop = this.scheduleContainer.scrollTop;
      this.lastScrollTop = this.scheduleContainer.scrollTop;

      const withinPadding: boolean = e.pageY - this.containerTop <= this.paddingHeight;

      if (withinPadding) {
        return false;
      }

      if (!this.isCreatingEvent) {
        this.isCreatingEvent = true;
        this.currentEvent.styles.display = 'flex';
        this.startingPoint = e.pageY - this.containerTop + this.currentScrollTop;
        this.currentEventTop = this.startingPoint;

        this.currentEvent.styles.top = `${this.startingPoint}px`;
      }

      return true;
    }

    private stopEventSelection() {
      const height: number = parseInt(this.currentEvent.styles.height, 10);

      if (height) {
        const top: number = parseInt(this.currentEvent.styles.top, 10);
        const bottom: number = top + height;

        this.setTimeInterval({top, bottom});

        if (this.isCreatingEvent) {
          // this.$root.$emit('openmodal');
        }
      }

      this.isCreatingEvent = false;
    }

    beforeDestroy() {
      (<HTMLElement>this.scheduleContainer).removeEventListener('scroll', this.setEventPosition);
    }

    mounted(): void {
      // this.scheduleContainer
      this.scheduleContainer = <HTMLElement>this.$refs.scheduleContainer;
      this.scheduleContainer.addEventListener('scroll', this.setEventPosition);
      this.containerTop = this.scheduleContainer.getBoundingClientRect().top;
      this.paddingHeight = parseInt(
        <string>window.getComputedStyle(this.scheduleContainer).paddingTop,
        10
      );

      const timeSlotsCoords = this.getTimeSlotsCoords();
      this.setTimeSlotCoords(timeSlotsCoords);

      this.startingPoint = 0;

    }
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
      font-weight: normal;
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
  }

  .event {
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
    }

    &__time-line {
      height: 1px;
      background: var(--gray-3);
      width: 100%;
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

      &.default,
      &.design,
      &.finance,
      &.management {
        position: absolute;
        width: calc(100% - 80px);
        margin-left: 80px;
      }

      &.default {
        opacity: 0.15;
        background: var(--grey-blue);
        border-left: 4px solid var(--dark-blue-100);
      }

      &.finance {
        background: rgba(133, 118, 237, 0.15);
        border-left: 4px solid #8576ed;
      }

      &.design {
        background: rgba(61, 131, 249, 0.15);
        height: 250%;
        border-left: 4px solid #3d83f9;
      }

      &.management {
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
        max-width: 260px;
        font-size: 18px;
      }

      span {
        margin-top: 16px;
        max-width: 310px;
        font-size: 14px;
        opacity: 0.7;
      }
    }
  }
</style>
