# 📝 Guide d'Utilisation des Sous-titres - PANTOUFLES Video

## 📋 FORMATS DISPONIBLES

J'ai créé deux formats de sous-titres pour votre vidéo :

### 1. **TEMPLATES_SOUS_TITRES.srt** (Format SRT)
- Format standard universel
- Compatible avec YouTube, Vimeo, et la plupart des lecteurs vidéo
- Facile à éditer avec un simple éditeur de texte

### 2. **TEMPLATES_SOUS_TITRES_VTT.vtt** (Format WebVTT)
- Format moderne pour le web
- Compatible avec les lecteurs HTML5
- Supporte le style CSS avancé

---

## 🎬 UTILISATION DES SOUS-TITRES

### **Pour YouTube :**

1. **Télécharger le fichier .srt**
2. Aller dans YouTube Studio > Vos vidéos
3. Sélectionner votre vidéo
4. Aller dans "Sous-titres" dans le menu de gauche
5. Cliquer sur "Ajouter une langue" > Français
6. Cliquer sur "Ajouter" > "Téléverser un fichier"
7. Sélectionner `TEMPLATES_SOUS_TITRES.srt`
8. YouTube générera automatiquement les sous-titres synchronisés

### **Pour Vimeo :**

1. Télécharger le fichier .srt ou .vtt
2. Aller dans Vimeo > Gérer les vidéos
3. Sélectionner votre vidéo
4. Aller dans "Paramètres" > "Sous-titres"
5. Cliquer sur "Ajouter des sous-titres"
6. Téléverser le fichier .srt ou .vtt

### **Pour intégration dans la vidéo (montage) :**

**Avec DaVinci Resolve :**
1. Importer le fichier .srt
2. Aller dans "Édition" > "Sous-titres"
3. Importer le fichier .srt
4. Ajuster le style (police, taille, couleur, position)

**Avec Adobe Premiere Pro :**
1. Importer le fichier .srt
2. Aller dans "Fenêtre" > "Sous-titres"
3. Importer le fichier
4. Personnaliser le style dans les paramètres

---

## ✏️ MODIFICATION DES SOUS-TITRES

### **Format SRT (.srt) :**

Chaque sous-titre suit ce format :
```
1
00:00:00,000 --> 00:00:05,000
Texte du sous-titre ici
```

**Structure :**
- Numéro de séquence
- Timestamp début --> Timestamp fin (format HH:MM:SS,mmm)
- Texte du sous-titre (peut être sur plusieurs lignes)
- Ligne vide entre chaque sous-titre

### **Exemple de modification :**

Si vous voulez changer le texte du premier sous-titre :
```
1
00:00:00,000 --> 00:00:05,000
Bienvenue chez PANTOUFLES adhoc !
```

En :
```
1
00:00:00,000 --> 00:00:05,000
Bienvenue chez PANTOUFLES !
Votre service à domicile à Limoges
```

### **Ajuster le timing :**

Si une phrase est trop rapide, ajustez les timestamps :
```
Avant :
1
00:00:00,000 --> 00:00:05,000
Texte long qui nécessite plus de temps

Après :
1
00:00:00,000 --> 00:00:07,000
Texte long qui nécessite plus de temps
```

---

## 🎨 PERSONNALISATION DU STYLE

### **Pour le format VTT (.vtt) :**

Vous pouvez ajouter du style CSS dans le fichier VTT :

```vtt
WEBVTT

STYLE
::cue {
  background-color: rgba(0, 0, 0, 0.8);
  color: #FFFFFF;
  font-family: Arial, sans-serif;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
}

::cue(.highlight) {
  color: #F97316;
}

00:00:00.000 --> 00:00:05.000
Bienvenue chez PANTOUFLES adhoc !
```

### **Couleurs recommandées pour PANTOUFLES :**

```css
/* Fond semi-transparent */
background-color: rgba(249, 115, 22, 0.9); /* Orange PANTOUFLES */

/* Texte blanc */
color: #FFFFFF;

/* Bordure arrondie */
border-radius: 10px;

/* Ombre */
text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
```

---

## 📏 RÈGLES DE RÉDACTION

### **Longueur des lignes :**
- Maximum 42 caractères par ligne
- Maximum 2 lignes par sous-titre
- Éviter les coupures au milieu des mots

### **Durée d'affichage :**
- Minimum : 1 seconde
- Maximum : 7 secondes
- Temps de lecture : environ 3 mots par seconde

### **Ponctuation :**
- Utiliser des points, virgules, points d'exclamation
- Éviter les points de suspension (...)
- Utiliser des guillemets pour les citations

### **Formatage :**
- Utiliser des majuscules pour les titres importants
- Utiliser des emojis avec parcimonie
- Mettre en évidence les mots-clés (PANTOUFLES, Limoges)

---

## 🔧 OUTILS POUR ÉDITER LES SOUS-TITRES

