from app.models import db, Method, environment, SCHEMA
from sqlalchemy.sql import text

def seed_methods():
    m1 = Method(
        recipe_id = 1,
        step_number = 1,
        details = "Dissolve 0.5 cup sugar in hot water and let cool to room temp."
    )
    m2 = Method(
        recipe_id = 1,
        step_number = 2,
        details = "For the dough, mix butter, flour, salt, and sugar together with clean hands until well combined. Leaving little flecks of butter throughout is good."
    )
    m3 = Method(
        recipe_id = 1,
        step_number = 3,
        details = "Add cold water to dough mixture to bring it together. Once thoroughly hydrated, cover and place in refrigerator for 20 min."
    )
    m4 = Method(
        recipe_id = 1,
        step_number = 4,
        details = "While the dough is chilling in the fridge, whisk eggs, evaportated milk, and vanilla extract toghether. Then Whisk in the room temperature sugar water into the egg mixture, and set aside."
    )
    m5 = Method(
        recipe_id = 1,
        step_number = 5,
        details = "After 20 min in the refrigerator, knead the chilled dough into a rectangle on a well floured work surface to a quarter in thickness."
    )
    m6 = Method(
        recipe_id = 1,
        step_number = 6,
        details = "Then fold the dough rectangle into thirds (like a letter). Rotate 90 degrees, roll to a quarter inch thickness and fold into thirds again. Then place the dough back in the refrigerator to chill for another 30 min."
    )
    m7 = Method(
        recipe_id = 1,
        step_number = 7,
        details = "After 30 min in the refrigerator, form the dough into a rectangle, and roll to a quareter inch thick. Then use a 3in cookie cutter to cut circles in the dough, and press into a well greased muffin tin"
    )
    m8 = Method(
        recipe_id = 1,
        step_number = 8,
        details = "Fill each tart at least 75% with the egg mixture"
    )
    m9 = Method(
        recipe_id = 1,
        step_number = 9,
        details = "Bake at 400 °F for 15 minutes, then reduce the temperature to 350°F for 12 minutes. The tarts are ready when you can stand a toothpick up in the middle. Let cool to room temperature before enjoying"
    )

    m10 = Method(
        recipe_id = 2,
        step_number = 1,
        details = "Add cereal to bowl and pour milk over it. Done. Simple and easy"
    )

    db.session.add_all([m1,m2,m3,m4,m5,m6,m7,m8,m9])
    db.session.add(m10)
    db.session.commit()


def undo_methods():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.methods RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM methods"))

    db.session.commit()
