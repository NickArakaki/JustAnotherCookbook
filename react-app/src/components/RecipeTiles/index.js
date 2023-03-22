import { useSelector } from "react-redux";
import { Link, Redirect, useHistory } from "react-router-dom"
import "./RecipeTiles.css"

function RecipeTiles() {
    const recipes = useSelector(state => state.recipes.allRecipes)
    const history = useHistory();

    const goToRecipeDetails = (recipe) => {
        history.push(`/recipes/${recipe.id}`)
    }

    return (
        <div className="recipe_tiles_div">
            {Object.values(recipes).map(recipe => {
                return (
                    <div key={recipe.id} className="recipe_tile">
                        <div className="recipe_tile_image">
                            <div className="recipe_tile_favorite_button"></div>
                            <img className="recipe_image" src={recipe.preview_image_url} alt={`${recipe.title} preview`} />
                        </div>
                        <div onClick={() => goToRecipeDetails(recipe)} className="recipe_tile_title">{recipe.title}</div>
                        <div onClick={() => goToRecipeDetails(recipe)} className="recipe_tile_description">{recipe.description}</div>
                        <div className="recipe_tile_author">submitted by <Link to={`/users/${recipe.author.id}`}>{recipe.author.username}</Link></div>
                        <div className="recipe_tile_tags"></div>
                    </div>
                )
            })}
        </div>
    )
}

export default RecipeTiles;
