#### Requirements
* python 3.7
* pipenv
* redis


To install `python` dependencies, run:
```bash
cd backend
pipenv install
```
If installation fails, run:
```bash
pipenv install --skip-lock
```
See [this issue](https://github.com/django/channels/issues/1277) for details.

To start server, run:
```bash
cd backend
pipenv shell
./manage.py migrate
./manage.py runserver
```
