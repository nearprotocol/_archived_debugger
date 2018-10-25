FROM python:3.6-alpine

WORKDIR /app/collector
COPY /collector /app/collector
RUN python setup.py install

CMD ["python", "-m", "near.dash_collector.run"]
