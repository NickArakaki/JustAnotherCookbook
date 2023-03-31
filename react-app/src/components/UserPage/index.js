import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getUserRecipesThunk } from "../../store/recipes";
import { getAllUsersThunk } from "../../store/users";
import LoadingComponent from "../Loading";
import RecipeTiles from "../RecipeTiles";
import "./UserPage.css"

function UserPage() {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false)
    const { userId } = useParams();
    const user = useSelector(state => state.users[userId])
    const userRecipes = useSelector(state => state.recipes.allRecipes)

    useEffect(() => {
        dispatch(getUserRecipesThunk(userId))
            .then(() => dispatch(getAllUsersThunk()))
            .then(() => setIsLoaded(true))
    }, [dispatch, userId])

    return (
        <>
            {isLoaded ? (
                <>
                    <div className="recipe_page_tile">{user.username}'s Recipes</div>
                    {Object.values(userRecipes).length > 0 ? <RecipeTiles recipes={userRecipes}/> : <h2>{user.username} has not posted any recipes yet.</h2>}
                </>
            ) : (
                <LoadingComponent />
            )
            }
        </>
    )
}

export default UserPage;
