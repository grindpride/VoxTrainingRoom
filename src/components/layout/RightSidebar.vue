<template lang="pug">
  aside.calendar__wrapper
    .calendar__header
      .arrow.arrow_left
      h3.calendar__month  {{monthTitle}}
      .arrow.arrow_right
    .calendar
      ul.calendar__weekdays
        li.weekday(v-for="weekday in weekDays") {{weekday}}
      ul.calendar__monthdays
        li.monthday(v-for="{day, isCurrentDate, className} in daysToDisplay" :class="{active: isCurrentDate, [className]: true}")
          span {{day}}
    .categories__wrapper
      p.categories__title Your categories
      .categories
        button.category.category_purple Finance
        button.category.category_orange Management
        button.category.category_pink Design
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {MonthDay} from '@/types/index';

  const monthNames: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  enum MonthTypes {
    Prev = 'prev',
    Current = 'current',
    Next = 'next'
  }

  const getDaysInMonth = (month: number): number => {
    const date = new Date();

    return new Date(date.getFullYear(), month + 1, 0).getDate();
  };

  const range = (start: number, end: number): number[] => {
    return [...Array(end + 1).keys()].slice(start);
  };

  const getPrevMonthDaysToDisplay = (weekday: number): number => {
    switch (weekday) {
      case 0:
        return 6;
      case 1:
        return 7;
      default:
        return weekday - 1;
    }
  };

  const getNextMonthDaysToDisplay = (weekday: number): number => {
    if (weekday === 0) {
      return 7;
    }

    return 7 - weekday;
  };

  @Component({
    components: {}
  })
  export default class RightSidebar extends Vue {
    private weekDays: string[] = ['M', 'T', 'W', 'T', 'F', 'Sat', 'Sun'];
    private date: Date = new Date();

    private get currentMonth(): number {
      return this.date.getMonth();
    }

    private get currentDate(): number {
      return this.date.getDate();
    }

    get monthTitle(): string {
      return `${monthNames[this.date.getMonth()]} ${this.date.getFullYear()}`;
    }


    private get daysToDisplay(): MonthDay[] {
      const now: Date = new Date();
      const month = this.date.getMonth();

      now.setMonth(month);

      const daysInCurrentMonth = getDaysInMonth(month);

      const prevMonth: number = new Date(
        new Date().setMonth(now.getMonth() - 1)
      ).getMonth();

      const nextMonth: number = new Date(
        new Date().setMonth(now.getMonth() + 1)
      ).getMonth();

      const daysInPrevMonth: number = getDaysInMonth(prevMonth);
      const daysInNextMonth: number = getDaysInMonth(nextMonth);

      const firstMonthWeekDay: number = new Date(now.setDate(1)).getDay();
      const lastMonthWeekday: number = new Date(now.setDate(daysInCurrentMonth)).getDay();

      const prevMonthDaysToDisplay: number = getPrevMonthDaysToDisplay(
        firstMonthWeekDay
      );
      const lastMonthDaysToDisplay: number = getNextMonthDaysToDisplay(
        lastMonthWeekday
      );

      const prevMonthDays: MonthDay[] = range(1, daysInPrevMonth)
        .slice(-prevMonthDaysToDisplay)
        .map(day => ({
          day,
          className: MonthTypes.Prev,
          isCurrentDate:
            prevMonth === this.currentMonth && day === this.currentDate
        }));

      const currentMonthDays: MonthDay[] = range(1, daysInCurrentMonth).map(day => ({
        day,
        className: MonthTypes.Current,
        isCurrentDate:
          this.date.getMonth() === this.currentMonth && day === this.currentDate
      }));

      const nextMonthDays: MonthDay[] = range(1, daysInNextMonth)
        .slice(0, lastMonthDaysToDisplay)
        .map(day => ({
          day,
          className: MonthTypes.Next,
          isCurrentDate:
            nextMonth === this.currentMonth && day === this.currentDate
        }));

      return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
    }

  }
</script>

<style>
  .calendar {
    padding: 20px 10px 30px 10px;
    height: 460px;
    font-size: 18px;
    color: var(--white);
    position: relative;

    li {
      width: 24px;
      height: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;

      &.weekday,
      &.monthday.next span,
      &.monthday.prev span {
        opacity: 0.6;
      }

      &.monthday:hover,
      &.monthday.active {
        cursor: pointer;
        background: #3c82f9;
        transform: scale(1.8);
        border-radius: 50%;

        span {
          transform: scale(0.6);
        }
      }
    }

    &__weekdays,
    &__monthdays {
      margin: 0;
      align-items: center;
      padding: 22px 0;
      display: grid;
      grid-column-gap: 14px;
      grid-row-gap: 32px;
      justify-items: center;
      grid-template-columns: repeat(7, 1fr);
    }


    &__wrapper {
      padding: 0px 35px;
      background: rgba(42, 46, 65, 0.7);
    }

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 80px;
      position: relative;
    }

    &__month {
      font-weight: normal;
      font-size: 20px;
      color: var(--white);
    }
  }

  .calendar::after,
  .calendar__header::after {
    content: '';
    width: 100%;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.17) 0% 50%,
      rgba(255, 255, 255, 0.13) 50% 100%
    );
    position: absolute;
    height: 4px;
    bottom: 0;
    opacity: 0.25;
  }

  .categories {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: space-between;

    &__title {
      font-size: 18px;
      color: var(--white);
      margin: 30px 0 30px 0;
    }
  }

  .category {
    padding: 12px 16px;
    height: 45px;
    border-radius: 5px;
    border-width: 0;
    text-transform: uppercase;
    width: 48%;
    font-size: 14px;
    color: var(--white);
    margin-bottom: 20px;

    &_purple {
      background: #8576ed;
    }

    &_orange {
      background: #f39946;
    }

    &_pink {
      background: #ff467e;
    }
  }


</style>
