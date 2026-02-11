# Maintenance Supabase
Mise à jour du 11/02/2026 pour maintenir l'activité du projet

# 🎥 Guide Pratique - Enregistrement Vidéo PANTOUFLES

## 🚀 DÉMARRAGE RAPIDE

### **Étape 1 : Préparation de l'environnement**

1. **Lancer l'application en mode développement :**
   ```bash
   npm run dev
   ```
   Cela lancera à la fois le frontend (React) et le backend (Node.js).

2. **Vérifier que tout fonctionne :**
   - Ouvrir http://localhost:3000 dans votre navigateur
   - Tester le formulaire d'inscription
   - Tester le chat Claude
   - Vérifier que les animations fonctionnent

3. **Préparer des données de test :**
   - Créer quelques clients de test dans Supabase
   - Créer quelques missions de test
   - S'assurer que les témoignages s'affichent correctement

---

## 🎬 CONFIGURATION OBS STUDIO (Recommandé - Gratuit)

### **Installation :**
1. Télécharger OBS Studio : https://obsproject.com/
2. Installer et lancer l'application

### **Configuration de la scène :**

1. **Créer une nouvelle scène** : "PANTOUFLES Video"

2. **Ajouter une source "Capture de fenêtre" :**
   - Cliquer sur "+" dans Sources
   - Sélectionner "Capture de fenêtre"
   - Nommer : "Navigateur Chrome"
   - Sélectionner votre fenêtre de navigateur avec l'application

3. **Ajouter une source audio (micro) :**
   - Cliquer sur "+" dans Sources
   - Sélectionner "Entrée audio"
   - Sélectionner votre micro
   - Tester le niveau audio (barre verte)

4. **Réglages vidéo :**
   - Résolution : 1920x1080 (Full HD)
   - FPS : 30 ou 60
   - Format : MP4

5. **Réglages audio :**
   - Sample Rate : 48 kHz
   - Bitrate : 160 kbps minimum

### **Conseils OBS :**
- Utiliser un filtre de bruit sur le micro (Filtres > Noise Suppression)
- Ajouter un filtre de gain si nécessaire
- Tester l'enregistrement avant de commencer (bouton "Démarrer l'enregistrement")

---

## 🎙️ ENREGISTREMENT DE LA NARRATION

### **Option 1 : Enregistrement séparé (Recommandé)**

1. **Utiliser Audacity (gratuit) :**
   - Télécharger : https://www.audacityteam.org/
   - Enregistrer la narration seule
   - Exporter en WAV ou MP3 (qualité haute)

2. **Avantages :**
   - Meilleure qualité audio
   - Possibilité de réenregistrer des parties
   - Facilite le montage

### **Option 2 : Enregistrement simultané**

- Enregistrer la narration directement avec OBS
- Plus simple mais moins flexible

---

## 📝 SCRIPT DE NARRATION DÉTAILLÉ

### **Timing précis pour chaque séquence :**

```
[0:00-0:15] INTRODUCTION
"Bienvenue chez PANTOUFLES adhoc ! 🩴
Magnifiez votre intérieur avec des services de propreté et d'hygiène 100% naturels.
Chacun mérite d'être bien chez soi."

[0:15-0:45] SERVICES
"PANTOUFLES propose 5 services essentiels pour votre bien-être à domicile :
🧹 Ménage - Un intérieur propre et accueillant sans effort
👕 Repassage - Vêtements parfaitement repassés
🛒 Courses - Vos achats faits pour vous
🥗 Diététique - Manger sainement, simplement
🍽️ Aide au repas - Préparation et accompagnement bienveillant"

[0:45-1:00] ENGAGEMENTS
"Chez PANTOUFLES, nous nous engageons à utiliser uniquement des produits BIO et écologiques.
Zéro chimie agressive, 100% naturel.
Prendre soin de votre maison, c'est aussi prendre soin de la planète."

[1:00-1:30] FORMULAIRE
"Rejoignez PANTOUFLES en quelques clics !
Remplissez notre formulaire simple et rapide.
Indiquez vos besoins, votre adresse, et les services qui vous intéressent.
Nous vous recontacterons très rapidement pour personnaliser votre abonnement."

[1:30-1:45] TÉMOIGNAGES
"Nos clients nous font confiance :
'Depuis que PANTOUFLES s'occupe de mon ménage, j'ai plus de temps pour profiter de la vie.'
'La diététicienne m'a aidé à mieux manger. Je me sens plus en forme !'
'Les courses me fatiguaient. Maintenant c'est quelqu'un d'autre qui s'en charge.'"

[1:45-2:00] CLAUDE
"Besoin d'aide ? Notre assistant Claude est là pour vous !
Posez vos questions directement sur le site.
Claude vous répond instantanément et vous guide dans vos démarches."

[2:00-2:15] RECRUTEMENT
"Vous cherchez un emploi avec du sens ?
Rejoignez notre équipe d'intervenants !
Horaires flexibles, travail dignifié, rémunération juste.
Faites partie d'une équipe qui change les choses."

[2:15-2:25] URGENCE
"Besoin d'une aide immédiate ?
Appelez-nous au numéro d'urgence.
Nous sommes là pour vous, quand vous en avez besoin."

[2:25-2:35] CALL TO ACTION
"Rejoignez PANTOUFLES dès aujourd'hui !
Même une pantoufle moche a sa place dans la maison.
Chez nous aussi, chacun a sa place.
Visitez notre site et remplissez le formulaire maintenant !"
```

---

## 🎨 PRÉPARATION DES VISUELS

### **Checklist avant enregistrement :**

