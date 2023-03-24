from datetime import datetime, timezone
from flask import Blueprint, request
from flask_login import login_required, current_user
from .auth_routes import validation_errors_to_error_messages
from app.models import db, Review
from app.forms import ReviewForm

review_routes = Blueprint("reviews", __name__)

# Routes
@review_routes.route('/<int:id>', methods=["PUT"])
@login_required
def update_review(id):
    review = Review.query.get(id)

    if not review:
        return { "errors": ["Review could not be found."] }, 404
    elif review.author.id != current_user.id:
        return { "errors": ["User is not authorized to edit this Review"] }, 401

    form = ReviewForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        review.review = form.data["review"]
        review.rating = form.data["rating"]
        review.updated_at = datetime.now(timezone.utc)
        db.session.commit()
        return review.to_dict_summary()
    else:
        return {'errors': validation_errors_to_error_messages(form.errors)}, 401
