class Select {
  static init(items) {
    this.$dropdown = document.querySelector('.dropdown');
    this.$input = document.querySelector('.input_select');
    this.$icon = this.$input.querySelector('.icon');

    this.currentVal = this.$input.querySelector('input').value;

    Select.addItems(items);
    Select.toggleDropdown();
    Select.addCloseEvent();
    Select.changeItem();
  }

  static addItems(items) {
    const $ul = this.$dropdown.querySelector('ul');
    const $fragment = document.createDocumentFragment();

    items.forEach(item => {
      const $li = document.createElement('li');
      $li.textContent = item;

      $fragment.appendChild($li);
    });

    $ul.appendChild($fragment);
  }

  static toggleDropdown() {
    this.$input.addEventListener('click', event => {
      event.stopPropagation();
      this.$input.classList.toggle('active');
      this.$dropdown.classList.toggle('dropdown_visible');
      this.$icon.classList.toggle('open');
    });
  }

  static close() {
    this.$input.classList.remove('active');
    this.$dropdown.classList.remove('dropdown_visible');
    this.$icon.classList.remove('open');
  }

  static addCloseEvent() {
    document.querySelector('body').addEventListener('click', () => {
      Select.close();
    });
  }

  static changeItem() {
    this.$dropdown.addEventListener('click', event => {
      if (event.target.tagName === 'LI') {
        Select.setValue(event.target.textContent);
      }
    });
  }

  static setValue(newValue) {
    this.currentVal = newValue;
    this.$input.querySelector('input').value = newValue;
  }
}

export default Select;
