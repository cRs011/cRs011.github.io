# cRs011.github.io

Portofoliul personal al lui Cristian Lăcătuș — [crs011.github.io](https://crs011.github.io/).

HTML, CSS și JavaScript scrise de mână, fără framework și fără dependențe la runtime.
Găzduit pe GitHub Pages. Un workflow GitHub Actions rulează în fiecare noapte
`scripts/sync_github.py`, care aduce ultima activitate publică din API-ul GitHub în
`data/activity.json`, apoi `scripts/build_prod.py`, care compilează `styles.min.css` și
`script.min.js`.

## Structură

| Cale | Ce conține |
| :--- | :--- |
| `index.html` | Pagina principală, cu datele structurate schema.org |
| `projects/` | Câte o pagină de prezentare per proiect, pe aceeași foaie de stil |
| `styles.css` / `script.js` | Sursele editabile |
| `styles.min.css` / `script.min.js` | Bundle-urile servite în producție, generate de build |
| `data/` | Proiectele și activitatea GitHub sincronizată |
| `scripts/` | Sincronizarea cu GitHub și pipeline-ul de build |
| `assets/` | Imagini, clipuri și CV-ul |

## Dezvoltare locală

```bash
python3 -m http.server 5051
# apoi deschide http://localhost:5051

python3 scripts/build_prod.py   # recompilează bundle-urile minificate
```

Pagina încarcă versiunile minificate, deci după orice modificare în `styles.css` sau
`script.js` build-ul trebuie rulat, altfel schimbarea nu se vede.

## Drepturi

Sursa este publică pentru că poate fi citită și pentru că se poate învăța din ea. Nu este
oferită ca template de refolosit: nu are licență open-source, deci se aplică dreptul de autor
implicit.

© 2026 Cristian Lăcătuș. Toate drepturile rezervate.
