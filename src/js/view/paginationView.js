import View from './view.js';
import icons from 'url:../../img/icons.svg';

class ViewPagination extends View {
  _parentEl = document.querySelector('.pagination');

  _pagination() {
    console.log('pagination testing');
  }

  _generateMarkUpBtnPrev(page) {
    return `<button class="btn--inline pagination__btn--prev" data-page="${
      page - 1
    }">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${page - 1}</span>
          </button>`;
  }

  _generateMarkUpBtnNext(page) {
    return `<button class="btn--inline pagination__btn--next" data-page="${
      page + 1
    }">
            <span>Page ${page + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
  }

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.result.length / this._data.resultsPerPage
    );
    if (
      this._data.result.length == 0 ||
      (this._data.page === 1 && numPages === 1)
    ) {
      return ``;
    }
    if (this._data.page === 1 && numPages > 1) {
      return this._generateMarkUpBtnNext(this._data.page);
    }
    if (this._data.page === numPages) {
      return `${this._generateMarkUpBtnPrev(this._data.page)}`;
    }
    return `${this._generateMarkUpBtnPrev(
      this._data.page
    )}${this._generateMarkUpBtnNext(this._data.page)}`;
  }

  addHandlerPagination(handler) {
    this._parentEl.addEventListener('click', function (e) {
      e.preventDefault();
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const newPage = +btn.dataset.page;
      handler(newPage);
    });
  }
}

export default new ViewPagination();
