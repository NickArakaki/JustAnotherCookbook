import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom"
import FavoriteButton from "../FavoriteButton";
import "./RecipeTiles.css"
import defaultImage from "../../assets/images/wheresthefood.jpg"

function RecipeTiles({ recipes }) {
    const history = useHistory();
    const sessionUser = useSelector(state => state.session.user)

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
                                <div className="recipe_tile_favorite_button">
                                    <FavoriteButton recipe={recipe} />
                                </div>
                                <img
                                    className="recipe_tile_image"
                                    src={recipe.preview_image_url}
                                    alt={`${recipe.title} preview`}
                                    onError={(e) => { e.target.src="https://mirasvit.com/media/blog/404_Not_Found_2-179.png" }}
                                />
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
