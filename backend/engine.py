import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool 
from contextlib import contextmanager
from .base import Base

engine = None
SessionLocal = None  

def create_db(db_url=None, create_schema=False):
    global engine, SessionLocal

    db_url = db_url or os.getenv("DATABASE_URL")
    if not db_url:
        raise RuntimeError("DATABASE_URL is not set!")

    connect_args = {}

    if "sqlite" in db_url:
        connect_args["check_same_thread"] = False

    engine = create_engine(
        db_url,
        future=True,
        connect_args=connect_args,
        poolclass=NullPool,
    )

    SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

    if create_schema:
        from . import schemas
        Base.metadata.create_all(engine)

    return engine

@contextmanager
def get_session():
    global SessionLocal

    if SessionLocal is None:
        raise RuntimeError("Session not initialized. Call create_db() first.")

    db = SessionLocal()
    try:
        yield db
        db.commit() 
    except:
        db.rollback()  
        raise
    finally:
        db.close()