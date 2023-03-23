import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getUserRecipesThunk } from "../../store/recipes";
import { getAllUsersThunk } from "../../store/users";
import RecipeTiles from "../RecipeTiles";

function UserPage() {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false)
    const { userId } = useParams();
    const user = useSelector(state => state.users[userId])

    useEffect(() => {
        dispatch(getUserRecipesThunk(userId))
            .then(() => dispatch(getAllUsersThunk()))
            .then(() => setIsLoaded(true))
    }, [dispatch])

    return (
        <>
            {isLoaded ? (
                <>
                    <div className="user_page_title_div">
                        <div className="user_page_icon"></div>
                        <div className="user_page_title">{user.username}'s Recipes</div>
                    </div>
                    <RecipeTiles />
                </>
            ) : (
                <h1>Loading...</h1>
            )
            }
        </>
    )
}

export default UserPage;
