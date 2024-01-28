import ViewPreview from './viewPreview.js';

class ViewBookmarks extends ViewPreview {
  _errorMsg = `Something went wrong while fetching the data. Please try again later!`;
  _successMsg = 'No bookmark found. Please add a recipe into your bookmark!';

  _parentEl = document.querySelector('.bookmarks__list');
}
export default new ViewBookmarks();
