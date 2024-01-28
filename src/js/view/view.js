import icons from 'url:../../img/icons.svg';

export default class View {
  _parentEl;
  _data;
  _errorMsg;
  _successMsg;

  _generateMarkup() {
    return 'default markup';
  }

  /**
   * Render received object to DOM
   * @param {Object | Object[]} data data to be rendered (i.e. recipe)
   * @returns undefined
   * @this {Object} View instance
   * @author Zhen
   */
  render(data) {
    if (!data) return this.renderError();
    if (Array.isArray(data) && data.length == 0) return this.renderMessage();
    this._data = data;
    const markup = this._generateMarkup();
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  // **changes html content taht is different from the original instead of rendering everything
  update(data) {
    this._data = data;

    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentEl.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });

    // const curServings = this._data.servings;
    // this._parentEl
    //   .querySelector('.btn--decrease-servings')
    //   .setAttribute('data-update-to', curServings - 1);
    // this._parentEl
    //   .querySelector('.btn--increase-servings')
    //   .setAttribute('data-update-to', curServings + 1);
  }

  _clear() {
    this._parentEl.innerHTML = '';
  }

  renderSpinner = function () {
    console.log(`${icons}#icon-loader`);
    const markup = `<div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>`;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  };

  renderError = function (message = this._errorMsg) {
    const markup = `<div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;
    this._clear();
    this._parentEl.insertAdjacentHTML('beforeend', markup);
  };

  renderMessage = function (message = this._successMsg) {
    const markup = `<div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;
    this._clear();
    this._parentEl.insertAdjacentHTML('beforeend', markup);
  };
}
