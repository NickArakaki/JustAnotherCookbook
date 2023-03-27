import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import RecipeDetails from "./components/RecipeDetails";
import RecipeForm from "./components/RecipeForm/RecipeForm";
import UpdateRecipeForm from "./components/RecipeForm/UpdateRecipeForm";
import UserPage from "./components/UserPage";
import TagRecipePage from "./components/TagRecipePage";

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
          <Route path='/recipes/submit'>
            <RecipeForm />
          </Route>
          <Route path={`/recipes/:recipeId/edit`}>
            <UpdateRecipeForm />
          </Route>
          <Route path={`/recipes/:recipeId`}>
            <RecipeDetails />
          </Route>
          <Route path={`/users/:userId`}>
            <UserPage />
          </Route>
          <Route path={`/tags/:tagName`}>
            <TagRecipePage />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
