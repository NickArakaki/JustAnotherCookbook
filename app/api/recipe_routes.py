from flask import Blueprint, request
from flask_login import login_required, current_user
from .auth_routes import validation_errors_to_error_messages
from .recipe_utils import add_ingredients, add_methods, add_tags
from app.models import db, Recipe, Ingredient, Method, Review, Tag
from app.forms import RecipeForm, ReviewForm
import json

recipe_routes = Blueprint('recipes', __name__)


# Routes
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
    if not recipe:
        return { "errors": ["Recipe could not be found."] }, 404
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
    if form.validate_on_submit():
        ingredient_list = json.loads(data["ingredients"])
        method_list = json.loads(data["methods"])
        tag_list = json.loads(data["tags"])

        new_recipe = Recipe(
            author_id = current_user.id,
            title = data["title"],
            total_time = data["total_time"],
            description = data["description"],
            preview_image_url = data["preview_image_url"]
        )
        db.session.add(new_recipe)

        add_ingredients(new_recipe, ingredient_list)
        add_methods(new_recipe, method_list)
        add_tags(new_recipe, tag_list)

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
        return { "errors": ["User is not authorized to edit this Recipe"] }, 403

    # Form validations
    if form.validate_on_submit():
        ingredients_list = json.loads(data["ingredients"])
        methods_list = json.loads(data["methods"])
        tags_list = json.loads(data["tags"])
        db_tags_list = Tag.query.all()

        recipe.title = data["title"]
        recipe.total_time = data["total_time"]
        recipe.description = data["description"]
        recipe.preview_image_url = data["preview_image_url"]

        # INGREDIENTS
        # compare lengths of the ingredients on recipe
        # iterate over ingredients
        ingredient_difference = len(ingredients_list) - len(recipe.ingredients)

        for new_ingredient, old_ingredient in zip(ingredients_list, recipe.ingredients):
                    old_ingredient.ingredient = new_ingredient["ingredient"]
                    old_ingredient.amount = new_ingredient["amount"]
                    old_ingredient.units = new_ingredient["units"]

        if ingredient_difference > 0: # new ingredients to be added
            # iterate through, update existing ingredients with new data
            for ingredient in ingredients_list[(ingredient_difference * -1):]: # get the new ingredients
                    new_ingredient = Ingredient(
                        ingredient = ingredient["ingredient"],
                        amount = ingredient["amount"],
                        units = ingredient["units"]
                    )
                    recipe.ingredients.append(new_ingredient)
        elif ingredient_difference < 0: # fewer or same number of ingredients
            # delete the extra recipe ingredients
            for ingredient in recipe.ingredients[ingredient_difference:]:
                recipe.ingredients.remove(ingredient)

        # METHODS
        # compare lengths of the methods on recipe
        method_difference = len(methods_list) - len(recipe.methods)

        for new_method, old_method in zip(methods_list, recipe.methods):
                    old_method.details = new_method["details"]
                    old_method.image_url = new_method["image_url"]

        if method_difference > 0: # new methods to be added

            for idx, method in enumerate(methods_list[(method_difference * -1):]): # iterate over the new methods
                    new_method = Method(
                        step_number = len(recipe.methods) + 1,
                        details = method["details"],
                        image_url = method["image_url"]
                    )
                    recipe.methods.append(new_method)

        elif method_difference < 0: # fewer or same number of methods
        # if there are fewer methods, remove the methods that were removed
            for method in recipe.methods[method_difference:]:
                recipe.methods.remove(method)

        # TAGS
        # get list of tags for incoming change (either get existing tag, or create new one)
        new_tags = []
        for tag in tags_list:
            existing_tag = [db_tag for db_tag in db_tags_list if db_tag.tag == tag]
            if existing_tag:
                new_tags.append(*existing_tag)
            if not existing_tag:
                new_tag = Tag(tag=tag)
                db.session.add(new_tag)
                new_tags.append(new_tag)

        # compare incoming tags and recipe tags as sets
            # remove the ones that are in recipe tags and not incoming
            # add the ones that are in incoming and not in recipe tags
        tags_to_remove = set(recipe.tags) - set(new_tags)
        tags_to_add = set(new_tags) - set(recipe.tags)
        for tag in tags_to_remove:
            recipe.tags.remove(tag)
            if not tag.recipes:
                db.session.delete(tag)

        for tag in tags_to_add:
            recipe.tags.append(tag)

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
        return { "errors": ["Recipe could not be found"] }, 404
    elif recipe.author.id != current_user.id:
        return { "errors": ["User is unauthorized to delete this recipe"] }, 403
    else:
        db.session.delete(recipe)
        db.session.commit()
        return { "message": "Successfully Removed" }


@recipe_routes.route('/<int:id>/reviews', methods=["POST"])
@login_required
def post_a_review(id):
    """
    Create and return a Review for a recipe using Recipe id
    """
    recipe = Recipe.query.get(id)
    if not recipe:
        return { "errors": ["Recipe could not be found."] }, 404
    elif recipe.author.id == current_user.id: # User cannot leave Review on their own Recipe
        return { "errors": ["User not authorized to leave comment on own Recipe"] }, 403
    elif current_user.id in [review.user_id for review in recipe.reviews]: # User cannot leave more than one Review per Recipe
        return { "errors": ["User cannot leave more than 1 Review per Recipe"] }, 401
    # should also prevent users from making more than one review per recipe

    form = ReviewForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        new_review = Review(
            user_id = current_user.id,
            rating = form.data["rating"],
            review = form.data["review"]
        )
        recipe.reviews.append(new_review)
        db.session.commit()
        return new_review.to_dict_summary()
    else:
        return {'errors': validation_errors_to_error_messages(form.errors)}, 401
