import { monthNames } from './consts';

class Schedule {
  static init(calendar) {
    this.calendar = calendar;
  }

  static getTitle() {
    return `${this.calendar.currentDate} ${
      monthNames[this.calendar.currentMonth]
    } ${this.calendar.date.getFullYear()}`;
  }
}

export default Schedule;
