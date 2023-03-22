// constants
const GET_ALL_RECIPES = "recipes/GET_ALL_RECIPES"

// action creators
const getAllRecipes = recipes => {
    return {
        type: GET_ALL_RECIPES,
        payload: recipes
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

// reducer
const initialState = { allRecipes: {}, singleRecipe: {} }

export default function reducer(state = initialState, action) {
    switch(action.type) {
        case GET_ALL_RECIPES: {
            const newState = { ...state };
            newState.allRecipes = { ...state.allRecipes }

            for (const recipe of action.payload) {
                newState.allRecipes[recipe.id] = recipe
            }

            return newState;
        }
        default:
            return state
    }
}
