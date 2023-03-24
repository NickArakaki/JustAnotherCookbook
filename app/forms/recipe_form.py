from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, FieldList, FormField, FloatField, Form
from wtforms.validators import DataRequired

class RecipeForm(FlaskForm):
    title = StringField("title", validators=[DataRequired(message="Title Required")])
    preview_image_url = StringField("preview_image_url", validators=[DataRequired(message="Preview Image Required")])
    total_time = IntegerField("time", validators=[DataRequired(message="Total Time Required")])
    description = StringField("description", validators=[DataRequired(message="Description Required")])
