## Pavadinimas:
  **Ešerinis**

## Komandos nariai:
  - Martynas Šimkus
  - Mantas Liutkus
  - Povilas Sakalauskas
  - Marius Varna

## Techninė užduotis:

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
  
  Ir tada cmd pasileiskit (atsidarykit cmd kur norit kad projektas butu :) ): git clone https://github.com/ms1mkus/eserinis.git
  
  Backend instrukcijos yra folderyje ./backend/README.md
  Frontend instrukcijos yra folderyje ./frontend/README.me
  
  BUTINAI turit but backend folderyje kai leisit tas komandas kurios gide  (./frontend/README.md) yra aprasytos.
  ATITINKAMAI ir su frontend folderiu kai leisti frontend komandas.
