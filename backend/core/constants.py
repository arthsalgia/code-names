import os
from dotenv import load_dotenv

load_dotenv()

ENV = os.getenv("ENV", "dev")

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL environment variable is not set!")

WORDS_URL = os.getenv("WORDS_URL")
NUM_CARDS = int(os.getenv("NUM_CARDS", 25))