FROM public.ecr.aws/lambda/python:3.12

# Copy uv from the official image
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Set working directory
WORKDIR ${LAMBDA_TASK_ROOT}

# Copy only dependency files first (best for caching)
COPY pyproject.toml uv.lock ./

# 1. Export dependencies WITHOUT hashes and WITHOUT the local project package
# 2. Install them directly into the Lambda task root
RUN uv export --frozen --no-dev --no-hashes --no-emit-project > requirements.txt && \
    pip install -r requirements.txt --target "${LAMBDA_TASK_ROOT}"

# Copy the rest of the application
COPY . ${LAMBDA_TASK_ROOT}

# Set the CMD to your handler
CMD [ "app.adapter.handler" ]