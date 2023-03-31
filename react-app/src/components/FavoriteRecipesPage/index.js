import { useSelector } from "react-redux";
import RecipeTiles from "../RecipeTiles"

function FavoriteRecipesPage() {
    const favoriteRecipes = useSelector(state => Object.values(state.recipes.userFavoriteRecipes))
    return (
        <>
            <div className="recipe_page_tile">Your Favorite Recipes</div>
            {favoriteRecipes.length > 0 ? <RecipeTiles recipes={favoriteRecipes} /> : <h2>You don't have any favorite recipes</h2>}
        </>
    )
}

export default FavoriteRecipesPage;
