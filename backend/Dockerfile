FROM python:3.7-slim-stretch
WORKDIR /app
COPY requirements.txt /tmp
RUN apt-get update \
    && apt-get -y install gcc \
    && pip install -r /tmp/requirements.txt
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
VOLUME [ "/app" ]
EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]
CMD ["python", "manage.py", "runserver", "0.0.0.0:80"]
