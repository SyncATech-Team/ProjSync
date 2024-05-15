<a name="readme-top"></a>

<!--
HOW TO USE:
This is an example of how you may give instructions on setting up your project locally.

Modify this file to match your project and remove sections that don't apply.

REQUIRED SECTIONS:
- Table of Contents
- About the Project
  - Built With
  - Live Demo
- Getting Started
- Authors
- Future Features
- Contributing
- Show your support
- Acknowledgements
- License

OPTIONAL SECTIONS:
- FAQ

After you're finished please remove all the comments and instructions!
-->

<div align="center">
  <!-- You are encouraged to replace this logo with your own! Otherwise you can also remove it. -->
  <img src="./docs/images/logo-resized.png" alt="logo" width="140"  height="auto" />
  <br/>

  <h3><b>ProjSync - Aplikacija za upravljanje projektima</b></h3>

</div>

<!-- TABLE OF CONTENTS -->

# 📗 Sadržaj

- [📖 O projektu](#about-project)
  - [🛠 Razvoj](#built-with)
    - [Tehnologije](#tech-stack)
    - [Glavne funkcionalnosti](#key-features)
  - [🚀 Live Demo](#live-demo)
- [💻 Pokretanje aplikacije](#getting-started)
  - [Setup](#setup)
  - [Korišćenje](#usage)
- [👥 Authors](#authors)
<!-- - [🙏 Acknowledgements](#acknowledgements) -->

<!-- PROJECT DESCRIPTION -->

# 📖 ProjSync <a name="about-project"></a>

Aplikacija ProjSync je razvijena kao deo projekta za potrebe predmeta Uvod u softversko inženjerstvo školske 2023/2024. godine. Osnovni cilj projekta je pružiti efikasan alat za upravljanje projektima koji bi korisnicima omogućio da organizuju, prate i koordiniraju različite zadatke, resurse i aktivnosti u okviru svojih projekata.

## 🛠 Razvoj <a name="built-with"></a>

### Tech Stack <a name="tech-stack"></a>

Što se tehnologija tiče, navedena aplikacija je razvijena korišćenjem savremenih web tehnologija - Angular kao frontend, dok je za potrebe serverske strane korišćen .NET framework i SQLite baza podataka.

<details>
  <summary>Client</summary>
  <ul>
    <li><a href="https://angular.io/">
    Angular
    </a>
    ([Dokumentacija](https://gitlab.pmf.kg.ac.rs/si2024/syncatech/-/blob/master/docs/manuals/angular/AngularManual_vPDF.pdf))
    </li>
  </ul>
</details>

<details>
  <summary>Server</summary>
  <ul>
    <li><a href="https://dotnet.microsoft.com/en-us/">.NET</a>
    ([Dokumentacija](https://gitlab.pmf.kg.ac.rs/si2024/syncatech/-/blob/master/docs/manuals/dotnet/DotNETManual_vPDF.pdf))
    </li>
  </ul>
</details>

<details>
<summary>Database</summary>
  <ul>
    <li><a href="https://www.sqlite.org/">SQLite</a>
    ([Dokumentacija](https://gitlab.pmf.kg.ac.rs/si2024/syncatech/-/blob/master/docs/manuals/sqlite/SQLiteManual_vPDF.pdf))
    </li>
  </ul>
</details>

<!-- Features -->

### Key Features <a name="key-features"></a>

- **Upravljanje podacima o korisnicima i njihovim ulogama**
- **Kreiranje i upravljanje projektima**
- **Upravljanje aktivnostima na projektu**
- **Različiti načinini vizualizacije aktivnosti**
- **Filtriranja podataka**

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LIVE DEMO -->

## 🚀 Live Demo <a name="live-demo"></a>

- [Live Demo Link](http://softeng.pmf.kg.ac.rs:10204) - biće priložen prilikom migracije na server

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## 💻 Pokretanje aplikacije <a name="getting-started"></a>

### Neophodni alati

Za potrebe pokretanja aplikacije neophodno je imati instalirano:
* Node.js - moze se preuzeti putem sledeceg [linka](https://nodejs.org/en/download)
* Angular CLI - instalirati komandom
``` npm install -g @angular/cli ```
* .NET - moze se preuzeti putem sledeceg [linka](https://dotnet.microsoft.com/en-us/download)

Što se kompatibilnosti verzija tiče aplikacija je razvijena uz:
* Angluar CLI: 17.2.1
* Node: 20.11.1
* Packet Manager: npm 10.4.0
* OS: Windows x64
* .NET 8.0.200

### Setup

Aplikacija se može klonirati u željeni direktorijum sledećom komandom:

```sh
  git clone http://gitlab.pmf.kg.ac.rs/si2024/syncatech.git
```

Kao rezultat komande u trenutnom radnom direktorijumu će biti kloniran projekat.

Takodje, moguće je preuzeti i **.zip** verziju koju je potrebno otpakovati u određeni direktorijum takođe.

Za potrebe kreiranja odgovarajuce baze podataka opciono je potrebno promeniti konekcioni string u fajlu _appsettings.json_ koji je u sledecem formatu:
```sh
"SyncATechDefaultConectionSQLite": "Data Source=database.db;Foreign Keys=True"
```

### Korišćenje <a name="usage"></a>

Prvi korak pri korišćenju aplikacije je kreiranje baze. U *Developer PowerShell*-u pokrenuti komandu **dotnet ef database update** iz root direktorijuma solution-a (```/src/back/backAPI/backAPI/```). Ukoliko baza prethodno postoji, a potrebno ju je obrisati, pokrenuti komandu **dotnet ef database drop**.

Frontend i backend aplikacije je moguce pokrenuti komandama:
```sh
# potrebno pokrenuti iz direktorijuma /src/front/angular
ng serve [--open]
```
```sh
# potrebno pokrenuti iz direktorijuma /src/back/backAPI/backAPI/
dotnet run
```
<!--
Example command:

```sh
  rails server
```
--->

<!--
### Run tests

To run tests, run the following command:

Example command:

```sh
  bin/rails test test/models/article_test.rb
```
--->


### Deployment

Za potrebne deployment-a aplikacije potrebno je build-ovati frontend sledecim nizom komandi:
* Premestiti se u direktorijum ```/src/front/angular ```
* Pokrenuti komandu ```ng build ```. Kao rezultat ove komande kreirace se build-ovana verzija za production u direktorijum _dist_.

Backend deo aplikacije publish-ovati sledecim nizom komandi:
* Premestiti se u direktorijum ```/src/back/backAPI/backAPI ```
* Pokrenuti komandu ```dotnet publish -c Release -o out ```. Kao rezultat ove komande u trenutnom direktorijumu ce biti kreiran novi direktorijum pod nazivom _out_ u kome ce se nalaziti potrebni .dll, dependency i ostali fajlovi.
* Prekopirati fajl baze podataka sa ekstenzijom **.db** u out direktorijum.

Kao rezultat prethodnih komandi kreirani su svi potrebni fajlovi za deployment.  
Sada je potrebno prekopirati kreirane build fajlove u odgovarajuce direktorijume na serveru.

Direktorijum ```dist ``` u kome je buildovan frontend potrebno je prekopirati na server komandom:
```sh
  scp -r ./dist/angular syncatech@softeng.pmf.kg.ac.rs:~/production/front
```
***Napomena: Navedenu komandu potrebno je pokrenuti iz direktorijuma ```/src/front/angular ```.

Direktorijum ``` out ``` u kome je publishovana Release verzija backend-a i baze podataka potrebno je prekopirati na server komandom:
```sh
  scp -r ./out syncatech@softeng.pmf.kg.ac.rs:~/production/back
```
***Napomena: Navedenu komandu potrebno je pokrenuti iz direktorijuma ```/src/back/backAPI/backAPI ```

Nakon izvrsenih komandi na serveru se u odgovarajucim direktorijumima nalaze potrebne verzije za pokretanje aplikacije.

**Screen**  
Radi lakseg iskustva u radu sa terminalima na serveru moguce je koristiti komandu _screen_.  
```sh
  screen -S production-front # kreira prozor za pokretanje frontend dela aplikacije
  screen -S production-back # kreira prozor za pokretanje backend dela aplikacije
```
Iz jednog screen-a moguce je izaci prosledjivanjem signala sa tastature ```CTRL + A + D ```  
Moguce je izlistati trenutno aktuelne screen-ove komandom ```screen -ls ```  
Moguce je aktivirati screen komandom ```screen -r naziv ```

Aplikaciju je potrebno pokrenuti startovanjem frontend i backend dela sledecim komandama:  
```sh
  # iz direktorijuma production/front/angular/browser pokrenuti komandu
  python3 -m http.server 10204
```
Kao rezultat ove komande python ce pokrenuti server koji slusa na portu 10204.
```sh
  # iz direktorijuma production/back/out pokrenuti komandu
  dotnet backAPI.dll --urls=http://0.0.0.0:10205/
```
Kao argument komande prosledjuje se port na kome ce slusati backend server.


<!--
Example:

```sh
```
-->

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- AUTHORS -->

## 👥 Authors <a name="authors"></a>

👤 **Radovan Drašković**

- GitHub: [@Drashko73](https://github.com/Drashko73)
- LinkedIn: [LinkedIn](https://linkedin.com/in/radovan-draskovic)

👤 **Mihajlo Nikolić**

- GitHub: [@githubhandle](https://github.com/githubhandle)
- LinkedIn: [LinkedIn](https://linkedin.com/in/linkedinhandle)

👤 **Vladimir Geroski**

- GitHub: [@githubhandle](https://github.com/githubhandle)
- LinkedIn: [LinkedIn](https://linkedin.com/in/linkedinhandle)

👤 **Luka Gvozdenović**

- GitHub: [@githubhandle](https://github.com/githubhandle)
- LinkedIn: [LinkedIn](https://linkedin.com/in/linkedinhandle)

👤 **Milan Bajić**

- GitHub: [@githubhandle](https://github.com/githubhandle)
- LinkedIn: [LinkedIn](https://linkedin.com/in/linkedinhandle)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- ACKNOWLEDGEMENTS 

## 🙏 Acknowledgments <a name="acknowledgements"></a>

> Give credit to everyone who inspired your codebase.

I would like to thank...

<p align="right">(<a href="#readme-top">back to top</a>)</p>
-->

