# Comptes de démonstration

## Administrateur
- utilisateur : admin
- mot de passe : admin123
- Accès : Gestion complète de la plateforme

## Soignant
- utilisateur : soig1
- mot de passe : soig123
- Accès : Ses patients et visites

## Patient
- utilisateur : pat1
- mot de passe : pat123
- Accès : Ses propres données uniquement

## Création des comptes

```bash
# Via l'admin Django
python manage.py createsuperuser

# Ou via les fixtures
python manage.py loaddata core/fixtures/initial_data.json

### scripts/build_final_package.sh
```bash
#!/bin/bash

set -e

FINAL_DIR="../livrable_final"

echo "🚀 Création du package final Medicare..."

# Nettoyage
rm -rf "$FINAL_DIR"
mkdir -p "$FINAL_DIR"

echo "[1/5] Copie du backend..."
cp -r medicare_backend "$FINAL_DIR/medicare_backend"

echo "[2/5] Copie du frontend web..."
cp -r medicare-admin "$FINAL_DIR/medicare-admin"

echo "[3/5] Copie du mobile..."
cp -r medicare-mobile "$FINAL_DIR/medicare-mobile"

echo "[4/5] Copie des docs..."
mkdir "$FINAL_DIR/docs"
cp -r docs/* "$FINAL_DIR/docs/" 2>/dev/null || echo "Pas de docs à copier"

echo "[5/5] Copie des fichiers racine..."
cp docker-compose.yml "$FINAL_DIR/"
cp README.md "$FINAL_DIR/" 2>/dev/null || echo "README.md non trouvé"

echo "✅ Package final créé dans $FINAL_DIR"
echo "📦 Vous pouvez maintenant zipper le dossier ou le déployer"