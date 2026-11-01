# Changelog

Format : [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/), versionnement [SemVer](https://semver.org/lang/fr/).

## [Unreleased]

## [0.6.0] - 2026-11-01

### Ajouté
- **Boîtes de dérivation** : gaines par côté et position (H/B/G/D), circuit(s), câble, longueur, passage, et destination (tableau, autre boîte et son entrée, prise / point lumineux / interrupteur / appareil / sortie de câble, réserve, inconnue). Boîte dessinée sous les tableaux, détail par gaine.
- **Liaisons** : entrées reliées deux à deux (boîte utilisée en rallonge) dessinées par un trait ; le circuit traverse les liaisons et les liens entre boîtes, il suffit de l'indiquer sur la gaine qui vient du tableau.
- **Wagos détaillés** facultatifs (type, fil, circuit, gaines reliées) ; un Wago de terre commun ne mélange pas les circuits.
- Tout peut rester inconnu : position, côté, circuit, destination, gaines d'un Wago, ou seulement les circuits d'une boîte non ouverte.
- **Desserte** dans le détail d'un disjoncteur (tableau → boîtes → points) ; points comptés depuis les boîtes pour le contrôle du nombre de points quand il n'est pas saisi.
- Édition dans la carte (onglet *Boîtes de dérivation* du mode édition) ; `boites:` dans `electricite.yaml` et dans l'export. Une réimportation des tableaux seuls conserve les circuits des boîtes (mêmes repères).

## [0.5.0] - 2026-11-01

### Modifié
- Vue électricité : quand il y a plusieurs tableaux, ils sont **affichés les uns sous les autres** (titre, pastilles et points à vérifier propres à chacun) au lieu d'onglets. Les liens « Alimenté par » sont surlignés d'un tableau à l'autre. Option de carte `boards_layout: tabs` pour revenir aux onglets ; une carte épinglée sur un tableau (`board:`) garde les onglets.

## [0.4.0] - 2026-11-01

### Ajouté
- **Alertes** : n'importe quel élément (module, compteur, disjoncteur de branchement) peut porter une alerte écrite par vous (« prise sur un circuit éclairage », « disjoncteur qui chauffe »…), avec suggestions et niveau « à traiter » / « pour information ». Module entouré et marqué « ! », pastille « n alerte(s) », alertes en tête de la liste des points à vérifier.
- Entité **Alertes** par tableau (`sensor.home_infra_map_<tableau>_alertes`) : nombre d'alertes, liste dans l'attribut `alerts`, pour une automatisation ou une notification.
- Fichiers de la maison : `alerte: texte` (ou une liste) et `alerte_niveau: info`.
- **Rappels NF C 15-100** par type de circuit (éclairage, prises, spécialisé, cuisson, chauffe-eau, chauffage, départ) dans le détail et l'édition ; pour un circuit « ? », type suggéré d'après le calibre (C10 → éclairage, C16 → prises, C20 → spécialisé, C32 → cuisson, ≥ 40 A → départ), à appliquer d'un clic.
- **Nombre de points** d'un circuit (prises ou points lumineux, `nb_prises:` / `points:` dans les fichiers) et contrôle : 8 points lumineux, 8 prises en 16 A, 12 prises en 20 A.

## [0.3.0] - 2026-11-01

### Ajouté
- **Arrivée** du tableau : compteur (Linky…, puissance souscrite, capteur de puissance) et disjoncteur de branchement (calibre, sensibilité), dessinés au-dessus des rails avec la charge en % du calibre.
- **Alimenté par** : chaque module peut être relié explicitement à l'élément qui l'alimente (par défaut, le différentiel à sa gauche sur la rangée, sinon l'arrivée) — par exemple un disjoncteur câblé directement sous le disjoncteur de branchement, hors différentiel. Un tableau peut être alimenté par un départ d'un autre tableau. Les liens qui bouclent ou pointent dans le vide sont retirés à l'enregistrement.
- Sélection d'un module : sa chaîne d'alimentation et tout ce qu'il alimente sont mis en évidence ; le détail affiche « Alimenté par », « Protégé par » et « Alimente ».
- **État** d'un module : en service, **coupé / disjoncté** (ou relais lié éteint), **en réserve** (posé pour de futurs travaux, non raccordé : hachuré, exclu des contrôles).
- Fichiers de la maison : `arrivee: {compteur: …, disjoncteur: …}`, `alimente_par: <repère | arrivee>` (sur un élément ou un tableau), `etat: réserve | coupé`.
- Contrôle « départ sans 30 mA en amont » (information) pour les départs vers un tableau divisionnaire.

### Modifié
- Les contrôles NF C 15-100 suivent les liens d'alimentation (différentiel réel en amont, même sur une autre rangée ou un autre tableau).

## [0.2.0] - 2026-11-01

### Ajouté
- Largeur des rails : « modules par rangée » sur le tableau, et par rangée si elle diffère. Places libres dessinées en fin de rail, compteur « 17 / 18 modules », avertissement si une rangée dépasse son rail.
- Fichiers de la maison : ordre physique libre (`elements:`), trous (`vide: n`), largeur de chaque élément (`largeur: n`), largeur des rails (`modules_par_rangee`, `capacite`), disjoncteurs différentiels (`sensibilite` sur un disjoncteur).
- Carte : téléchargement de l'export en fichier `.yaml`, import depuis un fichier `.yaml`, bouton d'ajout d'un emplacement vide.
- Exemple `docs/examples/tableau-largeurs.yaml`.

### Modifié
- Les rails sont dessinés en grille (une colonne par place DIN) : un tableau de 18 ou 24 modules tient dans la largeur de la carte ; en dessous de 48 px par place, le rail défile.
- Puissance affichée en kW au-delà de 1 000 W dans un module (valeur exacte au survol).

## [0.1.0] - 2026-11-01

### Ajouté
- Intégration `home_infra_map` : configuration par l'interface (OPNsense et switchs SNMP facultatifs), options (intervalles, vue par défaut, analyse du pare-feu).
- Modèle persistant (`.storage/home_infra_map`, versionné, migrations), révisions par section contre les écrasements concurrents.
- Import YAML (format natif et format des fichiers de la maison), export YAML, génération d'un tableau de bord d'exemple.
- Clients OPNsense (liste blanche d'endpoints en lecture) et SNMP (GET/WALK uniquement).
- Entités : présence, latence, service TCP, port du switch, blocages pare-feu, ports du switch, puissance par rangée et par tableau ; synchronisées avec le modèle sans rechargement.
- Alerte hors ligne : événement `home_infra_map_device_offline` et réparation.
- Analyse du pare-feu par équipement (règles applicables, qui peut le joindre, NAT, derniers blocages avec nom DNS probable).
- Contrôles électriques inspirés de la NF C 15-100.
- Carte Lovelace `custom:home-infra-map-card` : tableau électrique réaliste, topologie, VLAN, face avant du switch, fiche équipement, mode édition (administrateurs).
- Photos de tableau stockées hors de `/config/www`, servies authentifiées, sans métadonnées.
- Diagnostics sans secret.
