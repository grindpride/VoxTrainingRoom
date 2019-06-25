class ScheduleUI {
  static init(schedule) {
    this.$content = document.querySelector('.content');
    this.$schedule = this.$content.querySelector('.content__schedule');
    this.$tasks = this.$schedule.querySelectorAll(
      '.schedule-appointemnt__task'
    );

    this.schedule = schedule;

    ScheduleUI.setTitle();
    ScheduleUI.addScheduleEventListener();
  }

  static setTitle() {
    this.$content.querySelector(
      '.title'
    ).textContent = this.schedule.getTitle();
  }

  static addScheduleEventListener() {
    let startingPoint = 0;
    let top = 0;
    let $activeTask = null;

    Array.from(this.$tasks).forEach(el => {
      el.addEventListener('mousedown', event => {
        if (!$activeTask) {
          $activeTask = document.createElement('div');
          const coords = el.getBoundingClientRect();

          $activeTask.classList.add('schedule-appointemnt__task');
          $activeTask.classList.add('schedule-appointemnt__task_default');

          $activeTask.style.height = 0;

          top = event.clientY - coords.top;

          $activeTask.style.top = `${top}px`;

          event.target.appendChild($activeTask);

          startingPoint = event.clientY;
        }
      });

      el.addEventListener('mousemove', e => {
        if ($activeTask) {
          if (parseInt(e.clientY, 10) < parseInt(startingPoint, 10)) {
            const newTop = e.clientY - e.target.getBoundingClientRect().top;

            $activeTask.style.top = `${newTop}px`;
          }

          const height = Math.abs(startingPoint - e.clientY);

          $activeTask.style.height = `${height}px`;
        }
      });

      el.addEventListener('mouseup', () => {
        $activeTask = null;
      });

      // el.addEventListener('');
    });
  }
}

export default ScheduleUI;
