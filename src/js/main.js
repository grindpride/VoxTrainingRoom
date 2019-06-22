import Calendar from './calendar';
import { monthNames } from './consts';

const $sidebar = document.querySelector('.sidebar-right');
const $calendarTitle = $sidebar.querySelector('.title');

const setTitle = () => {
  $calendarTitle.textContent = `${
    monthNames[Calendar.date.getMonth()]
  } ${Calendar.date.getFullYear()}`;
};

const init = () => {
  Calendar.init();
  Calendar.render();
  setTitle();
};

const switchMonths = event => {
  const { target } = event;
  const { className } = target;

  if (className.includes('arrow_left')) {
    Calendar.setPrevMonth();
  } else if (className.includes('arrow_right')) {
    Calendar.setNextMonth();
  }

  setTitle();
};

init();

$sidebar.addEventListener('click', switchMonths);
