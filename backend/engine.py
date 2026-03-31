from sqlalchemy import create_engine
from core.constants import DB_CONNECTION_STRING
from sqlalchemy.orm import sessionmaker 
from base import Base
from contextlib import contextmanager

engine = None
SessionLocal = None  

def create_db(db_url, create_schema=False):
    global engine, SessionLocal

    engine = create_engine(
        db_url,
        future=True,
        connect_args={"check_same_thread": False} 
    )

    SessionLocal = sessionmaker(bind=engine)

    if create_schema:
        import schemas
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