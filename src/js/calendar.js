class Calendar {
  static init() {
    this.$calendar = document.querySelector('.calendar');
    this.date = new Date();

    this.monthDict = {
      prev: 'prev',
      current: 'current',
      next: 'next'
    };

    Calendar.setNewDate();
    Calendar.addSwitchDateListener();
  }

  static setNextMonth() {
    this.date.setMonth(this.date.getMonth() + 1);
    Calendar.render();
  }

  static setPrevMonth() {
    this.date.setMonth(this.date.getMonth() - 1);
    Calendar.render();
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

  static render() {
    const $fragment = document.createDocumentFragment();
    const daysToDisplay = Calendar.getMonthDaysToDisplay();

    [...daysToDisplay]
      .reduce(($elems, { day, isCurrentDate, month }, ind) => {
        const isNewWeek = ind === 0 || ind % 7 === 0;

        const $li = document.createElement('li');
        const $span = document.createElement('span');

        $span.textContent = day;

        $li.classList.add('monthday');
        $li.classList.add(month);

        if (isCurrentDate) {
          $li.classList.add('active');
        }

        $li.appendChild($span);

        if (isNewWeek) {
          const $ui = document.createElement('ul');

          $ui.className = 'calendar__monthdays';
          $ui.appendChild($li);

          $elems.push($ui);
        } else {
          const [$ui] = $elems.slice(-1);
          $ui.appendChild($li);
        }

        return $elems;
      }, [])
      .forEach($elem => {
        $fragment.appendChild($elem);
      });

    document
      .querySelectorAll('.calendar__monthdays')
      .forEach(el => el.remove());

    this.$calendar.appendChild($fragment);
  }

  static addSwitchDateListener() {
    const keyClass = 'monthday ';
    this.$calendar.addEventListener('click', ({ target }) => {
      const { className } = target;

      if (
        className.includes(keyClass) ||
        target.parentElement.className.includes(keyClass)
      ) {
        const currentTarget = className.includes(keyClass)
          ? target
          : target.parentElement;
        const date = currentTarget.textContent;

        if (currentTarget.className.includes('prev')) {
          Calendar.setPrevMonth();
        } else if (currentTarget.className.includes('next')) {
          Calendar.setNextMonth();
        }

        const $currentDate = document.querySelector('.active');

        if ($currentDate) {
          $currentDate.classList.remove('active');
        }

        this.date.setDate(date);

        const $newCurrentDate = Array.from(
          document.querySelectorAll('.monthday.current')
        ).find(el => el.textContent === date);

        if ($newCurrentDate) {
          $newCurrentDate.classList.add('active');
          Calendar.setNewDate();
        }
      }
    });
  }
}

export default Calendar;
