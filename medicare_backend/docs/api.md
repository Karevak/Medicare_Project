# Documentation API Medicare

Base URL : `/api/`

## Authentification

### POST `/token/`
- body : `{ "username": "string", "password": "string" }`
- réponse : `{ "access": "JWT", "refresh": "JWT" }`

### POST `/token/refresh/`
- body : `{ "refresh": "JWT" }`
- réponse : `{ "access": "JWT" }`

## Utilisateur connecté

### GET `/me/`
- Retourne le profil du user courant
- Headers : `Authorization: Bearer <token>`

## Patients

### GET `/patients/`
- Liste tous les patients (admin) / soi-même (patient)

### GET `/patients/{id}/`
- Récupérer un patient spécifique

### POST `/patients/`
- Créer un patient (admin uniquement)

## Soignants

### GET `/soignants/`
- Liste des soignants

### GET `/soignants/{id}/`
- Récupérer un soignant spécifique

### POST `/soignants/`
- Créer un soignant (admin uniquement)

## Visites

### GET `/visites/`
- Liste des visites

### POST `/visites/`
- Créer une visite

### PUT `/visites/{id}/`
- Modifier une visite

### DELETE `/visites/{id}/`
- Supprimer une visite

## Soins (Historique)

### GET `/soins/`
- Filtrage par rôle (patient : uniquement ses soins)
- Pagination : 25 éléments par page

### POST `/soins/`
- Créer un soin
- body : `{ "patient": id, "soignant": id, "type": "visite|acte", "description": "string", "date": "ISO_DATE" }`

## Messages

### GET `/messages/`
- Liste des messages de l'utilisateur connecté

### POST `/messages/`
- Envoyer un message
- body : `{ "sender": id, "receiver": id, "content": "string" }`

## Notifications & Push

### POST `/save_push_token/`
- Enregistrer token Expo pour notifications push
- body : `{ "token": "ExpoPushToken" }`

### POST `/send_reminders/`
- Envoi des mails de rappel pour les visites à venir (admin uniquement)

## Erreurs

- 401 Unauthorized : Token absent ou invalide
- 403 Forbidden : Droit insuffisant
- 400 Bad Request : Données invalides
- 404 Not Found : Ressource non trouvée