### **Éditeurs en ligne (gratuits) :**
1. **Subtitle Edit** (Windows) - https://nikse.dk/subtitleedit
2. **Aegisub** (Multi-plateforme) - https://aegisub.org/
3. **Subtitle Workshop** (Windows) - https://www.urusoft.net/

### **Éditeurs de texte simples :**
- **Notepad++** (Windows)
- **Visual Studio Code** (Multi-plateforme)
- **TextEdit** (Mac)
- **Notepad** (Windows)

### **Éditeurs en ligne :**
- **Amara** - https://amara.org/
- **Subtitle Horse** - https://subtitlehorse.com/

---

## ✅ CHECKLIST DE VÉRIFICATION

Avant de publier votre vidéo avec les sous-titres :

- [ ] Tous les sous-titres sont synchronisés avec l'audio
- [ ] Aucune faute d'orthographe
- [ ] Les timestamps sont corrects
- [ ] Les lignes ne sont pas trop longues
- [ ] Les sous-titres sont lisibles (bon contraste)
- [ ] Les noms propres sont correctement écrits (PANTOUFLES, Limoges)
- [ ] Les emojis s'affichent correctement
- [ ] Les guillemets sont corrects pour les citations
- [ ] Pas de sous-titres qui se chevauchent
- [ ] Le style est cohérent avec la charte PANTOUFLES

---

## 🎯 OPTIMISATION PAR PLATEFORME

### **YouTube :**
- Format : .srt recommandé
- YouTube peut générer automatiquement les sous-titres
- Vous pouvez ensuite les corriger manuellement
- Les sous-titres améliorent le référencement (SEO)

### **Instagram :**
- Format : Intégré directement dans la vidéo (burn-in)
- Utiliser des sous-titres grands et visibles
- Style : Texte blanc avec contour noir
- Position : Bas de l'écran (éviter le texte Instagram natif)

### **Facebook :**
- Format : .srt ou .vtt
- Facebook génère automatiquement les sous-titres
- Vous pouvez téléverser votre fichier pour plus de précision
- Les sous-titres augmentent l'engagement (80% des vidéos sont regardées sans son)

### **TikTok :**
- Format : Intégré dans la vidéo
- Style : Texte animé, grand, coloré
- Position : Centre ou haut de l'écran
- Utiliser les outils de sous-titres natifs de TikTok

---

## 🌍 TRADUCTION (Optionnel)

Si vous souhaitez créer des versions multilingues :

### **Langues suggérées :**
- Anglais (pour élargir l'audience)
- Espagnol (communauté locale)
- Allemand (si expansion prévue)

### **Outils de traduction :**
- **Google Translate** (gratuit, basique)
- **DeepL** (gratuit, meilleure qualité)
- **Traducteur professionnel** (recommandé pour qualité)

### **Structure pour traduction :**

Créer des fichiers séparés :
- `TEMPLATES_SOUS_TITRES_FR.srt` (Français)
- `TEMPLATES_SOUS_TITRES_EN.srt` (Anglais)
- `TEMPLATES_SOUS_TITRES_ES.srt` (Espagnol)

---

## 💡 CONSEILS PROFESSIONNELS

1. **Testez avant publication** : Visionnez la vidéo avec les sous-titres activés
2. **Ajustez le timing** : Les sous-titres doivent apparaître légèrement avant que la personne parle
3. **Utilisez des pauses** : Laissez des espaces entre les phrases importantes
4. **Mettez en évidence** : Utilisez le gras ou la couleur pour les mots-clés
5. **Accessibilité** : Les sous-titres rendent votre contenu accessible aux personnes malentendantes

---

## 📊 STATISTIQUES

Selon les études :
- **85%** des vidéos Facebook sont regardées sans son
- **80%** des utilisateurs YouTube regardent avec les sous-titres
- Les vidéos avec sous-titres ont **40%** d'engagement en plus
- Les sous-titres améliorent le référencement (SEO)

---

## 🆘 DÉPANNAGE

### **Problème : Les sous-titres ne s'affichent pas**
- Vérifier le format du fichier (.srt ou .vtt)
- Vérifier l'encodage (UTF-8 recommandé)
- Vérifier les timestamps (format correct)

### **Problème : Les sous-titres sont désynchronisés**
- Ajuster les timestamps dans le fichier
- Vérifier la durée totale de la vidéo
- Utiliser un outil de synchronisation automatique

### **Problème : Caractères spéciaux mal affichés**
- Utiliser l'encodage UTF-8
- Éviter les caractères spéciaux complexes
- Tester sur différentes plateformes

---

## 📞 SUPPORT

Pour toute question sur les sous-titres :
1. Consultez la documentation de votre plateforme
2. Testez sur différentes plateformes
3. Demandez un retour à des personnes extérieures

**Les sous-titres sont essentiels pour l'accessibilité et l'engagement ! 📝✨**

