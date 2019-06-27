class ScheduleUI {
  static init(schedule) {
    this.$main = document.querySelector('.main');
    this.$schedule = this.$main.querySelector('.content__schedule');
    this.$tasks = this.$schedule.querySelectorAll(
      '.schedule-appointemnt__task'
    );

    this.schedule = schedule;

    ScheduleUI.setTitle();
    ScheduleUI.addScheduleEventListener();
  }

  static setTitle() {
    this.$main.querySelector('.title').textContent = this.schedule.getTitle();
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
      $activeTask = null;
    });
  }
}

export default ScheduleUI;
