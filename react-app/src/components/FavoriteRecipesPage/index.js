import { useSelector } from "react-redux";
import RecipeTiles from "../RecipeTiles"

function FavoriteRecipesPage() {
    // access user favorite recipes
    const favoriteRecipes = useSelector(state => Object.values(state.session.userFavoriteRecipes))
    console.log(favoriteRecipes);
    // pass down recipes as prop
    return (
        <>
            <h1>Favorite Recipes Coming Soon...</h1>
            <RecipeTiles recipes={favoriteRecipes}/>
        </>
    )
}

export default FavoriteRecipesPage;
