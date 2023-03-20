# User Stories

## Users

### Sign Up

* As an unregistered and unauthorized user, I want to be able to sign up for the website via a sign-up form.
    * When I'm on the `/signup` page:
        * I would like to be able to enter my email, first name, last name, and preferred password on a clearly laid out form.
        * I would like the website to log me in upon successful completion of the sign-up form.
            * So that I can seamlessly access the site's functionality
    * When I enter invalid data on the sign-up form:
        * I would like the website to inform me of the validations I failed to pass, and repopulate the form with my valid entries (except my password).
        * So that I can try again without needing to refill forms I entered valid data into.

### Log in

* As a registered and an unauthorized user, I want to be able to log in to the website via a log-in form.
    * When I'm on the `/login` page:
        * I would like to be able to enter my email and password on a clearly laid out form.
        * I would like the website to log me in upon successful completion of the log-in form.
            * So that I can seamlessly access the site's functionality
    * When I enter invalid data on the log-up form:
        * I would like the website to inform me of the validations I failed to pass, and repopulate the form with my valid entries (except my password).
            * So that I can try again without needing to refill forms I entered valid data into.

### Demo User

* As an unregistered and unauthorized user, I would like an easy to find and clear button on both the `/signup` and `/login` pages to allow me to visit the site as a guest without signing up or logging in.
    * When I'm on either the `/signup` or `/login` pages:
        * I can click on a Demo User button to log me in and allow me access as a normal user.
            * So that I can test the site's features and functionality without needing to stop and enter credentials.

### Log Out

* As a logged in user, I want to log out via an easy to find log out button on the navigation bar.
    * While on any page of the site:
        * I can log out of my account and be redirected to a page displaying recent Recipes.
            * So that I can easily log out to keep my information secure.

## Recipes (MVP Feature: CRUD)

### Create Recipes

* As a logged in user, I want to be able to post new Recipes.
    * When I'm on the `/new-recipe` page:
        * I can write and submit a new Recipe.
            * So that I can share my wonderful recipes with the world.

### Viewing Recipes

* As a logged in or logged out user, I want to be able to view a selection of the most recent Recipes.
    * When I'm on the `/recipes` page:
        * I can view the ten most recently posted Recipes in each category.
            * So that I can read and interact with get inspiration for what meals I want to make.

* As a logged in or logged out user, I want to be able to view a specific Recipe and its associated Reviews and Rating.
    * When I'm on the `/recipes/:id` page:
        * I can view the content of the Recipe, as well as the associated Reviews and Rating.
            * So that I can read and interact with the opinions of others in the community, and add my own thoughts and critiques in the Reviews.

* As a logged in or logged out user, I want to be able to view all of a users recipes
    * When I'm on the `/users/:id/recipes` page:
        * I want to see a list of Recipes that user has posted
            * So if I enjoy their Recipes, I can easily find their other Recipes that they have decided to share

### Updating Recipes

* As a logged in user, I want to be able to edit my Recipes by clicking an Edit button associated with the Recipe anywhere that Recipe appears.
    * When I'm on the `/recipes`, `/recipes/:id`, or `/users/:id/recipes` pages:
        * I can click "Edit" to make permanent changes to Recipes I have posted.
            * So that I can fix any errors I make in my Recipes.

### Deleting Recipes

* As a logged in user, I want to be able to delete my Recipes by clicking a Delete button associated with the Recipe anywhere that Recipe appears.
    * When I'm on the `/recipes`, `/recipes/:id`, or `/users/:id/recipes` pages:
        * I can click "Delete" to permanently delete a Recipe I have posted.
            * So that when I realize my Recipe needs further refining before being unveiled to the world, I can easily remove it.

## Reviews (MVP Feature: CRUD)

### Create Review

* As a logged in user, I want to be able to post a new Review for a Recipe.
    * When I'm on the `/recipes/:id` page:
        * I can write and submit a new Review.
            * So that I can share my wonderful critiques and experiences with the world.
    * I should not be allowed to leave a Review for my own Recipe, because I would obviously give it 5 stars, skewing the actual Rating of the Recipe

### Viewing Reviews

* As a logged in or logged out user, I want to be able to view a selection of the most recent Reviews for a Recipe.
    * When I'm on the `/recipes/:id` page:
        * I can view the twenty most recently posted Reviews.
            * So that I can read and interact with the community to help determine if this Recipe is worth trying.

* As a logged in or logged out user, I want to be able to view the average Rating for a Recipe.
  * When I'm on the `/recipes/:id` page:
    * To help me determine if this is a Recipe worth trying.

### Updating Reviews

