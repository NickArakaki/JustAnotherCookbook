from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired


class RecipeForm(FlaskForm):
    title = StringField("title", validators=[DataRequired("Title Required")])
    total_time = IntegerField("time", validators=[DataRequired("Total Time Required")])
    description = StringField("description", validators=[DataRequired("Description Required")])
