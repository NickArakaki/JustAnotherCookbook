import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getAllRecipesThunk } from "../../store/recipes";
import { getAllUsersThunk } from '../../store/users'
import RecipeTiles from "../RecipeTiles";

function LandingPage() {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        dispatch(getAllRecipesThunk())
            .then(() => dispatch(getAllUsersThunk()))
            .then(() => setIsLoaded(true))
    }, [dispatch])

    return (
        <>
            {isLoaded && <RecipeTiles />}
        </>
    )
}

export default LandingPage;
