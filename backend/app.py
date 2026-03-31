import importlib
import pkgutil

from fastapi import FastAPI
from contextlib import asynccontextmanager

from engine import create_db
from apis import __path__ as api_path

from core.constants import DB_CONNECTION_STRING


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db(DB_CONNECTION_STRING, create_schema=True)
    import_all_routers()
    yield 

app = FastAPI(lifespan=lifespan)

def import_all_routers():
    for loader, module_name, is_pkg in pkgutil.iter_modules(api_path):
        module = importlib.import_module(f"apis.{module_name}")
        if hasattr(module, "router"):
            app.include_router(module.router)

