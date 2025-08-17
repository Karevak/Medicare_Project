#!/bin/bash

echo "🚀 Démarrage de la démo Medicare..."

# Vérification des prérequis
command -v docker-compose >/dev/null 2>&1 || { echo "❌ docker-compose requis"; exit 1; }

echo "📊 Démarrage des services..."
docker-compose up -d

echo "⏳ Attente de l'initialisation de la base..."
sleep 10

echo "🔄 Application des migrations..."
docker-compose exec backend python manage.py migrate

echo "👤 Création du superuser (si nécessaire)..."
docker-compose exec backend python manage.py createsuperuser --noinput || echo "Superuser existe déjà"

echo "📋 Chargement des données de démo..."
docker-compose exec backend python manage.py loaddata core/fixtures/initial_data.json || echo "Fixtures déjà chargées"

echo "✅ Démo prête !"
echo "🌐 Backend API : http://localhost:8000/api/"
echo "📊 Admin Django : http://localhost:8000/admin/"
echo "🔍 Swagger UI : http://localhost:8000/api/docs/"
echo "🗄️ Adminer : http://localhost:8080/"
echo ""
echo "Pour le frontend web, lancez :"
echo "cd medicare-admin && npm install && npm start"
echo ""
echo "Pour le mobile, lancez :"
echo "cd medicare-mobile && npm install && expo start"