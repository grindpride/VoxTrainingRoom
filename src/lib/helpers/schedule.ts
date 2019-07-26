import {EventCoords, EventStyles, EventTimeInterval, ScheduleEvent, TimeSlotsCoords} from "@/lib/types";

export const createDefaultEvent = (): ScheduleEvent => ({
  name: '',
  desc: '',
  startTime: '',
  endTime: '',
  type: '',
  meta: {
    vectorHeight: 0,
    startingPoint: 0
  },
  styles: {
    height: '0px',
    top: '',
  },
  isResizing: false
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

export const getTopAndBottomBorders = (events: ScheduleEvent[] = [], {startingPoint, id}: { startingPoint: number, id: number }) => {
  if (events && events.length) {
    const topBorderEvent = events.filter(ev => ev.id !== id).reduce((prev, curr) => {
      const prevEventBottom = parseInt(prev.styles.top, 10) + parseInt(prev.styles.height, 10);
      const currEventBottom = parseInt(curr.styles.top, 10) + parseInt(curr.styles.height, 10);

      const closeCondition = Math.abs(startingPoint - currEventBottom) < Math.abs(startingPoint - prevEventBottom);

      return closeCondition ? curr : prev;
    });


    let topBorder = parseInt(topBorderEvent.styles.top, 10) + parseInt(topBorderEvent.styles.height, 10);
    topBorder = topBorder < startingPoint ? topBorder : 0;

    const bottomBorderEvent = events.filter(ev => ev.id !== id).reduce((prev, curr) => {
      const prevEventTop = parseInt(prev.styles.top, 10);
      const currEventTop = parseInt(curr.styles.top, 10);

      const closeCondition = Math.abs(startingPoint - currEventTop) < Math.abs(startingPoint - prevEventTop);

      return closeCondition ? curr : prev;
    });

    let bottomBorder = parseInt(bottomBorderEvent.styles.top);
    bottomBorder = bottomBorder > startingPoint ? bottomBorder : 0;

    return {topBorder, bottomBorder}
  }

};
