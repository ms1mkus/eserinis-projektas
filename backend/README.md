## Pradžia

### Žingsnis 1: Serverio paleidimas

```bash
yarn docker:up
// Pirma karta dependencies projekto įrašyti reik su `yarn`, kitus kartus nereikia
//dependencies - visokios projektui reikalingos bibliotekos, paketai, kad veiktų mūsų projektas
yarn dev
```

> Tai paleidžia vietinį serverį naudojant `nodemon`, kuris stebės bet kokius failų pakeitimus ir perkraus serverį pagal šiuos pakeitimus.
> Serveris veiks adresu `http://0.0.0.0:8000` (arba `http://localhost:8000`).

### Žingsnis 2: Serverio testavimas

Norėdami išbandyti serverį, galite užklausti `http://localhost:8000/api/health` naudodami [Postman](https://www.postman.com/) arba tiesiog įklijuoti jį į savo naršyklės adreso juostą.
Jei serveris veikia, turėtumėte gauti atsakymą `Serveris gyvas`.

### Žingsnis 3: Duomenų bazės lentelės kūrimas

Paleiskite `yarn migration:run`, kad paleistumėte migraciją ir sukurtumėte lentelę.

## Skriptai

⚠️ Išskyrus Docker skriptus, visi skriptai turi būti vykdomi `api` konteinerio shell'e!
(yarn docker:shell)

### • Docker

- Paleiskite `yarn docker:up`, kad paleistumėte konteinerius, aprašytus `docker-compose.yml`. Tai automatiškai atidaro shell'ą `api` konteineryje. Šiame shell'e galite vykdyti kitus skriptus, pvz., `yarn dev`.
- Paleiskite `docker:down`, kad sustabdytumėte veikiančius konteinerius.
- Paleiskite `docker:shell`, kad atidarytumėte shell'ą `api` konteineryje.
- Paleiskite `docker:build`, kad sukurtumėte API vaizdą.

### • Diegimas

- Įdiekite visas priklausomybes su `yarn install`.

### • Paleidimas kūrimo režimu

- Paleiskite `yarn dev`, kad paleistumėte [nodemon](https://www.npmjs.com/package/nodemon) su ts-node, kad serveris veiktų.
- Pagal numatytuosius nustatymus serveris veiks adresu `http://0.0.0.0:8000` (arba `http://localhost:8000`).

### • Kompiliavimas

- Paleiskite `yarn build`, kad sukurtumėte projektą. Kompiliuoti failai bus patalpinti `build/`.
- Paleiskite `yarn start`, kad paleistumėte kompiliuotą projektą.
- Paleiskite `yarn type-check`, kad patikrintumėte tipų atitiktį.

### • Migracijos

- Paleiskite `yarn migration:run`, kad paleistumėte nepaleistas migracijas.
- Paleiskite `yarn migration:generate MigrationName`, kad sukurtumėte migraciją pagal entity pakeitimus.
- Paleiskite `yarn migration:create MigrationName`, kad sukurtumėte tuščią migraciją.
- Paleiskite `yarn migration:revert`, kad atšauktumėte paskutinę migraciją. Jei norite atšaukti kelias migracijas, galite kelis kartus paleisti šią komandą.

### • Linting

- Paleiskite kodo kokybės analizę naudodami `yarn lint`. Tai paleidžia ESLint ir rodo įspėjimus ir klaidas.
- Taip pat galite naudoti `yarn lint:fix`, kad paleistumėte ESLint ir pataisytumėte ištaisomus įspėjimus ir klaidas.

### • Testavimas

- Paleiskite testus naudodami `yarn test`.
- Paleiskite testus su aprėptimi naudodami `yarn test:coverage`.

---

## Projekto struktūra

| Pavadinimas                                | Aprašymas                                  |
| -------------------------------------------| -------------------------------------------|
| \***\*tests**/\*\*                          | Testai                                     |
| \***\*tests**/e2e/\*\*                      | End-to-end testai                          |
| \***\*tests**/utils/\*\*                    | Testų įrankiai                             |
| **@types/**                                 | Globalūs tipų aprašymai                    |
| **build/**                                  | Kompiliuoti šaltinio failai bus čia        |
| **coverage/**                               | Jest aprėpties rezultatai bus čia          |
| **src/**                                    | Šaltinio failai                            |
| **src/config/**                             | Konfigūracijos failai                      |
| **src/controllers/**                        | REST API valdikliai                        |
| **src/controllers/[feature]/index.ts**      | Funkcijos skirti maršrutams                |
| **src/controllers/[feature]/validators.ts** | Validacijos funkcijos skirti maršrutams    |
| **src/entities/**                           | TypeORM entity                             |
| **src/middlewares/**                        | Tarpinės programos                         |
| **src/migrations/**                         | Migracijų failai                           |
| **src/routes/**                             | REST API maršrutai                         |
| **src/routes/[feature].ts**                 | Maršrutai skirti tam tikram funkcionalumui |
| **src/types/**                              | Typescript tipai                           |
| **src/utils/**                              | Naudingos funkcijos                        |
| **src/data-source.ts**                      | TypeORM duomenų šaltinis                   |
| **src/index.ts**                            | REST API pradinė vieta                     |

---

## Autentifikacija

`Passport.js` naudojamas autentifikacijai. Tai lanksti ir modulinė autentifikacijos tarpinių programų sistema, leidžianti lengvai pridėti naujas autentifikacijos strategijas, pvz., prisijungimą su Facebook, Google, Github ir kt.

`Passport` konfigūracija ir funkcijos yra `src/config/passport.ts`.

`serializeUser` apibrėžia, kokie duomenys išsaugomi užklausos sesijoje, dažniausiai saugome vartotojo ID.
`deserializeUser` leidžia gauti visą vartotojo objektą ir priskirti jį į `req.user`, todėl galite lengvai gauti autentifikuotą vartotoją su `req.user`. Jums nereikia aiškiai iškviesti `deserializeUser` prieš iškviečiant `req.user`.

`Passport` dokumentaciją rasite [čia](https://www.passportjs.org/).

Norėdami apsaugoti maršrutą, galite naudoti autentifikacijos tarpines programas, esančias `src/middlewares/auth.ts`.

Norėdami patikrinti, ar vartotojas yra autentifikuotas prieš pasiekdamas maršrutą, naudokite `isAuthenticated`:

```typescript
router.route("/logout").post(isAuthenticated, Auth

Controller.logout);
```

Norėdami patikrinti, ar vartotojas nėra autentifikuotas prieš pasiekdamas maršrutą, naudokite `isUnauthenticated`:

```typescript
router.route("/login").post(isUnauthenticated, AuthController.login);
```

---

## Migracijos

SVARBU, čia kaip su duomenų baze dirbsim

Dėka TypeORM, galite lengvai valdyti savo migracijas. Vykdytos migracijos saugomos lentelėje, kuri leidžia TypeORM žinoti, kurios migracijos turi būti vykdomos, bet taip pat atšaukti migracijas, jei reikia.

⚠️ Migracijos skriptai turi būti vykdomi `api` konteinerio shell'e.

### Sukurti migraciją

Norėdami sukurti migraciją, paleiskite `yarn migration:create MigrationName`. Tai sukurs tuščią migraciją `src/migrations`. Migracijos failas turi dvi funkcijas: `up` ir `down`. `up` vykdoma, kai paleidžiate migraciją. `down` vykdoma, kai atšaukiate migraciją.

### Generuoti migraciją

Norėdami generuoti migraciją pagal entity pakeitimus, paleiskite `yarn migration:generate MigrationName`, tai sukurs migraciją `src/migrations`. Migracija automatiškai generuojama pagal jūsų entity pakeitimus lyginant su esama duomenų baze.

Pavyzdžiui, galite pabandyti pridėti savybę `firstName` į `User` entity:

```typescript
@Column({ nullable: false, length: 20 })
firstName!: string;
```

Tada paleiskite `yarn migration:generate AddFirstNameInUser`, tai automatiškai generuos migraciją, kad sukurtų naują stulpelį.

### Vykdyti migracijas

Norėdami paleisti dar nevykdytas migracijas, paleiskite `yarn migration:run`.

### Atšaukti migraciją

Galite atšaukti paskutinę vykdytą migraciją paleisdami `yarn migration:revert`. Jei norite atšaukti kelias migracijas, galite kelis kartus paleisti šią komandą.