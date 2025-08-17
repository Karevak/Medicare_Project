# 🏥 Projet Medicare

Plateforme complète de suivi médical à domicile avec backend Django REST, interface web React et application mobile React Native.

## 🚀 Démarrage rapide

### Avec Docker Compose (Recommandé)

```bash
# Lancer tous les services
docker-compose up -d

# Appliquer les migrations
docker-compose exec backend python manage.py migrate

# Créer un superuser
docker-compose exec backend python manage.py createsuperuser
```

**Accès :**
- API Backend : http://localhost:8000/api/
- Admin Django : http://localhost:8000/admin/
- Documentation API : http://localhost:8000/api/docs/
- Adminer (DB) : http://localhost:8080/

### Frontend Web

```bash
cd medicare-admin
cp .env.example .env
npm install
npm start
```

### Application Mobile

```bash
cd medicare-mobile
cp .env.example .env
npm install
expo start
```

## 👥 Comptes de test

- **Admin :** admin / admin123
- **Soignant :** soig1 / soig123  
- **Patient :** pat1 / pat123

## 📚 Stack Technique

- **Backend :** Django 4.2, DRF, MySQL, JWT
- **Frontend :** React 18, Axios
- **Mobile :** React Native, Expo
- **Déploiement :** Docker, Azure, Render

## ✅ Fonctionnalités

- Authentification JWT avec refresh tokens
- Gestion des patients, soignants et visites
- Historique des soins avec timeline
- Messagerie sécurisée
- Notifications push et emails
- Interface d'administration web
- Application mobile native
- API REST documentée
- Tests automatisés

Pour le code complet, consultez l'artifact fourni avec ce script.
