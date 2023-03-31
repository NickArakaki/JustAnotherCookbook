import { useSelector } from "react-redux";
import RecipeTiles from "../RecipeTiles"

function FavoriteRecipesPage() {
    const favoriteRecipes = useSelector(state => Object.values(state.recipes.userFavoriteRecipes))
    return (
        <>
            <h1>Your Favorite Recipes</h1>
            {favoriteRecipes.length > 0 ? <RecipeTiles recipes={favoriteRecipes} /> : <h2>You don't have any favorite recipes yet!</h2>}
        </>
    )
}

export default FavoriteRecipesPage;
