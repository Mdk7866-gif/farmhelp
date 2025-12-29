# How to set up `uv run dev` (Custom Scripts)

If you want to create custom commands like `uv run dev` in the future for other projects, here is the recipe.

## 1. Create a Python Entry Point
Instead of running a shell command, it's more robust to call a Python function.

In your `main.py` (or any python file), add a function that starts your app. Current example in `app/main.py`:

```python
def start():
    """Launched with `uv run dev` at root level"""
    import uvicorn
    # The string "app.main:app" must match your file structure
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
```

## 2. Register the Script in `pyproject.toml`
Add a `[project.scripts]` section. The key (`dev`) is the command name, and the value is `path.to.module:function_name`.

```toml
[project.scripts]
dev = "app.main:start"
```

## 3. Ensure Your Project is Runnable
For `uv` to find `app.main`, your project needs to be installed as a package. You need a build system.

Add this to the **top** of `pyproject.toml`:
```toml
[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

# Change "app" to whatever your source folder is named
[tool.hatch.build.targets.wheel]
packages = ["app"]
```

## 4. Sync
Run this command to update the environment and install your script:
```bash
uv sync
```

Now you can run:
```bash
uv run dev
```
