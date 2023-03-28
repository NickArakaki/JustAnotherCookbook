import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom"
import { favoriteARecipeThunk } from "../../store/recipes";
import "./RecipeTiles.css"

function RecipeTiles({ recipes }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const sessionUser = useSelector(state => state.session.user)

    const goToRecipeDetails = (recipe) => {
        history.push(`/recipes/${recipe.id}`)
    }

    const handleFavorite = async (recipeId) => {
        const data = await dispatch(favoriteARecipeThunk(recipeId))
        if (data) {
            // handle errors?
        }
    }

    const handleUnFavorite = (e) => {

    }

    return (
        <div className="recipe_tiles_div">
            {Object.values(recipes).map(recipe => {
                return (
                    <div key={recipe.id} className="recipe_tile">
                        {(sessionUser && recipe.liked_users_ids.includes(sessionUser.id)) ? (
                                <i onClick={() => handleUnFavorite(recipe.id)} className="favorited_icon fa-solid fa-heart" />
                            ) : (
                                <i onClick={() => handleFavorite(recipe.id)} className="favorited_icon fa-sharp fa-regular fa-heart" />
                        )}
                        <div className="recipe_tile_details_link" onClick={() => goToRecipeDetails(recipe)}>
                            <div className="recipe_tile_image">
                                <div className="recipe_tile_favorite_button">
                                </div>
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
