from flask_wtf import FlaskForm
from wtforms import StringField, FloatField
from wtforms.validators import DataRequired


class IngredientForm(FlaskForm):
    ingredient = StringField("ingredient", validators=[DataRequired("Ingredient Required")])
    amount = FloatField("Amount", validators=[DataRequired("Amount Required")])
    units = StringField("units", validators=[DataRequired("Units Required")])
