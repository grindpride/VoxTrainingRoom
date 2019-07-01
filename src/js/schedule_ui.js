class ScheduleUI {
  static init(schedule, scheduleModal) {
    this.$main = document.querySelector('.main');
    this.$schedule = this.$main.querySelector('.content__schedule');
    this.$tasks = this.$schedule.querySelectorAll(
      '.schedule-appointemnt__task'
    );

    this.$timeSlots = this.$schedule.querySelectorAll(
      '.schedule-appointemnt__time'
    );

    this.timeSlotsCoords = ScheduleUI.getTimeSlotsCoords();

    this.schedule = schedule;
    this.$activeTask = null;
    this.scheduleModal = scheduleModal;

    ScheduleUI.setTitle();
    ScheduleUI.addScheduleEventListener();
  }

  static setTitle() {
    this.$main.querySelector('.title').textContent = this.schedule.getTitle();
  }

  static getTimeSlotsCoords() {
    const containerTop = this.$schedule.getBoundingClientRect().top;

    const timeSlots = Array.from(this.$timeSlots).map($el => $el.textContent);

    const coords = Array.from(this.$tasks).map(($el, ind) => {
      let { top } = $el.getBoundingClientRect();
      const { height } = $el.getBoundingClientRect();

      top -= containerTop;
      top = Math.ceil(top);

      return {
        top,
        height,
        bottom: top + height,
        time: timeSlots[ind]
      };
    });

    return coords;
  }

  static addScheduleEventListener() {
    const containerTop =
      this.$schedule.getBoundingClientRect().top + window.scrollY;
    const paddingHeight = parseInt(
      window.getComputedStyle(this.$schedule).paddingTop,
      10
    );

    let startingPoint = 0;

    this.$schedule.addEventListener('mousedown', event => {
      const withinPadding = event.pageY - containerTop <= paddingHeight;

      if (withinPadding) {
        return false;
      }

      if (!this.$activeTask) {
        this.$activeTask = document.createElement('div');

        this.$activeTask.classList.add('schedule-appointemnt__task');
        this.$activeTask.classList.add('schedule-appointemnt__task_default');

        this.$activeTask.style.height = 0;

        this.$schedule.appendChild(this.$activeTask);

        startingPoint = event.pageY - containerTop;

        this.$activeTask.style.top = `${startingPoint +
          this.$schedule.scrollTop}px`;
      }

      return true;
    });

    this.$schedule.addEventListener('mousemove', e => {
      if (this.$activeTask) {
        if (
          parseInt(e.pageY - containerTop, 10) < parseInt(startingPoint, 10)
        ) {
          this.$activeTask.style.top = `${e.pageY -
            containerTop +
            this.$schedule.scrollTop}px`;
        }

        const height = Math.abs(startingPoint - e.pageY + containerTop);

        this.$activeTask.style.height = `${height}px`;
      }
    });

    /*     this.$schedule.addEventListener('scroll', e => {
      if ($activeTask) {
        console.log(e.target.scrollTop);
        const height = Math.abs(e.target.scrollTop + containerTop);
        // console.log({ height });
        $activeTask.style.height = `${height}px`;
      }
    }); */

    this.$main.addEventListener('mouseup', () => {
      const $activeTasks = document.querySelectorAll(
        '.schedule-appointemnt__task_default'
      );

      if ($activeTasks) {
        Array.from($activeTasks).forEach(el => {
          if (el && el.style && !parseInt(el.style.height, 10)) {
            el.remove();
          }
        });
      }

      if (this.$activeTask) {
        const height = parseInt(this.$activeTask.style.height, 10);

        if (height) {
          const top = parseInt(this.$activeTask.style.top, 10);
          const bottom = top + height;

          const { startTime, endTime } = this.schedule.getTimeByCoords(
            this.timeSlotsCoords,
            {
              top,
              bottom
            }
          );

          this.scheduleModal.setTimeInterval(startTime, endTime);
          this.scheduleModal.showModal();
        }
      }
    });
  }

  static addScheduleEvent(startTime, endTime, event, eventDesc, category) {
    const categoryLC = category.toLowerCase();
    this.schedule.events.push({ startTime, endTime, event, category });
    const { top, bottom } = this.schedule.getCoordsByTime(
      this.timeSlotsCoords,
      startTime,
      endTime
    );

    this.$activeTask.style.top = `${top}px`;
    this.$activeTask.style.height = `${bottom - top}px`;

    if (categoryLC) {
      this.$activeTask.classList.remove('schedule-appointemnt__task_default');
      this.$activeTask.classList.add(
        `schedule-appointemnt__task_${categoryLC}`
      );
    }

    const $fragment = document.createDocumentFragment();

    const $span = document.createElement('span');
    const $p = document.createElement('p');

    $p.textContent = event;
    $span.textContent = eventDesc;

    $fragment.appendChild($p);
    $fragment.appendChild($span);

    this.$activeTask.appendChild($fragment);
    this.$activeTask = null;
  }

  static clearEvents() {
    const $eventElements = [
      this.$schedule.querySelectorAll('.schedule-appointemnt__task_default'),
      this.$schedule.querySelectorAll('.schedule-appointemnt__task_management'),
      this.$schedule.querySelectorAll('.schedule-appointemnt__task_design'),
      this.$schedule.querySelectorAll('.schedule-appointemnt__task_finance')
    ];

    $eventElements.forEach($elList => {
      Array.from($elList).forEach($el => $el.remove());
    });
  }
}

export default ScheduleUI;
