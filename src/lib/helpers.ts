import {EventCoords, EventTimeInterval, ScheduleEvent, TimeSlotsCoords} from "@/lib/types";

export const getDaysInMonth = (month: number): number => {
  const date: Date = new Date();

  return new Date(date.getFullYear(), month + 1, 0).getDate();
};

export const range = (start: number, end: number): number[] => {
  return [...Array(end + 1).keys()].slice(start);
};

export const getPrevMonthDaysToDisplay = (weekday: number): number => {
  switch (weekday) {
    case 0:
      return 6;
    case 1:
      return 7;
    default:
      return weekday - 1;
  }
};

export const getNextMonthDaysToDisplay = (weekday: number): number => {
  if (weekday === 0) {
    return 7;
  }

  return 7 - weekday;
};

export const idGenerator = (): Function => {
  const ids: string[] = [];

  return function generate(): string {
    const newId: string = Math.random().toString(10).substring(2, 5) + Math.random().toString(10).substring(2, 5);

    if (!ids.includes((newId))) {
      ids.push(newId);
      return newId;
    }

    return generate();
  }
};


export const createDefaultEvent = (): ScheduleEvent => ({
  name: '',
  desc: '',
  startTime: '',
  endTime: '',
  type: '',
  styles: {
    height: '0px',
    display: 'none',
    top: '',
  }
});

const getMinutes = (height: number): string => {
  const minutes = Math.round((((100 * height) / 70) * 60) / 100);
  return minutes >= 10 ? `${minutes}` : `0${minutes}`;
};

export const getTimeByCoords =
  (timeSlotsCoords: TimeSlotsCoords[], {top, bottom}: EventCoords): EventTimeInterval => {
    const [startTime, endTime] = [top, bottom].map(val => {
      const timeCoords = timeSlotsCoords.reduce((prev, curr) => {
        return prev.top <= val && val >= curr.top ? curr : prev;
      });

      const height: number = val - timeCoords.bottom + timeCoords.height;
      const minutes: string = getMinutes(height);

      return timeCoords.time.replace(':00', `:${minutes}`);
    });

    return {startTime, endTime};
  };

export const getCoordsByTime =
  (timeSlotsCoords: TimeSlotsCoords[], {startTime, endTime}: EventTimeInterval): EventCoords => {
    const [top, bottom] = [startTime, endTime].map(time => {
      const [hour, minutes] = time.split(':');

      const coords = timeSlotsCoords.find(timeSlot => {
        const [slotHour] = timeSlot.time.split(':');

        return hour === slotHour;
      }) || {top: 0};

      const minutesHeight = Math.round(
        (((100 * parseInt(minutes, 10)) / 60) * 70) / 100
      );

      const coord = coords.top + minutesHeight;

      return coord;
    });

    return {top, bottom};
  };


export const checkIfEndTimeBigger = (startTime: string, endTime: string): boolean => {
  const [start, end] = [startTime, endTime].map(time => {
    const [hours, minutes] = time.split(':');

    return parseInt(hours, 10) + parseInt(minutes, 10) / 60;
  });

  return end > start;
};

const countTotalMinutes = (timeStr: string): number => {
  return timeStr.split(':')
    .map(t => parseInt(t, 10))
    .reduce((hour, minute) => hour + (minute / 60))
};

export const checkIfEventsIntersectByTime = (events: ScheduleEvent[], event: ScheduleEvent): boolean => {
  if (event && events && events.length) {
    const [startTimeTotalMinutes, endTimeTotalMinutes] = [event.startTime, event.endTime].map(countTotalMinutes);

    return events.some(({startTime, endTime, id}) => {
      const [startMinutes, endMinutes] = [startTime, endTime].map(countTotalMinutes);

      return id !== event.id && ((startTimeTotalMinutes > startMinutes && startTimeTotalMinutes < endMinutes) ||
        (endTimeTotalMinutes > startMinutes && startTimeTotalMinutes < startMinutes) ||
        (startTimeTotalMinutes < endMinutes && endTimeTotalMinutes > endMinutes))
    })
  }

  return false;
};

export const checkIfEventsIntersectByCoords = (events: ScheduleEvent[], event: ScheduleEvent): boolean => {
  if (event && events && events.length) {
    const [eventTop, eventHeight] = [event.styles.top, event.styles.height]
      .map(s => parseInt(s, 10));

    const eventBottom = eventTop + eventHeight;

    return events.some(({styles, id}) => {
      const [top, height] = [styles.top, styles.height].map(str => parseInt(str, 10));
      const bottom = top + height;


      return ((eventTop > top && eventTop < bottom) ||
        (eventBottom > top && eventTop < top) ||
        (eventTop < bottom && eventBottom > bottom))
    })
  }

  return false;
};
