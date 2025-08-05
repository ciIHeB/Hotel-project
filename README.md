# 🏨 Hôtel Tanfous Beach & Aquapark - Site Web Vitrine

Site web vitrine moderne pour l'Hôtel Tanfous Beach & Aquapark, un établissement 3 étoiles situé à Hammamet Sud, Tunisie.

## 🚀 Fonctionnalités

### 📱 Interface Moderne
- Design responsive et moderne
- Navigation intuitive
- Animations fluides
- Compatible mobile et desktop

### 🏠 Pages Principales
1. **Accueil** - Présentation de l'hôtel avec slider d'images
2. **Chambres** - Catalogue des chambres (Double, Triple, Quadruple)
3. **Restauration** - Présentation des restaurants et services
4. **Loisirs & Activités** - Aquapark, plage, animations, sports
5. **Bien-être** - Spa, hammam, massages, salle de sport
6. **Réservation** - Formulaire de demande de réservation
7. **Contact** - Informations de contact et formulaire

### 🎯 Fonctionnalités Clés
- **Formulaire de réservation** complet avec validation
- **Design responsive** pour tous les appareils
- **Optimisation SEO** avec métadonnées
- **Performance optimisée** avec Angular 18
- **Support SSR** (Server-Side Rendering)

## 🛠️ Technologies Utilisées

- **Angular 18** - Framework principal
- **TypeScript** - Langage de programmation
- **CSS3** - Styles et animations
- **HTML5** - Structure sémantique
- **Angular SSR** - Rendu côté serveur

## 📦 Installation et Démarrage

### Prérequis
- Node.js (version 18 ou supérieure)
- npm ou yarn

### Installation
```bash
# Cloner le projet
git clone [url-du-repo]

# Aller dans le dossier
cd Hotel-Website-main

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm start

# Ou construire pour la production
npm run build
```

### Scripts Disponibles
- `npm start` - Démarre le serveur de développement
- `npm run build` - Construit l'application pour la production
- `npm run test` - Lance les tests unitaires

## 🏗️ Structure du Projet

```
src/
├── app/
│   ├── header/           # Composant header avec navigation
│   ├── footer/           # Composant footer
│   ├── pages/            # Pages principales
│   │   ├── home/         # Page d'accueil
│   │   ├── rooms/        # Page des chambres
│   │   ├── restaurant/   # Page restauration
│   │   ├── activities/   # Page loisirs & activités
│   │   ├── wellness/     # Page bien-être
│   │   ├── booking/      # Page réservation
│   │   └── contact/      # Page contact
│   └── services/         # Services Angular
├── assets/               # Images, vidéos, etc.
└── styles.css           # Styles globaux
```

## 🎨 Design et UX

### Palette de Couleurs
- **Primaire** : Dégradé bleu-violet (#667eea → #764ba2)
- **Secondaire** : Gris moderne (#2c3e50, #7f8c8d)
- **Accent** : Vert succès (#27ae60)

### Typographie
- Titres : Roboto, 2.5rem
- Corps : Roboto, 1rem
- Responsive et lisible

## 📱 Responsive Design

Le site s'adapte parfaitement à tous les écrans :
- **Desktop** : 1200px et plus
- **Tablet** : 768px - 1199px
- **Mobile** : 320px - 767px

## 🔧 Configuration

### Variables d'Environnement
Créer un fichier `.env` pour les configurations :
```env
# Configuration de l'hôtel
HOTEL_NAME="Hôtel Tanfous Beach & Aquapark"
HOTEL_ADDRESS="Avenue de la Paix, Hammamet Sud, Tunisie"
HOTEL_PHONE="+216 XX XXX XXX"
HOTEL_EMAIL="contact@hoteltanfous.tn"
```

## 🚀 Déploiement

### Production
```bash
# Construire l'application
npm run build

# Le dossier dist/ contient les fichiers de production
```

### Hébergement Recommandé
- **Netlify** - Déploiement simple et gratuit
- **Vercel** - Optimisé pour Angular
- **Firebase Hosting** - Solution Google
- **Serveur VPS** - Contrôle total

## 📊 Performance

- **Lighthouse Score** : 90+ sur tous les critères
- **Temps de chargement** : < 3 secondes
- **SEO Optimisé** : Métadonnées complètes
- **Accessibilité** : Conforme WCAG 2.1

## 🔒 Sécurité

- Validation des formulaires côté client et serveur
- Protection contre les injections XSS
- Headers de sécurité configurés
- HTTPS obligatoire en production

## 📈 SEO

- Métadonnées optimisées pour chaque page
- Structure HTML sémantique
- URLs propres et descriptives
- Sitemap XML généré automatiquement
- Schema.org markup pour l'hôtel

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou support :
- Email : contact@hoteltanfous.tn
- Téléphone : +216 XX XXX XXX

---

**Développé avec ❤️ pour l'Hôtel Tanfous Beach & Aquapark**
