# Schéma de la base de données Medicare

## Diagramme relationnel

## Tables

### User
- id (PK)
- username (unique)
- password (hashed)
- email
- role ('admin', 'soignant', 'patient')
- is_active, is_staff, is_superuser
- date_joined, last_login

### Patient
- id (PK)
- user_id (FK → User)
- address
- birth_date

### Soignant
- id (PK)
- user_id (FK → User)
- speciality

### Visite
- id (PK)
- patient_id (FK → Patient)
- soignant_id (FK → Soignant)
- date (datetime)
- compte_rendu (text, optional)

### Soin
- id (PK)
- patient_id (FK → Patient)
- soignant_id (FK → Soignant, nullable)
- type ('visite' ou 'acte')
- description (text)
- date (datetime)
- visite_id (FK → Visite, nullable)

### Message
- id (PK)
- sender_id (FK → User)
- receiver_id (FK → User)
- content (text)
- timestamp (auto)

### PushToken
- id (PK)
- user_id (FK → User)
- token (Expo push token)