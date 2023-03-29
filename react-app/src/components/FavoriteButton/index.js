import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { favoriteARecipeThunk, removeUserFavoriteRecipeThunk } from "../../store/recipes";

function FavoriteButton({ recipe }) {
    const history = useHistory();
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user)

    const handleFavorite = async (recipeId) => {
        if (!sessionUser) {
            history.push("/login")
        } else {
            dispatch(favoriteARecipeThunk(recipeId))
        }
    }

    const handleUnFavorite = async (recipeId) => {
        if (!sessionUser) {
            history.push("/login")
        } else {
            dispatch(removeUserFavoriteRecipeThunk(recipeId))
        }
    }

    return (
        <>
            {(recipe.liked_users_ids.includes(sessionUser?.id)) ? (
                <i onClick={(e) => {
                    e.stopPropagation();
                    handleUnFavorite(recipe.id)
                }} className="favorited_icon fa-solid fa-heart" />
                ) : (
                <i onClick={(e) => {
                    e.stopPropagation();
                    handleFavorite(recipe.id)
                }} className="favorited_icon fa-sharp fa-regular fa-heart" />
            )}
        </>
    )
}

export default FavoriteButton;
