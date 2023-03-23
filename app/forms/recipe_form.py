from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, FieldList, FormField, FloatField, Form
from wtforms.validators import DataRequired

class IngredientForm(Form):
    # disable csrf for subform
    class Meta:
        csrf = False

    ingredient = StringField("ingredient", validators=[DataRequired(message="Ingredient Required")])
    amount = FloatField("amount", validators=[DataRequired(message="Amount Required")])
    units = StringField("units")


class MethodForm(Form):
    # disable csrf for subform
    class Meta:
        csrf = False

    details = StringField("details", validators=[DataRequired(message="Details Required")])
    imageURL = StringField("image url")


class RecipeForm(FlaskForm):
    title = StringField("title", validators=[DataRequired(message="Title Required")])
    preview_image_url = StringField("preview_image_url", validators=[DataRequired(message="Preview Image Required")])
    total_time = IntegerField("time", validators=[DataRequired(message="Total Time Required")])
    description = StringField("description", validators=[DataRequired(message="Description Required")])
    ingredients = FieldList(FormField(IngredientForm), min_entries=1)
    methods = FieldList(FormField(MethodForm), min_entries=1)
