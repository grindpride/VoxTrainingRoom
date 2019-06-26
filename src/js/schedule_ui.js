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
    let startingPoint = 0;
    let $activeTask = null;

    this.$schedule.addEventListener('mousedown', event => {
      if (!$activeTask) {
        $activeTask = document.createElement('div');

        $activeTask.classList.add('schedule-appointemnt__task');
        $activeTask.classList.add('schedule-appointemnt__task_default');

        $activeTask.style.height = 0;

        this.$schedule.appendChild($activeTask);

        startingPoint = event.pageY - containerTop;
        $activeTask.style.top = `${startingPoint}px`;

        // console.log({ startingPoint, pageY: event.pageY, containerTop });
      }
    });

    this.$schedule.addEventListener('mousemove', e => {
      if ($activeTask) {
        if (
          parseInt(e.pageY - containerTop, 10) < parseInt(startingPoint, 10)
        ) {
          $activeTask.style.top = `${e.pageY - containerTop}px`;
        }

        console.log($activeTask.style.top);

        const height = Math.abs(startingPoint - e.pageY + containerTop);

        $activeTask.style.height = `${height}px`;
      }
    });

    this.$main.addEventListener('mouseup', () => {
      console.log('ALL RIGHT');
      $activeTask = null;
    });

    // el.addEventListener('');
  }
}

export default ScheduleUI;
