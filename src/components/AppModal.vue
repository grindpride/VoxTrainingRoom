<template lang="pug">
  .modal__wrapper(v-if="isOpen" @keydown.enter="saveEvent")
    .modal
      .modal__header
        p.modal__title {{hasCurrentEventExist ? 'Edit event' : 'Add event'}}
        i.close-icon(@click="close")
          SvgIcon(name="cross")
      .modal__body
        .form-group
          AppInput(
            placeholder="Type something"
            label="Event name"
            name="eventName"
            :validators="eventNameValidators"
            @error="setError"
            v-model="scheduleEvent.name")
        .form-group
          AppInput(
            placeholder="09:00"
            label="From"
            short="true"
            mask="##:##"
            name="startTime"
            @error="setError"
            :validators="timeValidators"
            :parentError="timeError"
            v-model="scheduleEvent.startTime")
          .hyphen__wrapper
            .hyphen
          AppInput(
            placeholder="23:00"
            label="To"
            short="true"
            @error="setError"
            name="endTime"
            mask="##:##"
            :validators="timeValidators"
            v-model="scheduleEvent.endTime")
        .form-group
          AppSelect(
            :options="eventTypes"
            v-model="scheduleEvent.type"
            label="Event type")
        .form-group
          AppInput(
            placeholder="Your event description"
            label="Event"
            type="textarea"
            name="eventDesc"
            v-model="scheduleEvent.desc")
      .modal__footer
        Button(:label="hasCurrentEventExist ? 'Edit' : 'Save'" type="submit" @click="saveEvent" :disabled="hasError")
        Button(v-if="hasCurrentEventExist" label="Delete" @click="deleteCurrentEvent" type="delete")
        Button(label="Cancel" @click="close")
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {Getter, Mutation, State} from 'vuex-class'

  import SvgIcon from '@/components/ui/SvgIcon.vue';
  import AppInput from '@/components/ui/AppInput.vue';
  import Button from '@/components/ui/Button.vue';
  import AppSelect from "@/components/ui/AppSelect.vue";

  import {EventTimeInterval, ScheduleEvent, SelectOption} from "@/lib/types";
  import {eventNameValidators, timeValidators} from "@/lib/validators";
  import {checkIfEndTimeBigger, checkIfEventsIntersect} from "@/lib/helpers";

  @Component({
    components: {SvgIcon, AppInput, Button, AppSelect}
  })
  export default class AppModal extends Vue {
    @State currentEvent: ScheduleEvent;

    @Getter currentDateEvents: ScheduleEvent[];
    @Getter hasCurrentEventExist: boolean;

    @Mutation resetEvent!: () => void;
    @Mutation addEvent!: (event: ScheduleEvent) => void;
    @Mutation editEvent: (event: ScheduleEvent) => void;
    @Mutation deleteEvent: (event: ScheduleEvent) => void;
    @Mutation setCoords!: ({startTime, endTime}: EventTimeInterval) => void;

    private errors: { [key: string]: string } = {};

    private get hasError(): boolean {
      const error = Object.keys(this.errors).some(k => this.errors[k]) || !!this.timeError;

      return error;
    }

    private isOpen: boolean = false;
    private eventTypes: SelectOption[] = [
      {
        name: 'Management',
        value: 'Management'
      },
      {
        name: 'Design',
        value: 'Design'
      },
      {
        name: 'Finance',
        value: 'Finance'
      }
    ];

    private eventNameValidators = eventNameValidators;
    private timeValidators = timeValidators;

    private get scheduleEvent() {
      return this.currentEvent
    }

    private get timeError(): string {
      if (checkIfEventsIntersect(this.currentDateEvents, this.currentEvent)) {
        return 'Events intersect. Change time';
      }

      if (!checkIfEndTimeBigger(this.currentEvent.startTime, this.currentEvent.endTime)) {
        return "Start time can't be bigger then end time";
      }

      return "";
    }

    mounted(): void {
      this.$root.$on('openmodal', this.open);
    }

    beforeDestroy(): void {
      this.$root.$off('openmodal', this.open);
    }

    deleteCurrentEvent(): void {
      this.deleteEvent(this.currentEvent);

      this.close();
    }

    close(): void {
      this.resetEvent();
      this.isOpen = false;
    }

    open(): void {
      this.isOpen = true;
    }

    setError(error: { [key: string]: string }): void {
      if (error) {
        const key = Object.keys(error)[0];

        if (!this.errors.hasOwnProperty(key)) {
          this.errors = {...this.errors, [key]: ""}
        }

        this.errors[key] = error[key];
      }
    }

    saveEvent(): void {
      if (!this.hasError) {
        this.setCoords({startTime: this.scheduleEvent.startTime, endTime: this.scheduleEvent.endTime});

        if (this.hasCurrentEventExist) {
          this.editEvent(this.scheduleEvent);
        } else {
          this.addEvent(this.scheduleEvent);
        }

        this.resetEvent();

        this.close();
      }
    }
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

    &__title {
      font-weight: 500;
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
