from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired


class MethodForm(FlaskForm):
    step_number = IntegerField("Step Number", validators=[DataRequired("Step Number Required")])
    details = StringField("details", validators=[DataRequired("Details Required")])
