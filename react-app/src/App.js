import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import RecipeDetails from "./components/RecipeDetails";
import RecipeForm from "./components/RecipeForm/RecipeForm";
import UpdateRecipe from "./components/RecipeForm/UpdateRecipe";
import UserPage from "./components/UserPage";
import TagRecipePage from "./components/TagRecipePage";
import FavoriteRecipesPage from "./components/FavoriteRecipesPage";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <LandingPage />
          </Route>
          <Route path="/login" >
            <LoginFormPage />
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
          <ProtectedRoute path='/recipes/submit'>
            <RecipeForm />
          </ProtectedRoute>
          <ProtectedRoute path={`/recipes/:recipeId/edit`}>
            <UpdateRecipe />
          </ProtectedRoute>
          <Route path={`/recipes/:recipeId`}>
            <RecipeDetails />
          </Route>
          <Route path={`/users/:userId`}>
            <UserPage />
          </Route>
          <Route path={`/tags/:tagId`}>
            <TagRecipePage />
          </Route>
          <ProtectedRoute path={`/my-favorites`}>
            <FavoriteRecipesPage />
          </ProtectedRoute>
        </Switch>
      )}
    </>
  );
}

export default App;
