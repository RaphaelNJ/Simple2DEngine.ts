# Simple2DEngine.ts

Un simple moteur de jeu 2D utilisant Vite + TypeScript. Il ne prétend pas être un moteur de jeu complet, mais plutôt un ensemble d'outils pour le développement de jeux 2D. Il utilise l'API JavaScript Canvas pour dessiner les pixels à l'écran, avec toute la logique d'affichage gérée directement par le programme.

## Prérequis
- Node.js : Assurez-vous d'avoir Node.js installé sur votre système. Vous pouvez le télécharger à partir du site officiel de Node.js : [https://nodejs.org](https://nodejs.org)

## Installation
1. Clonez le dépôt GitHub en utilisant la commande suivante :
   ```
   git clone https://github.com/RaphaelNJ/Simple2DEngine.ts.git
   ```
2. Accédez au répertoire du projet :
   ```
   cd Simple2DEngine.ts
   ```
3. Installez les dépendances en exécutant la commande suivante :
   ```
   npm install
   ```
4. Lancez l'application avec la commande :
   ```
   npm run dev
   ```

Cela démarrera le moteur de jeu 2D et vous pourrez commencer à développer votre jeu en utilisant les fonctionnalités fournies.

## Exemple d'utilisation

Dans le fichier `src/main.ts`, vous pouvez voir un exemple d'utilisation du moteur. Voici ce que donne cet exemple : 

https://github.com/RaphaelNJ/Simple2DEngine.ts/assets/52333330/9a60699c-b3a1-4e09-9ff8-a3b7e5a3ae86

Voici un exemple plus simple :

```typescript
import * as engine from "./engine/engine";
import typescript from '/typescript.png';

new engine.Engine(<HTMLCanvasElement>document.getElementById("canvas"), (delta: number, fps: number, engineInstance: engine.Engine) => {
  if (engineInstance.isLoading) { // vérifie si le jeu est en chargement
    return; // si oui, on ne fait rien (permet d'éviter le crash si une image non chargée est appelée)
  }

  engineInstance.DrawPixel(250, 70, { r: 255, g: 0, b: 0, a: 255 });

  engineInstance.DrawLine(0, 0, 50, 120, { a: 255, r: 255, g: 255, b: 255 });

  engineInstance.DrawTexturedRectangle(100, 100, "typescript", {
    matrix: [
      [160, 0],
      [0, 90],
    ],
    sizeX: 1,
    sizeY: 1,
    u: 0,
    v: 0
  })
  
  engineInstance.DrawFilledShape(
    [
      { x: 20, y: 20 },
      { x: 40, y: 20 },
      { x: 40, y: 40 },
      { x: 0, y: 30 },
    ],
    { a: 255, r: 255, g: 255, b: 0 }
  );
},
  160 * 3, // taille de la fenêtre en largeur
  120 * 3, // taille de la fenêtre en hauteur
  2, // taille des pixels
  { typescript } // liste des images à charger
);
```
Ce code affichera :

![Screenshot from 2024-02-29 12-27-47](https://github.com/RaphaelNJ/Simple2DEngine.ts/assets/52333330/ea73fce5-2561-42e6-9c80-14ca870b8ca8)


## Documentation des fonctions

### `DrawPixel(x: number, y: number, color: Color)`

Dessine un pixel à la position spécifiée `(x, y)` avec la couleur donnée.

- `x`: La position en x du pixel à dessiner.
- `y`: La position en y du pixel à dessiner.
- `color`: La couleur du pixel au format `{ r: number, g: number, b: number, a: number }` où `r`, `g`, `b` et `a` représentent les valeurs des composantes rouge, verte, bleue et alpha respectivement.

### `DrawLine(startx: number, starty: number, endx: number, endy: number, color: Color)`

Dessine une ligne entre les points `(startx, starty)` et `(endx, endy)` avec la couleur donnée.

- `startx`: La position en x du point de départ de la ligne.
- `starty`: La position en y du point de départ de la ligne.
- `endx`: La position en x du point d'arrivée de la ligne.
- `endy`: La position en y du point d'arrivée de la ligne.
- `color`: La couleur de la ligne au format `{ r: number, g: number, b: number, a: number }` où `r`, `g`, `b` et `a` représentent les valeurs des composantes rouge, verte, bleue et alpha respectivement.

### `DrawTexturedRectangle(x1: number, y1: number, image: string, optional: Object)`

Dessine un rectangle texturé à la position spécifiée `(x1, y1)` avec une image donnée.

- `x1`: La position en x du coin supérieur gauche du rectangle.
- `y1`: La position en y du coin supérieur gauche du rectangle.
- `image`: Le nom de l'image à utiliser pour la texture du rectangle.
- `optional`: (Optionnel) Un objet contenant des options supplémentaires pour la texture du rectangle :
  - `matrix`: Une matrice de transformation linéaire 2x2 pour appliquer une transformation à la texture du rectangle. La matrice est spécifiée sous la forme `[[a, b], [c, d]]`.
  - `sizeX`: La largeur de la texture du rectangle en nombre de pixels (boucle sur la même texture si nécésaire).
  - `sizeY`: La hauteur de la texture du rectangle en nombre de pixels (boucle sur la même texture si nécésaire).
  - `u`: La coordonnée u de la texture pour effectuer un décalage horizontal.
  - `v`: La coordonnée v de la texture pour effectuer un décalage vertical.

### `DrawFilledShape(points: Point[], color: Color)`

Dessine une forme remplie définie par un tableau de points avec la couleur donnée.

- `points`: Un tableau d'objets `{ x: number, y: number }` représentant les points de la forme.
- `color`: La couleur de la forme remplie au format `{ r: number, g: number, b: number, a: number }` où `r`, `g`, `b` et `a` représentent les valeurs des composantes rouge, verte, bleue et alpha respectivement.

## Licence

Ce projet est sous licence [GPL 3.0](https://www.gnu.org/licenses/gpl-3.0.html)
