from flask import Blueprint, request
from flask_login import login_required, current_user
from .auth_routes import validation_errors_to_error_messages
from .utils.recipe_utils import add_ingredients, add_methods, add_tags, update_ingredients, update_methods, update_tags
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

        recipe.title = data["title"]
        recipe.total_time = data["total_time"]
        recipe.description = data["description"]
        recipe.preview_image_url = data["preview_image_url"]

        update_ingredients(recipe, ingredients_list)
        update_methods(recipe, methods_list)
        update_tags(recipe, tags_list)

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


@recipe_routes.route('/<int:id>/likes', methods=["POST"])
@login_required
def like_recipe(id):
    """
    Add current logged in user to recipes liked_users, and return the recipe object
    """
    recipe = Recipe.query.get(id)

    # should users be able to like their own recipes? Maybe not?
    if not recipe:
        return { "errors": ["Recipe could not be found"] }, 404
    elif current_user in recipe.liked_users:
        return { "errors": ["User already liked Recipe"] }, 401
    else:
        recipe.liked_users.append(current_user)
        db.session.commit()
        return recipe.to_dict()


@recipe_routes.route('/<int:id>/likes', methods=["DELETE"])
@login_required
def remove_like(id):
    """
    Remove current user from Recipe liked_users and return Recipe as dictionary
    """
    recipe = Recipe.query.get(id)

    if not recipe:
        return { "errors": ["Recipe could not be foudn"] }, 404
    elif current_user not in recipe.liked_users:
        return { "errors": ["User has not liked this Recipe"]}, 401
    else:
        recipe.liked_users.remove(current_user)
        db.session.commit()
        return recipe.to_dict()
