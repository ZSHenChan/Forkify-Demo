import icons from 'url:../../img/icons.svg';

class ViewSearch {
  _parentEl = document.querySelector('.search');
  _searchResultCol = document.querySelector('.search-results');

  _clear() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  _clearSearchCol() {
    this._searchResultCol.innerHTML = '';
  }

  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._clear();
    return query;
  }

  renderSpinner = function () {
    this._clearSearchCol();
    const markup = `<div class="spinner">
          <svg>
            <use href="${icons}_icon-loader"></use>
          </svg>
        </div>`;
    this._clear();
    this._searchResultCol.insertAdjacentHTML('beforeend', markup);
  };

  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new ViewSearch();
