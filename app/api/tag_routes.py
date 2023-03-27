from datetime import datetime, timezone
from flask import Blueprint, request
from flask_login import login_required, current_user
from .auth_routes import validation_errors_to_error_messages
from app.models import db, Tag
from app.forms import ReviewForm

tag_routes = Blueprint("tags", __name__)

@tag_routes.route("/<int:id>")
def get_recipes_by_tag_name(id):
    tag = Tag.query.get(id)

    if not tag:
        return { "errors": ["Tag could not be found"] }, 404


    return { "recipes": [recipe.to_dict() for recipe in tag.recipes] }
