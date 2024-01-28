import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model.js';
import viewRecipe from './view/viewRecipe.js';
import viewSearch from './view/viewSearch.js';
import viewResults from './view/viewResults.js';
import viewPagination from './view/paginationView.js';
import viewBookmarks from './view/viewBookmarks.js';
import viewAddRecipe from './view/viewAddRecipe.js';

import { MODAL_CLOSE_SEC } from './config.js';

const recipeContainer = document.querySelector('.recipe');

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    viewRecipe.renderSpinner();

    await model.loadRecipe(id);

    viewResults.update(model.getSearchResutlsPage());
    viewBookmarks.update(model.state.bookmarks);

    viewRecipe.render(model.state.recipe);
  } catch (err) {
    viewRecipe.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // getting input
    const query = viewSearch.getQuery();
    if (!query) return;

    // getting resonse from API
    viewResults.renderSpinner();
    await model.loadSearchResults(query);

    //render results and buttons
    controlPagination(1);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (newPage) {
  // render new results
  viewResults.render(model.getSearchResutlsPage(newPage));
  // render new buttons
  viewPagination.render(model.state.search);
};

const controlServings = function (newServings) {
  model.updateServings(newServings);
  viewRecipe.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);
  viewRecipe.update(model.state.recipe);
  viewBookmarks.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    viewAddRecipe.renderSpinner();

    // upload new recipe to API
    await model.uploadRecipe(newRecipe);
    viewRecipe.render(model.state.recipe);

    // show success message
    viewAddRecipe.renderMessage();

    // render bookmarks content
    viewBookmarks.render(model.state.bookmarks);

    // change ID in URL without reloading the page
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // return to the previous page
    // window.history.back()

    // close form window
    setTimeout(function () {
      viewAddRecipe.toggleClasslist();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    viewAddRecipe.renderError(err.message);
  }
};

const init = function () {
  viewRecipe.addHandlerRender(controlRecipes);
  viewSearch.addHandlerSearch(controlSearchResults);
  viewPagination.addHandlerPagination(controlPagination);
  viewRecipe.addHandlerServings(controlServings);
  viewRecipe.addHandlerAddBookmark(controlAddBookmark);
  viewBookmarks.render(model.state.bookmarks);
  viewAddRecipe.addHandlerUploadRecipe(controlAddRecipe);
};
init();
