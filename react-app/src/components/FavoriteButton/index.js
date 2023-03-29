import { useDispatch, useSelector } from "react-redux";
import { favoriteARecipeThunk, removeUserFavoriteRecipeThunk } from "../../store/recipes";

function FavoriteButton({ recipe }) {
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user)

    const handleFavorite = async (recipeId) => {
        const data = await dispatch(favoriteARecipeThunk(recipeId))
        if (data) {
            alert(data)
        }
    }

    const handleUnFavorite = async (recipeId) => {
        const data = await dispatch(removeUserFavoriteRecipeThunk(recipeId))
        if (data) {
            alert(data)
        }
    }

    return (
        <>
            {(sessionUser && recipe.liked_users_ids.includes(sessionUser.id)) ? (
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
