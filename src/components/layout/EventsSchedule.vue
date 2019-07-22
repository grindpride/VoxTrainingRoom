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
        @mousedown.left="startEventSelection")
        .event(v-for="hour in hours" ref="slots")
          .event__time {{hour}}
          .event__desc
            .event__time-line
            .event__task
        .event__wrapper(
          v-for="(event) in currentDateEvents"
          :style="event.styles")
          .event__mover_up(
            @mousedown.stop="resizeEvent($event, 'top', event)"
            :class="{'hover': parseInt(currentEvent.styles.height) === 0.}")
          .event__mover_down(
            @mousedown.stop="resizeEvent($event, 'bottom', event)"
            :class="{'hover': parseInt(currentEvent.styles.height) === 0}")
          .event__task(
            @mousedown.left.stop="editEvent(event)"
            :class="{[event.type.toLowerCase()]: true, 'hover': parseInt(currentEvent.styles.height) === 0}")
            p(v-show="parseInt(event.styles.height, 10) > 24") {{event.name}}
            span(v-if="event.desc && parseInt(event.styles.height, 10) > 51") {{event.desc}}
        .event__wrapper(:style="currentEvent.styles")
          .event__task(:class="currentEvent.type ? currentEvent.type.toLowerCase() : 'default'")
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {Getter, Mutation, State} from 'vuex-class'

  import SvgIcon from '@/components/ui/SvgIcon.vue';
  import {EventCoords, EventStyles, ScheduleEvent, TimeSlotsCoords} from "@/lib/types";
  import {getClosestIntersectingEventCoords, getIntersectingEvents} from "@/lib/helpers/schedule";
  import {range} from "@/lib/helpers/common";
  import {nineAMTopPosition} from "@/lib/consts";
  import {ResizingType} from '@/lib/enums';

  @Component({
    components: {SvgIcon}
  })
  export default class EventsSchedule extends Vue {
    @State currentEvent: ScheduleEvent;

    @Getter dateTitle: string;
    @Getter currentDateEvents: ScheduleEvent[];

    @Mutation setTimeInterval!: ({top, bottom}: EventCoords) => void;
    @Mutation setTimeSlotCoords!: (timeSlotCoords: TimeSlotsCoords[]) => void;
    @Mutation setEventStyles!: ({top, height}: { top: string, height: string }) => void;
    @Mutation setCurrentEvent!: (event: ScheduleEvent) => void;

    @Mutation setStartingPoint!: (value: number) => void;
    @Mutation setVectorHeight!: (value: number) => void;

    $refs!: {
      scheduleContainer: Element,
      slots: Element[]
    };

    private isCreatingEvent: boolean = false;
    private isIntersecting: boolean = false;

    private scheduleContainer: HTMLElement | null = null;
    private containerTop: number = 0;
    private paddingHeight: number = 0;
    private currentScrollTop: number = 0;
    private lastMousePoint: number = 0;

    private startingPoint: number = 0;
    private lastScrollTop: number = 0;
    private vectorHeight: number = 0;

    private closestIntersectingEventCoords: { top: number, height: number } | undefined;

    private resizing: ResizingType | false;

    private hours: string[] = range(0, 23).map(n => `${n >= 10 ? n : `0${n}`}:00`);

    beforeDestroy() {
      (<HTMLElement>this.scheduleContainer).removeEventListener('scroll', this.handleScroll);

      this.$root.$off('window:mousemove', this.handleMouseMove);
      this.$root.$off('window:mouseup', this.stopEventSelection);
    }

    mounted(): void {
      this.scheduleContainer = <HTMLElement>this.$refs.scheduleContainer;
      this.scheduleContainer.addEventListener('scroll', this.handleScroll);
      this.containerTop = this.scheduleContainer.getBoundingClientRect().top;
      this.paddingHeight = parseInt(
        <string>window.getComputedStyle(this.scheduleContainer).paddingTop,
        10
      );

      const timeSlotsCoords = this.getTimeSlotsCoords();
      this.setTimeSlotCoords(timeSlotsCoords);

      (<HTMLElement>this.scheduleContainer).scrollTo(0, nineAMTopPosition);

      this.$root.$on('scrolllschedule', () => {
        (<HTMLElement>this.scheduleContainer).scrollTo(0, nineAMTopPosition);
      });

      this.$root.$on('window:mousemove', this.handleMouseMove);
      this.$root.$on('window:mouseup', this.stopEventSelection);
    }

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

    private getEventStyles(): { top: string, height: string } {
      let newTop = 0;
      let newHeight = 0;

      if (!this.resizing) {
        newTop = this.currentEvent.meta.vectorHeight > 0 ? this.currentEvent.meta.startingPoint
          : this.currentEvent.meta.startingPoint - Math.abs(this.currentEvent.meta.vectorHeight);

        newHeight = Math.abs(this.currentEvent.meta.vectorHeight);
      } else {
        const eventTop = parseInt(this.currentEvent.styles.top, 10);

        if (this.resizing === ResizingType.Top) {
          newTop = this.currentEvent.meta.vectorHeight > 0
            ? eventTop + this.vectorHeight
            : this.currentEvent.meta.startingPoint;

          newHeight = Math.abs(this.currentEvent.meta.vectorHeight)

        } else if (this.resizing === ResizingType.Bottom) {
          newTop = this.currentEvent.meta.vectorHeight > 0
            ? this.currentEvent.meta.startingPoint
            : eventTop + this.vectorHeight;

          newHeight = Math.abs(this.currentEvent.meta.vectorHeight)
        }
      }

      const intersectingEvents = getIntersectingEvents(this.currentDateEvents,
        {top: newTop, height: newHeight, id: <number>this.currentEvent.id}
      );

      if (intersectingEvents && intersectingEvents.length) {
        this.closestIntersectingEventCoords = (this.closestIntersectingEventCoords ||
          getClosestIntersectingEventCoords(intersectingEvents, {
            top: newTop,
            height: newHeight,
            id: <number>this.currentEvent.id
          })) as EventStyles & { id: number };


        if (newTop !== parseInt(this.currentEvent.styles.top, 10)) {
          const topOffset: number = Math.abs(newTop
            - (this.closestIntersectingEventCoords.top + this.closestIntersectingEventCoords.height));

          newTop += topOffset;
          newHeight =  this.currentEvent.meta.startingPoint - newTop;
        } else {
          const heightOffset = (newTop + newHeight) - this.closestIntersectingEventCoords.top;
          newHeight -= heightOffset
        }

      } else {
        this.closestIntersectingEventCoords = undefined;
      }

      return {top: `${newTop}px`, height: `${newHeight}px`}
    }

    private resetCurrentEventStyles() {
      const newStyles = this.getEventStyles();

      this.setEventStyles(newStyles);
    }

    private handleScroll() {
      this.currentScrollTop = (<HTMLElement>this.scheduleContainer).scrollTop;
      const scrollDiff = this.currentScrollTop - this.lastScrollTop;
      if (this.isCreatingEvent) {

        if (!this.resizing) {
          const vectorHeight = this.currentEvent.meta.vectorHeight + scrollDiff;

          this.setVectorHeight(vectorHeight);
        } else {
          this.vectorHeight = scrollDiff;

          const newVH = this.currentEvent.meta.vectorHeight - (this.resizing === ResizingType.Top ? scrollDiff : -scrollDiff);

          this.setVectorHeight(newVH);
        }

        this.lastScrollTop = this.currentScrollTop;

        this.resetCurrentEventStyles();
      }
    }

    private handleMouseMove(e: MouseEvent) {
      if (this.isCreatingEvent) {

        if (e.pageY > (<HTMLElement>this.scheduleContainer).getBoundingClientRect().bottom) {
          return false;
        }

        const currentMousePoint = e.pageY;
        const mouseDiff = currentMousePoint - this.lastMousePoint;

        if (!this.resizing) {
          const vectorHeight = this.currentEvent.meta.vectorHeight + mouseDiff;

          this.setVectorHeight(vectorHeight);
        } else {
          this.vectorHeight = mouseDiff;

          const newVH = this.currentEvent.meta.vectorHeight - (this.resizing === ResizingType.Top ? mouseDiff : -mouseDiff);

          this.setVectorHeight(newVH);
        }

        this.lastMousePoint = currentMousePoint;

        this.resetCurrentEventStyles();
      }
    }

    private startEventSelection(e: MouseEvent) {
      this.vectorHeight = 0;
      this.lastMousePoint = e.pageY;
      this.lastScrollTop = (<HTMLElement>this.scheduleContainer).scrollTop;

      const withinPadding: boolean = e.pageY - this.containerTop <= this.paddingHeight;

      if (withinPadding) {
        return false;
      }

      if (!this.isCreatingEvent) {
        this.isCreatingEvent = true;
        const startingPoint = e.pageY - this.containerTop + this.currentScrollTop;
        this.setStartingPoint(startingPoint);
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
          if (this.resizing) {
            this.resizing = false;
          }

          this.setVectorHeight(Math.abs(this.currentEvent.meta.vectorHeight));

          this.$root.$emit('openmodal');
        }
      }

      this.isIntersecting = false;
      this.isCreatingEvent = false;
    }

    private editEvent(event: ScheduleEvent) {
      this.setCurrentEvent({...event});

      this.$root.$emit('openmodal');
    }

    private resizeEvent(e: MouseEvent, resizingFrom: ResizingType, event: ScheduleEvent) {
      this.resizing = resizingFrom;
      this.vectorHeight = 0;

      this.lastMousePoint = e.pageY;
      this.lastScrollTop = (<HTMLElement>this.scheduleContainer).scrollTop;
      this.isCreatingEvent = true;

      this.setCurrentEvent({...event});

      const startingPoint = this.resizing === ResizingType.Top
        ? parseInt(this.currentEvent.styles.top, 10) + parseInt(this.currentEvent.styles.height, 10)
        : parseInt(this.currentEvent.styles.top);


      this.setStartingPoint(startingPoint);
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

    &__wrapper {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      font-size: 18px;
      color: var(--dark-blue-200);
      font-weight: 600;
      z-index: 2;
      height: 100%;
      position: absolute;
      width: calc(100% - 80px);
      margin-left: 80px;
      left: 0;

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

    &__task {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;

      &.default,
      &.design,
      &.finance,
      &.management {
        cursor: pointer;

        &:hover {
          transition: background 0.3s ease;
        }
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
        border-left: 4px solid #3d83f9;
      }

      &.management {
        background: rgba(238, 165, 124, 0.15);
        border-left: 4px solid #eea57c;
      }

      &.finance.hover:hover {
        background: rgba(133, 118, 237, 0.3);
      }


      &.design.hover:hover {
        background: rgba(61, 131, 249, 0.3);
      }


      &.management.hover:hover {
        background: rgba(238, 165, 124, 0.3);
      }
    }


    &__mover_up,
    &__mover_down {
      width: calc(100% + 4px);
      height: 20px;
      left: -4px;
      position: absolute;

      &.hover {
        cursor: n-resize;
      }

      &.hover:hover ~ .event__task {
        transition: background 0.3s ease;
      }
    }

    &__mover_up {
      top: -10px;

      &.hover:hover ~ .finance {
        background: linear-gradient(to bottom, rgba(133, 118, 237, 0.30) 30%, rgba(133, 118, 237, 0.15));
      }

      &.hover:hover ~ .management {
        background: linear-gradient(to bottom, rgba(238, 165, 124, 0.30) 30%, rgba(238, 165, 124, 0.15));
      }

      &.hover:hover ~ .design {
        background: linear-gradient(to bottom, rgba(61, 131, 249, 0.30) 30%, rgba(61, 131, 249, 0.15));
      }
    }

    &__mover_down {
      bottom: -10px;

      &.hover:hover + .finance {
        background: linear-gradient(to bottom, rgba(133, 118, 237, 0.15) 70%, rgba(133, 118, 237, 0.30));
      }

      &.hover:hover + .management {
        background: linear-gradient(to bottom, rgba(238, 165, 124, 0.15) 70%, rgba(238, 165, 124, 0.30));
      }

      &.hover:hover + .design {
        background: linear-gradient(to bottom, rgba(61, 131, 249, 0.15) 70%, rgba(61, 131, 249, 0.30));
      }
    }
  }
</style>
