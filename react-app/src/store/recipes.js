import { getRecipeReviews } from "./reviews"

// constants
const GET_ALL_RECIPES = "recipes/GET_ALL_RECIPES"
const GET_SINGLE_RECIPE = "recipes/GET_SINGLE_RECIPE"
const GET_USER_RECIPES = "recipes/GET_USER_RECIPES"
const GET_TAG_RECIPES = "recipes/GET_TAG_RECIPES"
const GET_USER_FAVORITE_RECIPES = "recipes/GET_USER_FAVORITE_RECIPES"
const FAVORITE_A_RECIPE = "recipes/FAVORITE_A_RECIPE"
const REMOVE_USER_FAVORITE_RECIPE = "recipes/REMOVE_USER_FAVORITE_RECIPE"
const POST_A_RECIPE = 'recipes/POST_A_RECIPE'
const UPDATE_RECIPE = 'recipes/UPDATE_RECIPE'
const DELETE_RECIPE = 'recipes/DELETE_RECIPE'

// action creators
const getAllRecipes = recipes => {
    return {
        type: GET_ALL_RECIPES,
        payload: recipes
    }
}

const getSingleRecipe = recipe => {
    return {
        type: GET_SINGLE_RECIPE,
        payload: recipe
    }
}

const getUserRecipes = recipes => {
    return {
        type: GET_USER_RECIPES,
        payload: recipes
    }
}

const getTagRecipes = recipes => {
    return {
        type: GET_TAG_RECIPES,
        payload: recipes
    }
}

export const getUserFavoriteRecipes = recipes => {
    return {
        type: GET_USER_FAVORITE_RECIPES,
        payload: recipes
    }
}

const favoriteARecipe = recipe => {
    return {
        type: FAVORITE_A_RECIPE,
        payload: recipe
    }
}

const postARecipe = recipe => {
    return {
        type: POST_A_RECIPE,
        payload: recipe
    }
}

const updateRecipe = recipe => {
    return {
        type: UPDATE_RECIPE,
        payload: recipe
    }
}

const deleteRecipe = recipeId => {
    return {
        type: DELETE_RECIPE,
        payload: recipeId
    }
}

const removeUserFavoriteRecipe = recipe => {
    return {
        type: REMOVE_USER_FAVORITE_RECIPE,
        payload: recipe
    }
}

// thunks
export const getAllRecipesThunk = () => async (dispatch) => {
    const res = await fetch(`/api/recipes/`);

    if (res.ok) {
        // dispatch action creator
        const data = await res.json();
        dispatch(getAllRecipes(data.recipes));
        return null;
    } else if (res.status < 500) {
        // display validation errors
        const data = await res.json();
        if (data.errors) {
            return data.errors;
        }
    } else {
        return ["An error occured. Please try again later"]
    }
}

export const getSingleRecipeThunk = (recipeId) => async (dispatch) => {
    const res = await fetch(`/api/recipes/${recipeId}`);

    if (res.ok) {
        const data = await res.json();
        dispatch(getSingleRecipe(data))
        dispatch(getRecipeReviews(data.reviews))
        return null;
    } else if (res.status < 500) {
        const data = await res.json();
        if (data.errors) {
            return data.errors
        }
    } else {
        return ["An error occured. Please try again later."]
    }
}

export const getUserRecipesThunk = userId => async (dispatch) => {
    const res = await fetch(`/api/users/${userId}/recipes`)

    if (res.ok) {
        // dispatch action creator
        const data = await res.json();
        dispatch(getUserRecipes(data.recipes));
        return null;
    } else if (res.status < 500) {
        // display validation errors
        const data = await res.json();
        if (data.errors) {
            return data.errors;
        }
    } else {
        return ["An error occured. Please try again later"]
    }
}

export const getTagRecipesThunk = tagId => async (dispatch) => {
    const res = await fetch(`/api/tags/${tagId}`)

    if (res.ok) {
        // dispatch action creator
        const data = await res.json();
        dispatch(getTagRecipes(data.recipes));
        return null;
    } else if (res.status < 500) {
        // display validation errors
        const data = await res.json();
        if (data.errors) {
            return data.errors;
        }
    } else {
        return ["An error occured. Please try again later"]
    }
}

export const favoriteARecipeThunk = recipeId => async (dispatch) => {
    const res = await fetch(`/api/recipes/${recipeId}/likes`, {
        method: "POST"
    })

    if (res.ok) {
        const data = await res.json();
        dispatch(favoriteARecipe(data));
        return null;
    } else if (res.status < 500) {
        const data = await res.json();
        if (data.errors) {
            return data.errors
        }
    } else {
        return ["An error occured. Please try again later."]
    }
}

export const postARecipeThunk = recipe => async (dispatch) => {
    const res = await fetch(`/api/recipes/`, {
        method: "POST",
        body: recipe
    })

    if (res.ok) {
        const data = await res.json();
        dispatch(postARecipe(data))
        return data;
    } else if (res.status < 500) {
        const data = await res.json();
        if (data.errors) {
            return data.errors
        }
    } else {
        return ["An error occured. Please try again later."]
    }
}

