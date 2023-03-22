from .db import db, environment, SCHEMA, add_prefix_for_prod

class Method(db.Model):
    __tablename__ = "methods"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    recipe_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("recipes.id")), nullable=False)
    step_number = db.Column(db.Integer, nullable=False)
    details = db.Column(db.String, nullable=False)
    image_url = db.Column(db.String, nullable=True)

    recipe = db.relationship("Recipe", back_populates="methods")


    def to_dict(self):
        return {
            "step_number": self.step_number,
            "details": self.details
        }
