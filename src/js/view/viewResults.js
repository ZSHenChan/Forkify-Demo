import ViewPreview from './viewPreview.js';

class ViewResults extends ViewPreview {
  _successMsg = 'No recipes found for your query. Please try again!';

  _parentEl = document.querySelector('.results');
}
export default new ViewResults();
