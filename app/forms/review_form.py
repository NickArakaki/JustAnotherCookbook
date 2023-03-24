from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired, NumberRange

class ReviewForm(FlaskForm):
    rating = IntegerField("rating", validators=[DataRequired(message="Rating Required"), NumberRange(min=1, max=5, message="Rating must be between 1 and 5")])
    review = StringField("review", validators=[DataRequired(message="Review Required")])
