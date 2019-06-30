import ScheduleModal from './schedule_modal';

const getMinutes = height => {
  const minutes = Math.round((((100 * height) / 70) * 60) / 100);
  return minutes >= 10 ? minutes : `0${minutes}`;
};

class ScheduleUI {
  static init(schedule) {
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

    ScheduleModal.init();

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
    let $activeTask = null;

    this.$schedule.addEventListener('mousedown', event => {
      const withinPadding = event.pageY - containerTop <= paddingHeight;

      if (withinPadding) {
        return false;
      }

      if (!$activeTask) {
        $activeTask = document.createElement('div');

        $activeTask.classList.add('schedule-appointemnt__task');
        $activeTask.classList.add('schedule-appointemnt__task_default');

        $activeTask.style.height = 0;

        this.$schedule.appendChild($activeTask);

        startingPoint = event.pageY - containerTop;

        $activeTask.style.top = `${startingPoint + this.$schedule.scrollTop}px`;
      }

      return true;
    });

    this.$schedule.addEventListener('mousemove', e => {
      if ($activeTask) {
        if (
          parseInt(e.pageY - containerTop, 10) < parseInt(startingPoint, 10)
        ) {
          $activeTask.style.top = `${e.pageY -
            containerTop +
            this.$schedule.scrollTop}px`;
        }

        const height = Math.abs(startingPoint - e.pageY + containerTop);

        $activeTask.style.height = `${height}px`;
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

      if ($activeTask) {
        const height = parseInt($activeTask.style.height, 10);

        if (height) {
          const top = parseInt($activeTask.style.top, 10);
          const bottom = top + height;

          const { startTime, endTime } = ScheduleUI.getTimeByCoords({
            top,
            bottom
          });

          ScheduleModal.setTimeInterval(startTime, endTime);
          ScheduleModal.showModal();
        }
      }

      $activeTask = null;
    });
  }

  static getTimeByCoords({ top, bottom }) {
    const [startTime, endTime] = [top, bottom].map(val => {
      const timeCoords = this.timeSlotsCoords.reduce((prev, curr) => {
        return prev.top <= val && val >= curr.top ? curr : prev;
      });

      const height = val - timeCoords.bottom + timeCoords.height;
      const minutes = getMinutes(height);

      return timeCoords.time.replace(':00', `:${minutes}`);
    });

    return { startTime, endTime };
  }
}

export default ScheduleUI;
