from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import User

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict_author() for user in users]}


@user_routes.route('/<int:id>')
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()


@user_routes.route('/<int:id>/recipes')
def get_user_recipes(id):
    """
    Query for a user's recipes by user id and returns a list of recipe dictionaries
    """
    user = User.query.get(id)
    return { "recipes": [recipe.to_dict() for recipe in user.recipes] }


@user_routes.route('/<int:id>/favorites')
@login_required
def get_users_favorite_recipes():
    """
    Query for logged in users favorite recipes and return as list of recipe dictionaries
    """
    return { "recipes": [recipe.to_dict() for recipe in current_user.liked_recipes] }
