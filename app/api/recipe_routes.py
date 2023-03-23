from flask import Blueprint, request
from flask_login import login_required, current_user
from .auth_routes import validation_errors_to_error_messages
from app.models import db, Recipe, Ingredient, Method
from app.forms import RecipeForm

recipe_routes = Blueprint('recipes', __name__)

def validIngredient(ingredient):
    isValid = False
    if ingredient["ingredient"] and ingredient["amount"]:
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
    print("data =============================", data)
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
        # db.session.commit()

        for ingredient in data["ingredients"]:
            new_ingredient = Ingredient(
                recipe_id = new_recipe.id,
                ingredient = ingredient["ingredient"],
                amount = ingredient["amount"],
                units = ingredient["units"]
            )
            db.session.add(new_ingredient)

        for idx, method in enumerate(methodsList):
            new_method = Method(
                recipe_id = new_recipe.id,
                step_number = idx + 1,
                details = method["details"],
                image_url = method["imageURL"]
            )
            db.session.add(new_method)

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

        # compare lengths of the ingredients on recipe
        # iterate over ingredients

        # compare lengths of the methods on recipe
        # if there are new methods, create new methods and add them to recipe
        # if there are fewer methods, remove the methods that were removed
        # iterate over methods

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
