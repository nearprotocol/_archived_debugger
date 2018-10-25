FROM python:3.6-alpine

RUN apk add --no-cache \
    gcc \
    musl-dev \
&& pip install gunicorn==19.9.0 \
    gevent==1.3.7

COPY /pylib /app/pylib
WORKDIR /app/pylib
RUN python setup.py install

COPY /mock-node /app/mock-node
WORKDIR /app/mock-node
RUN python setup.py install

CMD ["gunicorn", "-k", "gevent", "--bind=0.0.0.0:5000", "near.dash_mock_node.run:app"]
