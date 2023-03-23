from flask import Blueprint, request
from flask_login import login_required, current_user
from .auth_routes import validation_errors_to_error_messages
from app.models import db, Recipe, Ingredient, Method
from app.forms import RecipeForm

recipe_routes = Blueprint('recipes', __name__)

def validIngredient(ingredient):
    isValid = False
    if ingredient["ingredient"] and (float(ingredient["amount"]) > 0):
        print("ingredient passed =====================================")
        isValid = True
    return isValid

def validMethod(method):
    isValid = False
    if method["details"]:
        print("method passed ======================================")
        isValid = True
    return isValid

@recipe_routes.route('/')
def get_all_recipes():
    """
    Query for all recipes and return them in a list of recipe dictionaries
    """
    recipes = Recipe.query.all()
    return { "recipes": [recipe.to_dict() for recipe in recipes] }


@recipe_routes.route('/current')
@login_required
def get_user_recipes():
    """
    Query for all current user recipes and return list of recipe dictionaries
    """
    return { "user_recipes": [recipe.to_dict() for recipe in current_user.recipes] }


@recipe_routes.route('/<int:id>')
def get_recipe_details(id):
    """
    Query for single recipe and return single recipe details
    """
    recipe = Recipe.query.get(id)
    return recipe.to_dict_detailed()


@recipe_routes.route('/', methods=["POST"])
@login_required
def post_a_recipe():
    """
    Create and return a new Recipe
    """
    data = request.get_json()
    form = RecipeForm()
    # Get the csrf_token from the request cookie and put it into the
    # form manually to validate_on_submit can be used
    form['csrf_token'].data = request.cookies['csrf_token']
    ingredientsList = data["ingredients"]
    methodsList = data["methods"]
    if form.validate_on_submit():
        new_recipe = Recipe(
            author_id = current_user.id,
            title = data["title"],
            total_time = data["total_time"],
            description = data["description"],
            preview_image_url = data["preview_image_url"]
        )
        db.session.add(new_recipe)

        for ingredient in data["ingredients"]:
            # make sure is valid before create new ingredient
            if validIngredient(ingredient):
                new_ingredient = Ingredient(
                    ingredient = ingredient["ingredient"],
                    amount = ingredient["amount"],
                    units = ingredient["units"]
                )
                new_recipe.ingredients.append(new_ingredient)
            else:
                return { "errors": "Invalid Ingredient" }, 401

        for idx, method in enumerate(methodsList):
            if validMethod(method):
                new_method = Method(
                    step_number = idx + 1,
                    details = method["details"],
                    image_url = method["image_url"]
                )
                new_recipe.methods.append(new_method)
            else:
                return { "errors": "Invalid Method" }, 401

        db.session.commit()
        return new_recipe.to_dict_detailed()
    else:
        return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@recipe_routes.route('/<int:id>', methods=["PUT"])