export const updateRecipeThunk = (recipeId, recipe) => async (dispatch) => {
    const res = await fetch(`/api/recipes/${recipeId}`, {
        method: "PUT",
        body: recipe
    })

    if (res.ok) {
        const data = await res.json();
        dispatch(updateRecipe(data));
        return null;
    } else if (res.status < 500) {
        const data = await res.json();
        if (data.errors) {
            return data.errors
        }
    } else {
        return ["An error occured. Please try again later."]
    }
}

export const deleteRecipeThunk = recipeId => async (dispatch) => {
    const res = await fetch(`/api/recipes/${recipeId}`, {
        method: "DELETE"
    })

    if (res.ok) {
        dispatch(deleteRecipe(recipeId))
        return null;
    } else if (res.status < 500) {
        const data = await res.json();
        if (data.errors) {
            return data.errors
        }
    } else {
        return ["An error occured. Please try again later."]
    }
}

export const removeUserFavoriteRecipeThunk = (recipeId) => async (dispatch) => {
    const res = await fetch(`/api/recipes/${recipeId}/likes`, {
        method: "DELETE"
    })

    if (res.ok) {
        const data = await res.json();
        dispatch(removeUserFavoriteRecipe(data))
        return null;
    } else if (res.status < 500) {
        const data = await res.json();
        if (data.errors) {
            return data.errors
        }
    } else {
        return ["An error occured. Please try again later."]
    }
}

// reducer
const initialState = { allRecipes: {}, singleRecipe: {}, userFavoriteRecipes: {} }

export default function reducer(state = initialState, action) {
    const newState = { ...state };
    switch(action.type) {
        case GET_ALL_RECIPES: {
            newState.allRecipes = { ...state.allRecipes }

            for (const recipe of action.payload) {
                newState.allRecipes[recipe.id] = recipe
            }

            return newState;
        }
        case GET_USER_RECIPES: {
            const userRecipes = {}

            for (const recipe of action.payload) {
                userRecipes[recipe.id] = recipe
            }
            newState.allRecipes = userRecipes;
            return newState
        }
        case GET_SINGLE_RECIPE: {
            newState.singleRecipe = action.payload;
            return newState;
        }
        case GET_TAG_RECIPES: {
            newState.allRecipes = {};
            for (const recipe of action.payload) {
                newState.allRecipes[recipe.id] = recipe
            }

            return newState;
        }
        case GET_USER_FAVORITE_RECIPES: {
            const newState = { ...state }

            const normalizedFavoriteRecipes = {}

            for (const recipe of action.payload) {
                normalizedFavoriteRecipes[recipe.id] = recipe
            }

            newState.userFavoriteRecipes = normalizedFavoriteRecipes

            return newState;
        }
        case FAVORITE_A_RECIPE: {
            // need to add current user id to list of favorite user ids
            // if recipe in all recipes
            newState.allRecipes = { ...state.allRecipes }
            newState.singleRecipe = { ...state.singleRecipe }
            newState.userFavoriteRecipes = { ...state.userFavoriteRecipes }

            if (action.payload.id in newState.allRecipes) {
                newState.allRecipes[action.payload.id] = action.payload
            }

            if (newState.singleRecipe.id === action.payload.id) {
                newState.singleRecipe.liked_users_ids = action.payload.liked_users_ids
            }

            newState.userFavoriteRecipes[action.payload.id] = action.payload



            return newState
        }
        case POST_A_RECIPE: {
            newState.singleRecipe = action.payload;
            return newState;
        }
        case UPDATE_RECIPE: {
            newState.singleRecipe = action.payload;
            return newState;
        }
        case DELETE_RECIPE: {
            newState.allRecipes = { ...state.allRecipes }
            delete newState.allRecipes[action.payload]

            newState.singleRecipe = { ...state.singleRecipe }
            if (newState.singleRecipe.id === action.payload) {
                newState.singleRecipe = {}
            }

            newState.userFavoriteRecipes = { ...state.userFavoriteRecipes }
            delete newState.userFavoriteRecipes[action.payload]

            return newState
        }
        case REMOVE_USER_FAVORITE_RECIPE: {
            newState.allRecipes = { ...state.allRecipes }
            newState.singleRecipe = { ...state.singleRecipe }
            newState.userFavoriteRecipes = { ...state.userFavoriteRecipes }

            if (action.payload.id in newState.allRecipes) {
                newState.allRecipes[action.payload.id] = action.payload
            }

            if (newState.singleRecipe.id === action.payload.id) {
                newState.singleRecipe.liked_users_ids = action.payload.liked_users_ids
            }

            delete newState.userFavoriteRecipes[action.payload.id]

            return newState
        }
        default:
            return state
    }
}
