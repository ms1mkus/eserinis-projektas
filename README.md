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

## Testavimas ir jo rezultatai:

[Testavimo rezultatai (Ataskaita)](./Unit_Tests.pdf)

## Trumpa naudotojo dokumentacija:

> [!IMPORTANT]
> Prieš pradedant susirašyti: https://git-scm.com/downloads ir https://code.visualstudio.com/download 
  
  * P.S. Projekte cmd/terminalas visur tą patį reiškia, nesvarbu mac ar win.
  
  * Cmd atsidaryt ir pasileist šitas dvi komandas, pakeist kabutes atitinkamai su jūsų info
  
  * Set your username: git config --global user.name "FIRST_NAME LAST_NAME"
  * Set your email address: git config --global user.email "MY_NAME@example.com"
  
  ### Step 1: Set up the Development Environment
  
  You need to set up your development environment before you can do anything.
  
  #### Install [Node.js and NPM]
  Jei jau turit Node.js kompe, vis tiek praeit siulau vis tiek visus stepsus praeit (nes senas node/arba irasytas sudinai gali but)
  Isirasykit [chocolatey](https://chocolatey.org/install) jei Windows, [homebrew](http://brew.sh) jei MacOS.
  Isirase chocolatey/hobrewa atsidarot cmd PROJEKTE ir gazuojam eilutes sitas
  
  - on OSX use `brew install node`
  - on Windows use `choco install nodejs`
  
  #### Install yarn globally
  
  ```bash
  npm install --global yarn
  ```
  
  #### Install [Docker Desktop](https://www.docker.com/products/docker-desktop/).
  
  - Install Docker Desktop
  - Run Docker Desktop
  
  * Ir tada cmd pasileiskit (atsidarykit cmd kur norit kad projektas būtų :) ): git clone https://github.com/ms1mkus/eserinis.git

> [!TIP]
> Backend instrukcijos yra folderyje [./backend/README.md](./backend/README.md)

> [!TIP]
> Frontend instrukcijos yra folderyje [./frontend/README.md](./frontend/README.md)

> [!CAUTION]
> BŪTINAI turite būti backend folderyje kai bandysite leisti tas komandas kurios gide [./frontend/README.md](./frontend/README.md) yra aprašytos.
  Atitinkamai ir su frontend folderiu kai leisti frontend komandas.
