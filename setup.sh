#!/bin/bash

echo "🏥 Configuration du projet Medicare..."

# Backend
echo "📦 Configuration du backend..."
cd medicare_backend
cp .env.example .env
echo "✅ Copiez le fichier .env et modifiez les paramètres selon votre environnement"

# Frontend
echo "📦 Configuration du frontend..."
cd ../medicare-admin
cp .env.example .env

# Mobile
echo "📦 Configuration du mobile..."
cd ../medicare-mobile
cp .env.example .env

echo "✅ Projet configuré !"
echo "📖 Consultez le README.md pour les prochaines étapes"
