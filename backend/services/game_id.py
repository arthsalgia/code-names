import random
from sqlalchemy import select
from ..schemas.game import Game

def new_game_id(session):

    def get_id():
        numbers = "1234567890"
        chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
        new_id = ""

        for _ in range(2):
            new_id += random.choice(numbers)
        for _ in range(3):
            new_id += random.choice(chars)

        new_id = ''.join(random.sample(new_id, len(new_id)))

        prev_ids = session.execute(select(Game.id)).scalars().all()
        if new_id not in prev_ids:
            return new_id
        else:
            return False

    
    id = (get_id())


    while not id:
        id = get_id()
    
    return id