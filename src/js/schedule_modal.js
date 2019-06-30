const timeRe = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

const checkIfEndTimeBigger = (startTime, endTime) => {
  const [start, end] = [startTime, endTime].map(time => {
    const [hours, minutes] = time.split(':');

    return parseInt(hours, 10) + parseInt(minutes, 10) / 60;
  });

  return end > start;
};

class ScheduleModal {
  static init(scheduleUI, select) {
    this.$modal = document.querySelector('.modal-wrapper');
    this.$fromTime = this.$modal.querySelector('.from-time');
    this.$toTime = this.$modal.querySelector('.to-time');
    this.$eventName = this.$modal.querySelector('.event-name');

    this.scheduleUI = scheduleUI;
    this.select = select;

    ScheduleModal.addCloseModalEventHandlers();
    ScheduleModal.addChecValidListeners();
    ScheduleModal.addSaveTaskEventHandlers();
  }

  static cancelEvent() {
    ScheduleModal.scheduleUI.$activeTask.remove();
    ScheduleModal.scheduleUI.$activeTask = null;

    ScheduleModal.hideModal();
  }

  static addCloseModalEventHandlers() {
    this.$modal
      .querySelector('.close-icon')
      .addEventListener('click', ScheduleModal.cancelEvent);

    this.$modal
      .querySelector('.btn_cancel')
      .addEventListener('click', ScheduleModal.cancelEvent);
  }

  static setTimeInterval(startTime, endTime) {
    this.$fromTime.value = startTime;
    this.$toTime.value = endTime;
  }

  static isFormValid() {
    const { value: startTime } = ScheduleModal.$fromTime;
    const { value: endTime } = ScheduleModal.$toTime;
    const { value: eventName } = ScheduleModal.$eventName;

    const isEndTimeAfterStart = checkIfEndTimeBigger(startTime, endTime);

    const isValid =
      timeRe.test(startTime) &&
      timeRe.test(endTime) &&
      eventName &&
      isEndTimeAfterStart;
    ScheduleModal.$modal.querySelector('.btn_save').disabled = !isValid;
  }

  static showModal() {
    ScheduleModal.isFormValid();
    ScheduleModal.$modal.classList.remove('hidden');
  }

  static hideModal() {
    ScheduleModal.$modal.classList.add('hidden');
  }

  static resetModal() {
    ScheduleModal.$eventName.value = '';
  }

  static saveEvent() {
    const { value: fromTime } = ScheduleModal.$fromTime;
    const { value: toTime } = ScheduleModal.$toTime;
    const { value: eventName } = ScheduleModal.$eventName;

    ScheduleModal.hideModal();

    ScheduleModal.scheduleUI.addScheduleEvent(
      fromTime,
      toTime,
      eventName,
      ScheduleModal.select.currentVal
    );

    ScheduleModal.resetModal();
  }

  static addChecValidListeners() {
    this.$eventName.addEventListener('input', ScheduleModal.isFormValid);
    this.$fromTime.addEventListener('input', ScheduleModal.isFormValid);
    this.$toTime.addEventListener('input', ScheduleModal.isFormValid);
  }

  static addSaveTaskEventHandlers() {
    this.$modal.addEventListener('keydown', e => {
      if (e.keyCode === 13) {
        ScheduleModal.saveEvent();
      }
    });

    this.$modal
      .querySelector('.btn_save')
      .addEventListener('click', ScheduleModal.saveEvent);
  }
}

export default ScheduleModal;
