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
