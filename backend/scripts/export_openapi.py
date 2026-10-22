import json
import os
import sys

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app

def export_schema():
    openapi_schema = app.openapi()
    output_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../shared/contracts"))
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "openapi.json")
    
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(openapi_schema, f, indent=2)
    
    print(f"Successfully exported OpenAPI schema to: {output_path}")

if __name__ == "__main__":
    export_schema()
