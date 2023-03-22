from flask import Blueprint, request
from flask_login import login_required, current_user
from .auth_routes import validation_errors_to_error_messages
from app.models import db, Ingredient
from app.forms import IngredientForm

ingredient_routes = Blueprint('ingredients', __name__)


@ingredient_routes.route('/<int:id>', methods=["PUT"])
@login_required
def update_method(id):
    """
    Update ingredient based on ingredient id, user must be logged in and the Recipe author
    """
    ingredient = Ingredient.query.get(id)

    if not ingredient:
        return { "errors": ["Ingredient could not be found"] }, 404
    elif ingredient.recipe.author_id != current_user.id:
        return { "errors": ["User is not authorized to update this Method"] }, 401

    form = IngredientForm()
    # Get the csrf_token from the request cookie and put it into the
    # form manually to validate_on_submit can be used
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        ingredient.ingredient = data["ingredient"]
        ingredient.amount = data["amount"]
        ingredient.units = data["units"]
        db.session.commit()
        return recipe.to_dict_detailed()
    else:
        return {'errors': validation_errors_to_error_messages(form.errors)}, 401
