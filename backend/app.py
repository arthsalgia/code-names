import importlib
import pkgutil

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .engine import create_db
from backend.apis import __path__ as api_path

from . core.constants import ENV, DATABASE_URL



@asynccontextmanager
async def lifespan(app: FastAPI):
    print(f"Starting app in {ENV} mode")
    yield
    print("Shutting down app")

app = FastAPI(lifespan=lifespan, title="Codenames API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
create_db(DATABASE_URL, create_schema=True)

def import_all_routers():
    for loader, module_name, is_pkg in pkgutil.iter_modules(api_path):
        module = importlib.import_module(f"backend.apis.{module_name}")
        if hasattr(module, "router"):
            app.include_router(module.router)

import_all_routers()

@app.get("/")
def read_root():
    return {"message": "Hello, Codenames backend is running!"}
