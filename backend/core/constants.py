import os
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

ENV = os.getenv("ENV", "dev")

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL environment variable is not set!")

BASE_DIR = Path(__file__).resolve().parent.parent
WORDS_URL = BASE_DIR / "assets" / "words.txt"
NUM_CARDS = int(os.getenv("NUM_CARDS", 25))