import { useSelector } from "react-redux";
import RecipeTiles from "../RecipeTiles"

function FavoriteRecipesPage() {
    const favoriteRecipes = useSelector(state => Object.values(state.recipes.userFavoriteRecipes))
    return (
        <>
            <h1>Your Favorite Recipes</h1>
            <RecipeTiles recipes={favoriteRecipes}/>
        </>
    )
}

export default FavoriteRecipesPage;
