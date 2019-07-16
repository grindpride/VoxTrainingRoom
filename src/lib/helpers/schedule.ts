import {EventCoords, EventTimeInterval, ScheduleEvent, TimeSlotsCoords} from "@/lib/types";

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

export const hasCoordsIntersect = (coords1: { top: number, height: number }, coords2: { top: number, height: number }): boolean => {
  const coords1Bottom = coords1.top + coords1.height;
  const coords2Bottom = coords2.top + coords2.height;


  return ((coords1.top > coords2.top && coords1.top < coords2Bottom) ||
    (coords1Bottom > coords2.top && coords1.top < coords2.top) ||
    (coords1.top < coords2Bottom && coords1Bottom > coords2Bottom))
};

export const getIntersectingEvents = (events: ScheduleEvent[], event: ScheduleEvent): ScheduleEvent[] | undefined => {
  if (event && events && events.length) {
    const [eventTop, eventHeight] = [event.styles.top, event.styles.height]
      .map(s => parseInt(s, 10));


    return events
      .filter(({styles}) => hasCoordsIntersect({top: eventTop, height: eventHeight}, {
        top: parseInt(styles.top, 10),
        height: parseInt(styles.height, 10)
      }))
  }

  return undefined;
};

export const getClosestIntersectingEvent = (events: ScheduleEvent[], event: ScheduleEvent): ScheduleEvent => {
  if (events && events.length && event) {
    const top = parseInt(event.styles.top, 10);
    const bottom = top + parseInt(event.styles.height, 10);

    return events.reduce((prev, curr) => {
      const prevTop = parseInt(prev.styles.top, 10);
      const currTop = parseInt(curr.styles.top, 10);

      const prevBottom = prevTop + parseInt(prev.styles.height, 10);
      const currBottom = currTop + parseInt(curr.styles.height, 10);

      const closeCondition = Math.abs(top - currTop) < Math.abs(top - prevTop) ||
        Math.abs(bottom - currBottom) < Math.abs(bottom - prevBottom);

      return closeCondition ? curr : prev;

    })
  }

};