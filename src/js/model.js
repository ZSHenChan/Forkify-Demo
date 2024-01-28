import { AJAX } from './helper.js';
import { API_URL, RESULTS_PER_PAGE, KEY } from './config.js';
// import { format } from 'core-js/core/date';

export const state = {
  recipe: {},
  search: {
    query: '',
    page: 1,
    result: [],
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookmarks: [],
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObj(data);
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (searchKey) {
  try {
    state.search.query = searchKey;

    const data = await AJAX(`${API_URL}/?search=${searchKey}&key=${KEY}`);
    state.search.result = data.data.recipes.map(reci => {
      return {
        id: reci.id,
        title: reci.title,
        imageUrl: reci.image_url,
        publisher: reci.publisher,
        ...(reci.key && { key: reci.key }),
      };
    });
  } catch (err) {
    throw err;
  }
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const getSearchResutlsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.result.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);

  // mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

export const removeBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

const createRecipeObj = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    imageUrl: recipe.image_url,
    sourceUrl: recipe.source_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    ...(recipe.key && { key: recipe.key }),
  };
};

const init = function () {
  const localStorageItems = localStorage.getItem('bookmarks');
  if (localStorageItems) state.bookmarks = JSON.parse(localStorageItems);
};
init();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1])
      .map(ing => {
        const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3) throw new Error('Wrong ingredient format!');
        const [quantity, unit, description] = ingArr;
        return {
          quantity: quantity ? +quantity : '',
          unit: unit ? unit : '',
          description: description,
        };
      });

    const formattedRecipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const returnedData = await AJAX(`${API_URL}?key=${KEY}`, formattedRecipe);
    state.recipe = createRecipeObj(returnedData);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
