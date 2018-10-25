FROM python:3.6-alpine

RUN apk add --no-cache \
    gcc \
    musl-dev \
&& pip install gevent

COPY /pylib /app/pylib
WORKDIR /app/pylib
RUN python setup.py install

COPY /backend /app/backend
WORKDIR /app/backend
RUN python setup.py install

CMD ["python", "-m", "near.dash_backend.run"]
