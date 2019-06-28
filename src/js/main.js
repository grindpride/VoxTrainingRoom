import Calendar from './calendar';
import CalendarUI from './calendar_ui';

import Schedule from './schedule';
import ScheduleUI from './schedule_ui';
import Select from './select';

import { categories } from './consts';

const $inputs = document.querySelectorAll('.input');

Array.from($inputs).forEach($el => {
  $el.addEventListener('click', () => {
    const $input = $el.querySelector('input');
    if ($input) {
      $input.focus();
    } else {
      $el.querySelector('textarea').focus();
    }
  });
});

const init = () => {
  Calendar.init();
  Schedule.init(Calendar);
  Select.init(categories);

  ScheduleUI.init(Schedule);
  CalendarUI.init(Calendar, ScheduleUI);
  // setTitle();
};

init();
