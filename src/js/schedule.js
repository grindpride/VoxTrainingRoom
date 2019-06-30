import { monthNames } from './consts';

const getMinutes = height => {
  const minutes = Math.round((((100 * height) / 70) * 60) / 100);
  return minutes >= 10 ? minutes : `0${minutes}`;
};
class Schedule {
  static init(calendar) {
    this.calendar = calendar;

    this.events = [];
  }

  static getTitle() {
    return `${this.calendar.currentDate} ${
      monthNames[this.calendar.currentMonth]
    } ${this.calendar.date.getFullYear()}`;
  }

  static getTimeByCoords(timeSlotsCoords, { top, bottom }) {
    const [startTime, endTime] = [top, bottom].map(val => {
      const timeCoords = timeSlotsCoords.reduce((prev, curr) => {
        return prev.top <= val && val >= curr.top ? curr : prev;
      });

      const height = val - timeCoords.bottom + timeCoords.height;
      const minutes = getMinutes(height);

      return timeCoords.time.replace(':00', `:${minutes}`);
    });

    return { startTime, endTime };
  }

  static getCoordsByTime(timeSlotsCoords, startTime, endTime) {
    const [top, bottom] = [startTime, endTime].map(time => {
      const [hour, minutes] = time.split(':');

      const coords = timeSlotsCoords.find(timeSlot => {
        const [slotHour] = timeSlot.time.split(':');

        return hour === slotHour;
      });

      const minutesHeight = Math.round(
        (((100 * parseInt(minutes, 10)) / 60) * 70) / 100
      );

      const coord = coords.top + minutesHeight;

      return coord;
    });

    return { top, bottom };
  }
}

export default Schedule;
