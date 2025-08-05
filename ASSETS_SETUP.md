# 🖼️ Configuration des Assets - Hôtel Tanfous Beach & Aquapark

## 📁 Structure des Assets

### ✅ Assets Disponibles
- `public/assets/roomsImg/` - Images des chambres (img1.jpg, img2.jpg, img3.jpg)
- `public/assets/headerHeroImg/` - Images du slider d'accueil
- `public/assets/gallery/` - Galerie d'images
- `public/assets/feature/` - Images des fonctionnalités
- `public/assets/events/` - Images des événements
- `public/assets/about/` - Images de la page à propos
- `public/assets/people/` - Images des personnes

### 📋 Assets à Ajouter

#### 🍽️ Restaurant (`public/assets/restaurant/`)
- `main.jpg` - Restaurant principal avec buffet
- `a-la-carte.jpg` - Restaurant à la carte
- `snack.jpg` - Snack bar au bord de la piscine

#### 🏊‍♂️ Activités (`public/assets/activities/`)
- `aquapark.jpg` - Aquapark avec toboggans
- `beach.jpg` - Plage privée
- `animations.jpg` - Spectacles et animations
- `sports.jpg` - Activités sportives

#### 🧖‍♀️ Bien-être (`public/assets/wellness/`)
- `spa.jpg` - Espace spa
- `hammam.jpg` - Hammam traditionnel
- `massage.jpg` - Salle de massage
- `gym.jpg` - Salle de sport

## 📐 Spécifications Techniques

### Format d'Image
- **Format** : JPG ou PNG
- **Taille recommandée** : 800x600px minimum
- **Poids maximum** : 500KB par image
- **Qualité** : 80-85% pour JPG

### Optimisation
- Compresser les images pour le web
- Utiliser des noms descriptifs
- Maintenir un ratio 4:3 ou 16:9

## 🚀 Instructions d'Installation

1. **Préparer les images** selon les spécifications ci-dessus
2. **Placer les images** dans les dossiers correspondants
3. **Vérifier les noms** correspondent exactement aux références dans le code
4. **Tester l'affichage** en lançant `npm start`

## 🔧 Commandes Utiles

```bash
# Démarrer le serveur de développement
npm start

# Construire pour la production
npm run build

# Vérifier la structure des assets
ls public/assets/
```

## 📝 Notes Importantes

- Les images sont référencées dans le code TypeScript
- Changer les noms nécessite de modifier le code correspondant
- Les images manquantes afficheront une icône de placeholder
- Optimiser les images améliore les performances du site 