@login_required
def update_a_recipe(id):
    """
    Update and return a new Recipe using Recipe id
    """
    data = request.get_json()
    form = RecipeForm()
    recipe = Recipe.query.get(id)
    # Get the csrf_token from the request cookie and put it into the
    # form manually to validate_on_submit can be used
    form['csrf_token'].data = request.cookies['csrf_token']

    # Authorization
    if not recipe:
        return { "errors": ["Recipe could not be found" ] }, 404
    elif recipe.author.id != current_user.id:
        return { "errors": ["User is not authorized to edit this Recipe"] }, 401

    # Form validations
    if form.validate_on_submit():
        recipe.title = data["title"]
        recipe.total_time = data["total_time"]
        recipe.description = data["description"]
        recipe.preview_image_url = data["preview_image_url"]

        # compare lengths of the ingredients on recipe
        # iterate over ingredients
        ingredient_difference = len(data["ingredients"]) - len(recipe.ingredients)

        for new_ingredient, old_ingredient in zip(data["ingredients"], recipe.ingredients):
                if validIngredient(new_ingredient):
                    old_ingredient.ingredient = new_ingredient["ingredient"]
                    old_ingredient.amount = new_ingredient["amount"]
                    old_ingredient.units = new_ingredient["units"]
                else:
                    return { "errors": ["Invalid Ingredient"] }

        if ingredient_difference > 0: # new ingredients to be added
            # iterate through, update existing ingredients with new data
            for ingredient in data["ingredients"][(ingredient_difference * -1):]: # get the new ingredients
                if validIngredient(ingredient):
                    new_ingredient = Ingredient(
                        ingredient = ingredient["ingredient"],
                        amount = ingredient["amount"],
                        units = ingredient["units"]
                    )
                    recipe.ingredients.append(new_ingredient)
                else:
                    return { "errors": ["Invalid Ingredient"] }
            pass
        elif ingredient_difference < 0: # fewer or same number of ingredients
            # delete the extra recipe ingredients
            for ingredient in recipe.ingredients[ingredient_difference:]:
                recipe.ingredients.remove(ingredient)


        # compare lengths of the methods on recipe
        method_difference = len(data["methods"]) - len(recipe.methods)

        for new_method, old_method in zip(data["methods"], recipe.methods):
                if validMethod(new_method):
                    old_method.details = new_method["details"]
                    old_method.image_url = new_method["image_url"]
                else:
                    return { "errors": ["Invalid Method"] }

        if method_difference > 0: # new methods to be added
        # validate, and create new methods and add them to recipe
            for idx, method in enumerate(data["methods"][(method_difference * -1):]): # iterate over the new methods
                if validMethod(method):
                    new_method = Method(
                        step_number = len(recipe.methods) + 1,
                        details = method["details"],
                        image_url = method["image_url"]
                    )
                    recipe.methods.append(new_method)
                else:
                    return { "errors": ["Invalid Method"] }
        elif method_difference < 0: # fewer or same number of methods
        # if there are fewer methods, remove the methods that were removed
            for method in recipe.methods[method_difference:]:
                recipe.methods.remove(method)

        db.session.commit()
        return recipe.to_dict_detailed()
    else:
        return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@recipe_routes.route('/<int:id>/ingredients', methods=["POST"])
@login_required
def add_ingredients_to_recipe(id):
    """
    Add Ingredient to a Recipe and return the Recipe details
    """
    data = request.get_json()
    recipe = Recipe.query.get(id)
    form = IngredientForm()
    # Get the csrf_token from the request cookie and put it into the
    # form manually to validate_on_submit can be used
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        new_ingredient = Ingredient(
            ingredient = data["ingredient"],
            amount = data["amount"],
            units = data["units"]
        )

        recipe.ingredients.append(new_ingredient)
        db.session.commit()
        return recipe.to_dict_detailed()
    else:
        return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@recipe_routes.route('/<int:id>/methods', methods=["POST"])
@login_required
def add_methods_to_recipe(id):
    """
    Add Method to a Recipe and return the Recipe details
    """
    data = request.get_json()
    recipe = Recipe.query.get(id)
    form = MethodForm()
    # Get the csrf_token from the request cookie and put it into the
    # form manually to validate_on_submit can be used
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        new_method = Method(
            step_number = data["step_number"],
            details = data["details"]
        )

        recipe.methods.append(new_method)
        db.session.commit()
        return recipe.to_dict_detailed()
    else:
        return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@recipe_routes.route('/<int:id>', methods=["DELETE"])
@login_required
def delete_recipe(id):
    """
    Delete existing recipe and all it's methods, ingredients, and reviews
    User must be logged in and authorized
    """
    recipe = Recipe.query.get(id)

    if not recipe:
        return { "errors": ["Recipe could not be found"] }
    elif recipe.author.id != current_user.id:
        return { "errors": ["User is unauthorized to delete this recipe"] }, 401
    else:
        db.session.delete(recipe)
        db.session.commit()
        return { "message": "Successfully Removed" }
