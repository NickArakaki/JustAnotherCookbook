import { useSelector } from "react-redux";
import { Link } from "react-router-dom"


function RecipeTiles() {
    const recipes = useSelector(state => state.recipes.allRecipes)

    return (
        <div className="recipe_tiles_div">
            {Object.values(recipes).map(recipe => {
                return (
                    <div className="recipe_tile">
                        <div className="recipe_image">
                            <div className="recipe_favorite_button"></div>
                        </div>
                        <div className="recipe_title">{recipe.title}</div>
                        <div className="recipe_description">{recipe.description}</div>
                        <div className="recipe_author">submitted by <Link to={`/users/${recipe.author.id}`}>{recipe.author.username}</Link></div>
                        <div className="recipe_tags"></div>
                    </div>
                )
            })}
        </div>
    )
}

export default RecipeTiles;
