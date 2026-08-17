# cRs011.github.io

Portofoliul personal al lui Cristian Lăcătuș — [crs011.github.io](https://crs011.github.io/).

HTML, CSS și JavaScript scrise de mână, fără framework și fără dependențe la runtime.
Găzduit pe GitHub Pages.

## Structură

| Cale | Ce conține |
| :--- | :--- |
| `index.html` | Pagina principală. Lista de proiecte e generată — vezi mai jos |
| `projects/` | Câte o pagină per proiect, pe aceeași foaie de stil |
| `data/projects.json` | **Sursa unică de adevăr pentru proiecte** |
| `data/activity.json` | Ultima activitate publică de pe GitHub, sincronizată nocturn |
| `styles.css` / `script.js` | Sursele editabile |
| `styles.min.css` / `script.min.js` | Bundle-urile servite în producție, generate de build |
| `scripts/` | Sincronizare, randare, scaffolding, build |
| `assets/` | Imagini, clipuri, favicon și CV-ul |

## Cum adaugi un proiect

```bash
python3 scripts/new_project.py grid-solver "Grid solver in C"
```

Comanda creează `projects/grid-solver.html` dintr-un șablon și adaugă intrarea în
`data/projects.json`. Rămâne de scris textul — caută `TODO` în ambele. Apoi:

```bash
python3 scripts/build_prod.py
```

Build-ul randează lista de proiecte în `index.html`, regenerează `sitemap.xml` și
minifică. Blocul dintre marcajele `projects:start` și `projects:end` din `index.html`
este **generat** și se rescrie la fiecare build, deci nu se editează manual.

Randarea validează înainte să scrie și oprește build-ul dacă lipsește un câmp
obligatoriu, dacă un identificator e duplicat sau dacă o pagină ori un fișier media
din JSON nu există pe disc. Un build care trece cu o legătură ruptă publică o legătură
ruptă.

## Ce face sincronizarea nocturnă

Workflow-ul din `.github/workflows/sync.yml` rulează la 03:00 UTC și, în ordine:

1. `scripts/sync_github.py` — scrie ultima activitate publică în `data/activity.json`
   și **semnalează în log depozitele publice care nu apar în `data/projects.json`**.
   Nu le publică singur, intenționat: portofoliul e o selecție, nu o oglindă a contului.
2. `scripts/build_prod.py` — randează, regenerează sitemap-ul, minifică.
3. Comite ce s-a schimbat și face push pe `main`, cu rebase dacă cineva a împins între timp.

Vârsta ultimului commit se calculează în browser din câmpul `timestamp`, nu din
`time_ago`. Al doilea e adevărat doar în clipa în care îl scrie sincronizarea, deci
pagina ar pretinde „5 minutes ago" o zi întreagă.

## Dezvoltare locală

```bash
python3 -m http.server 5051    # http://localhost:5051
python3 scripts/build_prod.py  # după orice modificare în styles.css sau script.js
```

Pagina încarcă versiunile minificate, deci fără build modificările nu se văd.

## Drepturi

Sursa este publică pentru că poate fi citită și pentru că se poate învăța din ea. Nu este
oferită ca template de refolosit: nu are licență open-source, deci se aplică dreptul de autor
implicit.

© 2026 Cristian Lăcătuș. Toate drepturile rezervate.
