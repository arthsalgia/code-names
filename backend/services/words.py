from random import sample
from core.constants import NUM_CARDS, WORDS_URL

def get_words(num = NUM_CARDS):
    try:
        words = []
        with open(WORDS_URL) as file:                
            for line in file:
                words.append(line.strip().lower())
        return sample(words, num)
    except FileNotFoundError:
        print("Error: file not found.")
    except Exception as e:
        print(f"error : {e}")
    return []
