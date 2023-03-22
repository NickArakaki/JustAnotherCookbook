import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getAllRecipesThunk } from "../../store/recipes";
import RecipeTiles from "../RecipeTiles";

function LandingPage() {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        dispatch(getAllRecipesThunk())
            .then(() => setIsLoaded(true))
    }, [dispatch])

    return (
        <>
            {isLoaded && <RecipeTiles />}
        </>
    )
}

export default LandingPage;
