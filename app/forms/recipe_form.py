from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, FieldList, FormField, FloatField, Form
from wtforms.validators import DataRequired, ValidationError
import json

def tag_validation(form, field):
    tags = json.loads(field.data)

    if len(tags) < 5:
        raise ValidationError("Must have at least 5 tags")

    for tag in tags:
        if not tag.strip():
            raise ValidationError("Tags Cannot Be Empty Strings")
        if len(tag) > 60:
            raise ValidationError("Tags Cannot Be Longer Than 60 Characters")


def ingredient_validation(form, field):
    ingredients = json.loads(field.data)

    for ingredient in ingredients:
        if not ingredient["ingredient"]:
            raise ValidationError("Ingredient Name Required")
        if not float(ingredient["amount"]) > 0:
            raise ValidationError("Invalid Ingredient Amount")


def method_validation(form, field):
    methods = json.loads(field.data)

    for method in methods:
        if not method["details"]:
            raise ValidationError("Method Details Required")


class RecipeForm(FlaskForm):
    title = StringField("title", validators=[DataRequired(message="Title Required")])
    preview_image_url = StringField("preview_image_url", validators=[DataRequired(message="Preview Image Required")])
    total_time = IntegerField("time", validators=[DataRequired(message="Total Time Required")])
    description = StringField("description", validators=[DataRequired(message="Description Required")])
    ingredients = StringField("ingredients", validators=[ingredient_validation])
    methods = StringField("methods", validators=[method_validation])
    tags = StringField("tags", validators=[tag_validation])
