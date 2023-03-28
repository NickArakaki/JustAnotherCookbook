// constants
const SET_USER = "session/SET_USER";
const REMOVE_USER = "session/REMOVE_USER";

const setUser = (user) => ({
	type: SET_USER,
	payload: user,
});

const removeUser = () => ({
	type: REMOVE_USER,
});


export const authenticate = () => async (dispatch) => {
	const response = await fetch("/api/auth/", {
		headers: {
			"Content-Type": "application/json",
		},
	});
	if (response.ok) {
		const data = await response.json();
		if (data.errors) {
			return;
		}

		dispatch(setUser(data));
	}
};

export const login = (email, password) => async (dispatch) => {
	const response = await fetch("/api/auth/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email,
			password,
		}),
	});

	if (response.ok) {
		const data = await response.json();
		// hydrate the userReviewdRecipes, and userFavoriteRecipes
		dispatch(setUser(data));
		return null;
	} else if (response.status < 500) {
		const data = await response.json();
		if (data.errors) {
			return data;
		}
	} else {
		return ["An error occurred. Please try again later."];
	}
};

export const logout = () => async (dispatch) => {
	const response = await fetch("/api/auth/logout", {
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (response.ok) {
		dispatch(removeUser());
	}
};

export const signUp = (username, email, password) => async (dispatch) => {
	const response = await fetch("/api/auth/signup", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			username,
			email,
			password,
		}),
	});

	if (response.ok) {
		const data = await response.json();
		dispatch(setUser(data));
		return null;
	} else if (response.status < 500) {
		const data = await response.json();
		if (data.errors) {
			return data;
		}
	} else {
		return ["An error occurred. Please try again later."];
	}
};

const initialState = { user: null, userFavoriteRecipes: {}, userReviewedRecipes: {} };

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case SET_USER:
			const newState = { ...state };

			newState.user = action.payload.user
			console.log("action payload", action.payload)
			const normalizedFavorites = {}
			for (const recipe of action.payload.userFavoriteRecipes) {
				normalizedFavorites[recipe.id] = recipe
			}
			newState.userFavoriteRecipes = normalizedFavorites

			const normalizedReviewedRecipes = {};
			for (const recipe of action.payload.userReviewedRecipes) {
				normalizedReviewedRecipes[recipe.id] = recipe
			}
			newState.userReviewedRecipes = normalizedReviewedRecipes

			return newState;
		case REMOVE_USER:
			return initialState;
		default:
			return state;
	}
}
