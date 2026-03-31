import random
from schemas.card import Card

def create_board(game_id, turn, words):       

    if turn == "red":
        red_cards = 9
        blue_cards = 8
    else:
        red_cards = 8
        blue_cards = 9

    assassin = 1
    neutral = 7

    meta_cards = {
        "assassin" : assassin,
        "red" : red_cards,
        "blue" : blue_cards,
        "neutral" : neutral
        }

    cards = []
    for word in words:
            valid_choices = []
            for card_type, count in meta_cards.items():
                if count > 0:
                    valid_choices.append(card_type)
            card_type = random.choice(valid_choices)
            meta_cards[card_type] -= 1

            new_card = Card(game_id=game_id, word=word, card_type=card_type)
            cards.append(new_card)


    return cards