* As a logged in user, I want to be able to edit my Reviews by clicking an Edit button associated with the Review anywhere that Review appears.
    * When I'm on the `/recipes/id`, or `/users/:id/reviews` pages:
        * I can click "Edit" to make permanent changes to Recipes I have posted.
            * So that I can fix any errors I make in my Reviews.

### Deleting Reviews

* As a logged in user, I want to be able to delete my Reviews by clicking a Delete button associated with the Review anywhere that Review appears.
  * When I'm on the `/recipes/:id`, or `/users/:id/reviews` pages:
    * I can click "Delete" to permanently delete a Recipe I have posted.
        * So that when I realize my Review is incorrect or was accidentally posted on the wrong Recipe, I can easily remove it.

## Liking A Recipe (MVP Feature: CRD)

### Viewing Liked Recipes
* As a logged in user, I want to be able to like Recipes to easily refer back to them
    * When I'm on the `/likes` page:
        * I can view all of the Recipes I have liked
            * So that I can easily find Recipes that I know are excellent, and don't need to hunt down again

### Liking a Recipe
* As a logged in user, I want to be able to like a Recipe
    * When I'm on the `/recipes/:id` page:
        * I can easily like a Recipe to add to my liked Recipes list
            * So I can easily refer back to the Recipe later

### Removing a Like
* As a logged in user, I want to be able to unlike a Recipe
    * When I'm on the `recipes/:id` or `/likes` pages:
        * I can easily remove my Like from the Recipe
            * So I can keep my likes curated

## Tags (MVP Feature: CRD)

### Viewing Tags
* As a logged in or logged out user, I want to be see the tags associated with a Recipe anywhere that Recipe appears.
    * When I'm on the `/recipes`, `/recipes/:id`, or `/users/:id/recipes` pages:
        * I can view all the tags associated with that Recipe
            * So that I can easily find other similar Recipes based on those tags

### Create Tags
* As a logged in user, I want to be able to add tags to my Recipes
    * When I'm on the `/recipes/:id` page:
        * I can add tags to my Recipe
            * So other can find my Recipe when searching for similar Recipes

### Deleting Tags
* As a logged in user, I want to be able to remove tags from my Recipes
    * When I'm on the `/recipes/:id` page:
        * I can remove tags from my Recipe
            * So that when I realize I tagged the Recipe with the wrong tag, I can easily remove it

## Searching for Recipes (Bonus Feature: R)

### Viewing Search Results
* As a logged in or logged out user, I want to be able to search for a Recipe
    * When I'm on any page:
        * I can click on the search bar to find a recipe based on my search words
        * I can choose how to filter the results (most relevant, most recent, most reviews, average rating, etc.)
            * So that I can find a Recipe that appeals most to me.

## Integrate AWS File Upload (Bonus Feature: CRD)

### Adding Images to a Recipe
* As a logged in user, I want to be able to upload images for my Recipe
    * When on the `/recipes/:id` page:
        * I can upload images to be included with my Recipe when posting my Recipe
            * So that I can provide visual examples of how the methods AND final product should look

### Updating Images for a Recipe
* As a logged in user, I want to be able to update the images for my Recipes
    * When on the `/recipes/:id` page:
        * I can change which images are included with my Recipe
            * So that I can provide better visual examples if I come up with better ways to visualize my Recipe

### Deleting Images for a Recipe
* As a logged in user, I want to be able to remove images from my Recipes
    * When on the `recipes/:id` page:
        * I can remove images on my posted Recipes
            * So that if my visual aides are causing more confusion than helping, I can easily remove them

## Followers (Bonus Feature: CRD)

### Viewing Users I am Following
* As a logged in User, I want to be able to find a list of users that I am following
    * When I'm on the `/following` page:
        * I want to be able to see a list of users that I am currently following

### Viewing Followers
* As a logged in User, I want to be see how many followers a user has
    * When I'm on the `/recipes`, `/recipes/:id`, or `/users/:id/recipes` pages:
        * I want to be able to see how many people are following a user

### Follow another User
* As a logged in user, I want to be able to follow another User
    * When I'm on the `/recipes/:id` or `/users/:id/recipes` pages:
        * I want to be able to follow the author of the Recipe(s)
            * So that I can easily find other recipes they have shared

### Unfollowing another User
* As a logged in user, I want to be able to unfollow a user that I have previously followed
    * When I'm on the `/recipes/:id`, `/following` or `/users/:id/recipes` pages:
        * I want to be able to unfollow another user
            * So if the other user doesn't have Recipes that interest me or for some other reason, I can easily unfollow them
