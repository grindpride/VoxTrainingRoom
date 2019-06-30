const timeRe = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

class ScheduleModal {
  static init() {
    this.$modal = document.querySelector('.modal-wrapper');
    this.$fromTime = this.$modal.querySelector('.from-time');
    this.$toTime = this.$modal.querySelector('.to-time');
    this.$eventName = this.$modal.querySelector('.event-name');

    ScheduleModal.addCloseModalEventHandlers();
    ScheduleModal.addChecValidListeners();
  }

  static addCloseModalEventHandlers() {
    this.$modal
      .querySelector('.close-icon')
      .addEventListener('click', ScheduleModal.hideModal);

    this.$modal
      .querySelector('.btn_cancel')
      .addEventListener('click', ScheduleModal.hideModal);
  }

  static setTimeInterval(startTime, endTime) {
    this.$fromTime.value = startTime;
    this.$toTime.value = endTime;
  }

  static isFormValid() {
    const { value: toTime } = ScheduleModal.$toTime;
    const { value: fromTime } = ScheduleModal.$fromTime;
    const { value: eventName } = ScheduleModal.$eventName;

    const isValid = timeRe.test(fromTime) && timeRe.test(toTime) && eventName;
    ScheduleModal.$modal.querySelector('.btn_save').disabled = !isValid;
  }

  static showModal() {
    ScheduleModal.$modal.classList.remove('hidden');
  }

  static hideModal() {
    ScheduleModal.$modal.classList.add('hidden');
  }

  static addChecValidListeners() {
    this.$eventName.addEventListener('input', ScheduleModal.isFormValid);
    this.$fromTime.addEventListener('input', ScheduleModal.isFormValid);
    this.$toTime.addEventListener('input', ScheduleModal.isFormValid);
  }

  static addSaveTaskEventHandlers() {
    this.$modal.addEventListener('keydown', e => {
      if (e.keyCode === 13) {
        ScheduleModal.hideModal();
      }
    });

    this.$modal.querySelector('.btn_save').addEventListener('click', () => {
      ScheduleModal.hideModal();
    });
  }
}

export default ScheduleModal;
