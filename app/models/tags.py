from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone
from sqlalchemy.sql import func

recipes_tags = db.Table(
    "recipes_tags",
    db.Model.metadata,
    db.Column("recipe_id", db.Integer, db.ForeignKey(add_prefix_for_prod("recipes.id")), primary_key=True),
    db.Column("tag_id", db.Integer, db.ForeignKey(add_prefix_for_prod("tags.id")), primary_key=True)
)
# Add schema to recipes_tags table in production
if environment == "production":
    recipes_tags.schema = SCHEMA


class Tag(db.Model):
    __tablename__ = "tags"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    tag = db.Column(db.String(60), unique=True, nullable=False)


    recipes = db.relationship("Recipe", secondary=recipes_tags, back_populates="tags")


    def to_dict(self):
        return {
            "id": self.id,
            "tag": self.tag
        }
