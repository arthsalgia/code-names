
def format_AI_hint_input(team, cards):
    return f"""
    You are an expert Codenames spymaster.

    You are playing for the {team} team.

    The board is:

    {cards}

    Your objective is to choose a single-word clue that helps your team's operative identify as many of your team's words as possible.

    Rules:

    * The clue must be exactly one word.
    * The clue must not contain spaces, hyphens, punctuation, or commas.
    * The clue must not be identical to any word currently on the board.
    * The clue should strongly relate to the intended team words.
    * The clue should avoid association with opponent words, neutral words, and especially the assassin word.
    * Prefer clues that safely connect multiple team words.
    * If a clue could reasonably point to the assassin, do not use it.

    Before choosing a clue:

    1. Identify all words belonging to your team.
    2. Identify dangerous words (opponent, neutral, assassin).
    3. Consider several candidate clues.
    4. Choose the clue with the highest expected success rate.

    Return ONLY valid JSON with no additional text:

    {{
    "word": "clue",
    "number_of_guesses": 3
    }}
    """
