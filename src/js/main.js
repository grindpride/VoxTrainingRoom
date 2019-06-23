import Calendar from './calendar';
import CalendarUI from './calendar_ui';

const init = () => {
  Calendar.init();
  CalendarUI.init(Calendar);
};

init();
