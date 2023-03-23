// constants
const GET_ALL_RECIPES = "recipes/GET_ALL_RECIPES"
const GET_SINGLE_RECIPE = "recipes/GET_SINGLE_RECIPE"
const GET_USER_RECIPES = "recipes/GET_USER_RECIPES"
const POST_A_RECIPE = 'recipes/POST_A_RECIPE'
const UPDATE_RECIPE = 'recipes/UPDATE_RECIPE'

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
        return null
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

export const postARecipeThunk = recipe => async (dispatch) => {
    const res = await fetch(`/api/recipes/`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(recipe)
    })

    if (res.ok) {
        const data = await res.json();
        dispatch(postARecipe(data))
        return null
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipe)
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

// reducer
const initialState = { allRecipes: {}, singleRecipe: {} }

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
        case POST_A_RECIPE: {
            newState.singleRecipe = action.payload;
            return newState;
        }
        case UPDATE_RECIPE: {
            newState.singleRecipe = action.payload;
            return newState;
        }
        default:
            return state
    }
}
