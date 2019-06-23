import { monthNames } from './consts';

class Calendar {
  static init() {
    this.date = new Date();
    this.monthDict = {
      prev: 'prev',
      current: 'current',
      next: 'next'
    };

    Calendar.setNewDate();
  }

  static getCalendarTitle() {
    return `${monthNames[this.date.getMonth()]} ${this.date.getFullYear()}`;
  }

  static setNextMonth() {
    this.date.setMonth(this.date.getMonth() + 1);
  }

  static setPrevMonth() {
    this.date.setMonth(this.date.getMonth() - 1);
  }

  static setNewDate() {
    this.currentMonth = this.date.getMonth();
    this.currentDate = this.date.getDate();
  }

  static getDaysInMonth(month = this.date.getMonth()) {
    const date = new Date();

    return new Date(date.getFullYear(), month + 1, 0).getDate();
  }

  static range(start, end) {
    return [...Array(end + 1).keys()].slice(start);
  }

  static getPrevMonthDaysToDisplay(weekday) {
    switch (weekday) {
      case 0:
        return 6;
      case 1:
        return 7;
      default:
        return weekday - 1;
    }
  }

  static getNextMonthDaysToDisplay(weekday) {
    switch (weekday) {
      case 0:
        return 7;
      default:
        return 7 - weekday;
    }
  }

  static getMonthDaysToDisplay() {
    const now = new Date();
    now.setMonth(this.date.getMonth());

    const daysInCurrentMonth = Calendar.getDaysInMonth();

    const prevMonth = new Date(
      new Date().setMonth(now.getMonth() - 1)
    ).getMonth();

    const nextMonth = new Date(
      new Date().setMonth(now.getMonth() + 1)
    ).getMonth();

    const daysInPrevMonth = Calendar.getDaysInMonth(prevMonth);
    const daysInNextMonth = Calendar.getDaysInMonth(nextMonth);

    const firstMonthWeekDay = new Date(now.setDate(1)).getDay();
    const lastMonthWeekday = new Date(now.setDate(daysInCurrentMonth)).getDay();

    const prevMonthDaysToDisplay = Calendar.getPrevMonthDaysToDisplay(
      firstMonthWeekDay
    );
    const lastMonthDaysToDisplay = Calendar.getNextMonthDaysToDisplay(
      lastMonthWeekday
    );

    const prevMonthDays = Calendar.range(1, daysInPrevMonth)
      .slice(-prevMonthDaysToDisplay)
      .map(day => ({
        day,
        month: this.monthDict.prev,
        isCurrentDate:
          prevMonth === this.currentMonth && day === this.currentDate
      }));

    const currentMonthDays = Calendar.range(1, daysInCurrentMonth).map(day => ({
      day,
      month: this.monthDict.current,
      isCurrentDate:
        this.date.getMonth() === this.currentMonth && day === this.currentDate
    }));

    const nextMonthDays = Calendar.range(1, daysInNextMonth)
      .slice(0, lastMonthDaysToDisplay)
      .map(day => ({
        day,
        month: this.monthDict.next,
        isCurrentDate:
          nextMonth === this.currentMonth && day === this.currentDate
      }));

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  }
}

export default Calendar;
