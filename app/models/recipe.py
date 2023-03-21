from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone

class Recipe(db.Model):
    __tablename__ = "recipes"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    author_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    total_time = db.Column(db.Integer, nullable=False)
    description = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.Date, nullable=False, default=datetime(timezone.utc))
    updated_at = db.Column(db.Date, nullable=False, default=datetime(timezone.utc))

    reviews = db.relationship("Review", back_populates="recipe")
    author = db.relationship("User", back_populates="recipes")
    ingredients = db.relationship("Ingredient", back_populates="recipe")
    methods = db.relationship("Method", back_populates="recipe")
