# Changelog

Format : [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/), versionnement [SemVer](https://semver.org/lang/fr/).

## [Unreleased]

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
