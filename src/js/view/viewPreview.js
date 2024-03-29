import icons from 'url:../../img/icons.svg';
import View from './view.js';

export default class ViewPreview extends View {
  _errorMsg = `Something went wrong while fetching the data. Please try again later!`;

  _generateMarkup() {
    return this._data.map(rec => this._generateMarkupReview(rec)).join('');
  }

  _generateMarkupReview(rec) {
    const id = window.location.hash.slice(1);
    return `<li class="preview">
            <a class="preview__link ${
              rec.id === id ? 'preview__link--active' : ''
            }" href="#${rec.id}">
              <figure class="preview__fig">
                <img src="${rec.imageUrl}" alt="${rec.title}" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${rec.title}</h4>
                <p class="preview__publisher">${rec.publisher}</p>
                <div class="preview__user-generated ${rec.key ? '' : 'hidden'}">
                  <svg>
                    <use href="${icons}#icon-user"></use>
                  </svg>
                </div>
              </div>
            </a>
          </li>`;
  }
}
