import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom"
import "./RecipeTiles.css"

function RecipeTiles({ recipes }) {
    const history = useHistory();

    const goToRecipeDetails = (recipe) => {
        history.push(`/recipes/${recipe.id}`)
    }

    return (
        <div className="recipe_tiles_div">
            {Object.values(recipes).map(recipe => {
                return (
                    <div key={recipe.id} className="recipe_tile">
                        <div className="recipe_tile_details_link" onClick={() => goToRecipeDetails(recipe)}>
                            <div className="recipe_tile_image">
                                <div className="recipe_tile_favorite_button"></div>
                                <img className="recipe_tile_image" src={recipe.preview_image_url} alt={`${recipe.title} preview`} />
                            </div>
                            <div className="recipe_tile_title">{recipe.title}</div>
                            <div className="recipe_tile_description">{recipe.description}</div>
                        </div>
                        <div className="recipe_tile_author">submitted by <Link to={`/users/${recipe.author.id}`}>{recipe.author.username}</Link></div>
                        <div className="recipe_tile_tags">
                            {recipe.tags.map(tag =>{
                                return (
                                    <Link key={tag.id} to={`/tags/${tag.id}`}>{tag.tag.toUpperCase()}</Link>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default RecipeTiles;
