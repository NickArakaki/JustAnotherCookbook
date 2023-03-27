from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, FieldList, FormField, FloatField, Form
from wtforms.validators import DataRequired, ValidationError
import json

def tag_validation(form, field):
    # Checking if user exists
    tags = json.loads(field.data)
    pass


def ingredient_validation(form, field):
    ingredients = json.loads(field.data)
    # if ingredient["ingredient"] and (float(ingredient["amount"]) > 0):
    print("ingredients =================================", ingredients)
    for ingredient in ingredients:
        print("ingredient =============================", ingredient)

    pass

class RecipeForm(FlaskForm):
    title = StringField("title", validators=[DataRequired(message="Title Required")])
    preview_image_url = StringField("preview_image_url", validators=[DataRequired(message="Preview Image Required")])
    total_time = IntegerField("time", validators=[DataRequired(message="Total Time Required")])
    description = StringField("description", validators=[DataRequired(message="Description Required")])
    ingredients = StringField("ingredients", validators=[ingredient_validation])
    tags = StringField("tags", validators=[tag_validation])
