from flask import Blueprint, request
from flask_login import login_required, current_user
from .auth_routes import validation_errors_to_error_messages
from app.models import db, Recipe
from app.forms import RecipeForm

recipe_routes = Blueprint('recipes', __name__)


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

    if form.validate_on_submit():
        new_recipe = Recipe(
            author_id = current_user.id,
            title = data["title"],
            total_time = data["total_time"],
            description = data["description"]
        )

        db.session.add(new_recipe)
        db.session.commit()
        return new_recipe.to_dict_detailed()
    else:
        return {'errors': validation_errors_to_error_messages(form.errors)}, 401
