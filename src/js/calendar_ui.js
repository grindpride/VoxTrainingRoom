class CalendarUI {
  static init(calendar, scheduleUI) {
    this.$sidebar = document.querySelector('.sidebar-right');
    this.$calendarTitle = this.$sidebar.querySelector('.title');
    this.$calendar = this.$sidebar.querySelector('.calendar');
    this.$daysUl = this.$calendar.querySelector('.calendar__monthdays');

    this.calendar = calendar;

    this.$scheduleUI = scheduleUI;

    CalendarUI.addSwitchDateListener();
    CalendarUI.addSwitchMonthListener();
    CalendarUI.render();
    this.$calendarTitle.textContent = this.calendar.getCalendarTitle();
  }

  static addSwitchMonthListener() {
    this.$sidebar.addEventListener('click', event => {
      const { target } = event;
      const { className } = target;

      if (className.includes('arrow_left')) {
        CalendarUI.changeToPrevMonth();
      } else if (className.includes('arrow_right')) {
        CalendarUI.changeToNextMonth();
      }

      this.$calendarTitle.textContent = this.calendar.getCalendarTitle();
    });
  }

  static changeToPrevMonth() {
    this.calendar.setPrevMonth();
    CalendarUI.render();
  }

  static changeToNextMonth() {
    this.calendar.setNextMonth();
    CalendarUI.render();
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
          CalendarUI.changeToPrevMonth();
        } else if (currentTarget.className.includes('next')) {
          CalendarUI.changeToNextMonth();
        }

        const $currentDate = document.querySelector('.active');

        if ($currentDate) {
          $currentDate.classList.remove('active');
        }

        this.calendar.date.setDate(date);

        const $newCurrentDate = Array.from(
          document.querySelectorAll('.monthday.current')
        ).find(el => el.textContent === date);

        if ($newCurrentDate) {
          $newCurrentDate.classList.add('active');
          this.calendar.setNewDate();
          this.$scheduleUI.setTitle();
          this.$scheduleUI.clearEvents();
        }
      }
    });
  }

  static render() {
    const $fragment = document.createDocumentFragment();
    const daysToDisplay = this.calendar.getMonthDaysToDisplay();

    [...daysToDisplay].forEach(({ day, isCurrentDate, month }) => {
      const $li = document.createElement('li');
      const $span = document.createElement('span');

      $span.textContent = day;

      $li.classList.add('monthday');
      $li.classList.add(month);

      if (isCurrentDate && month === 'current') {
        $li.classList.add('active');
      }

      $li.appendChild($span);

      $fragment.appendChild($li);
    });

    this.$daysUl.innerHTML = '';
    this.$daysUl.appendChild($fragment);
  }
}

export default CalendarUI;
