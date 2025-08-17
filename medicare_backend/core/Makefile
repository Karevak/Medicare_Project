.PHONY: run test lint format migrate collectstatic reminders

run:
	python manage.py runserver

test:
	python manage.py test

migrate:
	python manage.py migrate

collectstatic:
	python manage.py collectstatic --noinput

reminders:
	python manage.py send_visit_reminders

install:
	pip install -r requirements.txt
	cp .env.example .env
	python manage.py migrate
	python manage.py createsuperuser