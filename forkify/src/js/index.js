import Search from "./models/Search";
import {domElements, renderLoader, clearLoader} from "./views/base";
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";

/** GLOBAL STATE OF THE APP
 * Search Object
 * Current Recipe Object
 * Shopping List Object
 * Liked Recipes
 * */
const state = {};


/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
    //1- Get the query from the view
    const query = searchView.getInput();
    if (query) {
        //2- Create a Search Object
        state.search = new Search(query);
        renderLoader(domElements.searchRes);
        //3- Prepare UI for the Results
        searchView.clearInput();
        searchView.clearResults();
        try {
            //4- Search for Recipes
            await state.search.getResults();
            //5- Render the results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (error) {
            console.log(error);
            clearLoader();
            alert(`Error processing the recipe: ${error}`);
        };
    }
}
/**
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {
    //Get ID from URL
    const id = window.location.hash.replace('#','');
    if (id) {
        //Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(domElements.recipe);

        //Highlight the Selected Recipe
        if (state.search) {
            searchView.highlightSelected(id);
        };

        //Create new recipe object
        state.recipe = new Recipe(id);
        try {
            //Get recipe data
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            //Calculate servings and time
            state.recipe.calculateServings();
            state.recipe.calculateTime();
            //Render Recipe
            clearLoader();
            console.log(state.recipe);
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );
        } catch (error) {
            console.log(error);
            alert(`Error processing the recipe: ${error}`);
        };
    }
}
/**
 * LIST CONTROLLER
 */
const controlList = () => {
    // Create a new list if there is none yet
    if (!state.list) {
        state.list = new List();
    };
    //Add the ingredients to the list
    state.recipe.ingredients.forEach(ing => {
        const item = state.list.addItem(ing.count, ing.unit, ing.ingredient);
        listView.renderItem(item);
    });
}
/**
 * LIST CONTROLLER
 */
const controlLike =() => {
    if(!state.likes) {
        state.likes = new Likes();
    };
    //Check if current Recipe is liked
    const currentId = state.recipe.id;
    if(!state.likes.isLiked(currentId)) {
        //Add like to the state
        const newLike = state.likes.addLike(
            currentId,
            state.recipe.title,
            state.recipe.publisher,
            state.recipe.image_url
        );
        //toggle the like button
        likesView.toggleLikeBtn(true);
        //add to the ui list
        likesView.renderLike(newLike);
    } else {
        //remove like from the state
        state.likes.removeLike(currentId);
        //toggle the like button
        likesView.toggleLikeBtn(false);
        //remove it from UI list
        likesView.deleteLike(currentId);
    };
    likesView.toggleLikeMenu(state.likes.getNumberLikes());
}


/**
 * EVENT LISTENERS
 */
domElements.searchForm.addEventListener('submit', event => {
    event.preventDefault();
    controlSearch();
});
domElements.searchResPages.addEventListener('click', event => {
    const btn = event.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    };
});
domElements.recipe.addEventListener('click', e => {
    console.log(e);
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        //Call List Controller
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        //Call Like Controller
        controlLike();
    };
});
domElements.shopping.addEventListener('click', event => {
    const id = event.target.closest('.shopping__item').dataset.itemid;
    //Delete the shopping item
    if(event.target.matches('.shopping__delete, .shopping__delete *')) {
        state.list.deleteItem(id);
        listView.deleteItem(id);
    } else if (event.target.matches('.shopping__count-value')) {
        const val = parseFloat(event.target.value);
        state.list.updateCount(id,val);
    };
});
window.addEventListener('hashchange',controlRecipe);
window.addEventListener('load', () => {
    state.likes = new Likes();
    state.likes.readStorage();
    likesView.toggleLikeMenu(state.likes.getNumberLikes());
    state.likes.likes.forEach(like => likesView.renderLike(like));
});