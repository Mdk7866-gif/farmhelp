FROM public.ecr.aws/lambda/python:3.12

# Copy uv from the official image
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Copy dependency files
COPY pyproject.toml uv.lock ${LAMBDA_TASK_ROOT}/

# Install dependencies into the specific Lambda task root
# We use --system because we are inside a container and want to install into the python environment (or target directory)
# Using `uv pip install` with `--target` is the standard way for Lambda
RUN uv export --frozen --no-dev --output-file requirements.txt && \
    pip install -r requirements.txt --target "${LAMBDA_TASK_ROOT}"

# Copy the rest of the application
COPY . ${LAMBDA_TASK_ROOT}

# Set the CMD to your handler
CMD [ "app.adapter.handler" ]
