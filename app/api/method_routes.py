from flask import Blueprint, request
from flask_login import login_required, current_user
from .auth_routes import validation_errors_to_error_messages
from app.models import db, Recipe, Ingredient, Method
from app.forms import RecipeForm, MethodForm, IngredientForm

method_routes = Blueprint('methods', __name__)


@method_routes.route('/<int:id>', methods=["PUT"])
@login_required
def update_method(id):
    """
    Update method based on method id, user must be logged in and the Recipe author
    """
    method = Method.query.get(id)

    if not method:
        return { "errors": ["Method could not be found"] }, 404
    elif method.recipe.author_id != current_user.id:
        return { "errors": ["User is not authorized to update this Method"] }, 401

    data = request.get_json()
    form = MethodForm()
    # Get the csrf_token from the request cookie and put it into the
    # form manually to validate_on_submit can be used
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        method.details = data["details"]
        db.session.commit()
        return method.recipe.to_dict_detailed()
    else:
        return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@method_routes.route('/<int:id>', methods=["DELETE"])
@login_required
def delete_method(id):
    """
    Deletes an existing Method, user must be logged in and authorized to delete Method
    """
    method = Method.query.get(id)

    if not method:
        return { "errors": ["Method could not be found"] }, 404
    elif method.recipe.author_id != current_user.id:
        return { "errors": ["User not authorized to delete this method"] }, 401
    else:
        db.session.delete(method)
        db.session.commit()
        return { "message": "Successfully Removed" }
