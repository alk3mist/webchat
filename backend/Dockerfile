FROM python:3.7-slim-stretch
WORKDIR /app
COPY requirements.txt /tmp
RUN apt-get update
RUN apt-get -y install gcc
RUN pip install -r /tmp/requirements.txt
RUN apt-get -y remove gcc
RUN apt-get -y autoclean
RUN apt-get -y autoremove
VOLUME [ "/app" ]
EXPOSE 80
CMD python manage.py migrate; python manage.py runserver 0.0.0.0:80