- [ ] **Page d'accueil chargée** : http://localhost:3000
- [ ] **Navigateur en plein écran** : F11
- [ ] **Zoom du navigateur** : 100% (Ctrl + 0)
- [ ] **Données de test créées** : Clients, missions, témoignages
- [ ] **Formulaire prêt** : Champs vides, prêt à être rempli
- [ ] **Chat Claude fonctionnel** : Backend lancé
- [ ] **Animations activées** : Pantoufles, soleil, etc.

### **Ordre de navigation recommandé :**

1. **Page d'accueil** (Hero section)
2. **Scroll vers "Nos Services"**
3. **Scroll vers "Notre Engagement"**
4. **Scroll vers le formulaire**
5. **Remplir le formulaire** (simulation)
6. **Scroll vers témoignages**
7. **Ouvrir le chat Claude**
8. **Scroll vers "Rejoignez l'équipe"**
9. **Scroll vers section urgence**
10. **Retour en haut** (Call to action)

---

## 🎬 TECHNIQUES D'ENREGISTREMENT

### **Conseils pour un enregistrement fluide :**

1. **Utiliser un curseur personnalisé :**
   - Télécharger un curseur visible (ex: curseur rouge)
   - Facilite le suivi à l'écran

2. **Ralentir les mouvements :**
   - Déplacer le curseur lentement
   - Laisser le temps aux animations de se charger
   - Faire des pauses de 1-2 secondes entre les actions

3. **Éviter les erreurs :**
   - Ne pas cliquer trop vite
   - Vérifier que les éléments sont chargés avant de cliquer
   - Faire plusieurs prises si nécessaire

4. **Gérer les transitions :**
   - Utiliser des transitions douces (fade in/out)
   - Éviter les coupures brutales
   - Laisser respirer entre les sections

---

## 🎵 AJOUT DE LA MUSIQUE

### **Musique recommandée :**

**Style :** Douce, apaisante, positive
**Tempo :** 80-100 BPM
**Instruments :** Piano, guitare acoustique, cordes légères

### **Sites de musique libre de droits :**

1. **YouTube Audio Library** (gratuit)
   - https://www.youtube.com/audiolibrary
   - Filtrer par "Attribution not required"

2. **Pixabay Music** (gratuit)
   - https://pixabay.com/music/
   - Rechercher : "calm", "peaceful", "uplifting"

3. **Epidemic Sound** (payant mais qualité)
   - https://www.epidemicsound.com/
   - Grande bibliothèque de musique

### **Réglages audio :**
- Volume musique : -20dB à -15dB (en arrière-plan)
- Volume narration : 0dB (au premier plan)
- Utiliser un compresseur pour équilibrer

---

## ✂️ MONTAGE VIDÉO

### **Workflow recommandé :**

1. **Import des fichiers :**
   - Vidéo d'écran (OBS)
   - Narration audio (Audacity)
   - Musique de fond

2. **Synchronisation :**
   - Aligner la narration avec les actions à l'écran
   - Ajuster le timing si nécessaire

3. **Ajout de textes :**
   - Titres de sections
   - Call to action
   - Informations importantes (numéro, URL)

4. **Transitions :**
   - Fade in/out entre sections
   - Transitions douces (dissolve)

5. **Colorisation :**
   - Appliquer la charte PANTOUFLES
   - Ajuster la luminosité/contraste si nécessaire

6. **Export :**
   - Format : MP4 (H.264)
   - Résolution : 1920x1080
   - FPS : 30
   - Bitrate : 10-15 Mbps

---

## 📱 OPTIMISATION PAR PLATEFORME

### **YouTube :**
- Format : 16:9 (1920x1080)
- Durée : 2-3 minutes (idéal)
- Miniature : 1280x720px
- Titre : "PANTOUFLES - Services à domicile Limoges"
- Description : Inclure liens, hashtags, call to action

### **Instagram Reels :**
- Format : 9:16 (1080x1920)
- Durée : 30-60 secondes
- Texte en grand (lecture sans son)
- Hashtags : #Limoges #ServicesADomicile #PANTOUFLES

### **Facebook :**
- Format : 16:9 ou carré (1080x1080)
- Durée : 1-2 minutes
- Sous-titres automatiques activés
- Call to action clair

---

## 🐛 DÉPANNAGE

### **Problèmes courants :**

**1. L'application ne charge pas :**
- Vérifier que `npm run dev` est lancé
- Vérifier les ports (3000 pour React, 5000 pour backend)
- Vider le cache du navigateur

**2. Le chat Claude ne répond pas :**
- Vérifier que le backend est lancé
- Vérifier la variable d'environnement `REACT_APP_API_URL`
- Consulter les logs du serveur

**3. Audio de mauvaise qualité :**
- Utiliser un micro externe
- Réduire le bruit de fond
- Utiliser un filtre de bruit dans OBS

**4. Vidéo qui lag :**
- Réduire la résolution d'enregistrement
- Fermer les autres applications
- Utiliser un disque SSD pour l'enregistrement

---

## ✅ CHECKLIST FINALE

### **Avant publication :**
- [ ] Vidéo visionnée en entier
- [ ] Audio clair et compréhensible
- [ ] Textes lisibles
- [ ] Transitions fluides
- [ ] Pas d'erreurs visibles
- [ ] Call to action présent
- [ ] Logo PANTOUFLES visible
- [ ] Informations de contact correctes
- [ ] Durée respectée (2-3 min)
- [ ] Export en bonne qualité

---

## 🎯 RÉSULTAT ATTENDU

Une vidéo professionnelle de 2-3 minutes qui :
- ✅ Présente clairement PANTOUFLES
- ✅ Montre les 5 services
- ✅ Met en avant les valeurs (BIO, éco-responsable)
- ✅ Incite à l'action (formulaire, appel)
- ✅ Rassure avec les témoignages
- ✅ Donne envie de rejoindre l'équipe

**Bonne création ! 🎬🩴**

