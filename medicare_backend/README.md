# Medicare Backend (Django)

## Setup

1. Copiez `.env.example` en `.env` et modifiez selon votre configuration.
2. Créez votre base MySQL nommée `medicare`.
3. Créez un environnement virtuel :
    ```
    python -m venv venv
    source venv/bin/activate  # ou venv\Scripts\activate sous Windows
    ```
4. Installez les dépendances :
    ```
    pip install -r requirements.txt
    ```
5. Appliquez les migrations :
    ```
    python manage.py migrate
    ```
6. Créez un superutilisateur :
    ```
    python manage.py createsuperuser
    ```
7. Lancez le serveur :
    ```
    python manage.py runserver
    ```

## Fichiers principaux :
- `.env` : variables sensibles (non versionnées)
- `medicare/settings.py` : utilise `os.environ.get(...)` pour tous les paramètres secrets/DB.
