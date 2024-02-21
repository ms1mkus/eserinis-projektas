> [!NOTE]
> Kaunas University of Technology | 2024 | P175B015 Programų sistemų inžinerija

## Pavadinimas:
  **Ešerinis**

## Komandos nariai:
  - Martynas Šimkus
  - Mantas Liutkus
  - Povilas Sakalauskas
  - Marius Varna

## Techninė užduotis:

1. Prisijungimas prie puslapio:

   - Vartotojai gali prisijungti prie puslapio su savo paskyra prisijungimo duomenis.
2. Pagrindinis puslapis:

   - Pagrindiniame puslapyje vartotojams pateikiamas Lietuvos žemėlapis su žymekliais (pinpoint'ais) ant ežerų.
   - Paspaudus ant žymeklio, atidaro naujas langas su išsamią informaciją apie ežerą.
   - Informacija apie ežerą apima gylį, plotą ir informaciją apie žuvų rūšis, kurias galima pagauti tame ežere.
   - Vartotojai gali palikti komentarą apie konkretų ežerą, komentaras yra matomas kitiems vartotojams.
3. Informacijos pridėjimas apie pagautą žuvį:

   - Vartotojai gali pridėti informaciją apie tai, kokią žuvį galima pagauti kuriame nors ežere.
   - Galima nurodyti žuvies rūšį.
   - Pateikus šią informaciją, ji tampa matoma kitam vartotojui, kuris peržiūri šio ežero informaciją.
4. Patiktuko funkcija:

   - Vartotojai gali parodyti, kad jiems patinka konkretus ežeras, paspaudę širdelės ikonėlę prie ežero informacijos.
   - Ežeras, kurį vartotojai pasižymi kaip patinkantį, yra išskiriamas iš kitų ežerų ir gali būti filtruojamas.
5. Profilio puslapis:

   - Profilio puslapyje vartotojai gali peržiūrėti ir redaguoti savo vartotojo vardą bei profilio nuotrauką.
   - Taip pat yra informacija apie vartotojo veiklą, tokią kaip patiktų ežerų sąrašas.
6. Navigacija:

   - Puslapyje yra navigaciniai mygtukai leidžiantys vartotojams lengvai pereiti į skirtingus puslapius, tokius kaip pagrindinis puslapis, profilis, žuvies pridėjimas arba atsijungimas.

## Architektūra:
![image](https://github.com/ms1mkus/eserinis/assets/73387448/c9805a31-b4a5-4b07-831c-12a807025a93)

Backend 'operuoja' šie kontroleriai:

| Katalogas       | Failai                       | Aprašymas                             |
|-----------------|------------------------------|--------------------------------------|
| **./auth**      | `index.ts`, `validators.ts`  | Autentifikacijos procesai            |
| **./comment**   | `commentController.ts`       | Komentarų funkcionalumas             |
| **./fish**      | `fishController.ts`          | Žuvų duomenų apdorojimas             |
| **./lake**      | `lakeController.ts`          | Ežerų duomenų apdorojimas            |
| **./users**     | `index.ts`, `validators.ts`  | Vartotojų duomenų apdorojimas        |


## Testavimas ir jo rezultatai:

[Testavimo rezultatai (Ataskaita)](./Unit_Tests.pdf)

## Trumpa naudotojo dokumentacija:

> [!IMPORTANT]
> Prieš pradedant susirašyti: https://git-scm.com/downloads ir https://code.visualstudio.com/download 
  
  * P.S. Projekte cmd/terminalas visur tą patį reiškia, nesvarbu mac ar win.
  
  * Cmd atsidarykite ir paleiskite šias dvi komandas, pakeiskite kabutes atitinkamai su jūsų informacija:
  
  * Nustatykite savo vartotojo vardą: `git config --global user.name "VARDAS PAVARDĖ"`
  * Nustatykite savo el. pašto adresą: `git config --global user.email "VARDAS@pavyzdys.com"`
  
  ### Žingsnis 1: Sukurkite kūrimo aplinką
  
  Jums reikia sukurti kūrimo aplinką prieš pradedant bet ką daryti.
  
  #### Įdiegti [Node.js ir NPM]
  Jei jau turite Node.js kompiuteryje, vis tiek siūlau pereiti visus veiksmus (nes senas node/arba įrašytas blogai gali būti).
  Įsidiekite [chocolatey](https://chocolatey.org/install) jei naudojate Windows, [homebrew](http://brew.sh) jei naudojate MacOS.
  Įdiegę chocolatey/homebrew, atsidarykite cmd PROJEKTE ir paleiskite šias eilutes:
  
  - OSX naudotojams: `brew install node`
  - Windows naudotojams: `choco install nodejs`
  
  #### Įdiegti yarn globaliai
  
  ```bash
  npm install --global yarn
  ```
  
  #### Įdiegti [Docker Desktop](https://www.docker.com/products/docker-desktop).
  
  - Įdiekite Docker Desktop
  - Paleiskite Docker Desktop
  
  * Ir tada cmd paleiskite (atsidarykite cmd kur norite, kad projektas būtų): `git clone https://github.com/ms1mkus/eserinis.git`

> [!TIP]
> Backend instrukcijos yra aplanke [./backend/README.md](./backend/README.md)

> [!TIP]
> Frontend instrukcijos yra aplanke [./frontend/README.md](./frontend/README.md)

> [!CAUTION]
> BŪTINAI turite būti backend aplanke kai bandysite paleisti tas komandas, kurios gide [./frontend/README.md](./frontend/README.md) yra aprašytos.
  Atitinkamai ir su frontend aplanku kai paleidžiate frontend komandas.
