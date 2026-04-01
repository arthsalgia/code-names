import random
from engine import get_session
from ..schemas.game import Game

def new_game_id():
    pass
    # I might come back and change this sometime if i dont like the game id being an int
    # the below code is also kinda wrong since it might produce something like 00000 or 10000 
    # def get_id():
    #     options = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    #     id = ""

    #     for _ in range(5):
    #         id += random.choice(options)

    #     return id
    
    # id = get_id()

    # with get_session() as session:
    #     prev_ids = session.query(Game.id).all()

    #     while True:
    #         if id in prev_ids:
    #             id = get_id()
    #         else:
    #             break
            
