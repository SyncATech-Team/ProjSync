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
  - [Prerequisites](#prerequisites)
  - [Korišćenje](#usage)
- [👥 Authors](#authors)
<!-- - [🙏 Acknowledgements](#acknowledgements) -->

<!-- PROJECT DESCRIPTION -->

# 📖 ProjSync <a name="about-project"></a>

Aplikacija ProjSync je razvijena kao deo projekta za potrebe predmeta Uvod u softversko inženjerstvo školske 2023/2024. godine. Osnovni cilj projekta je pružiti efikasan alat za upravljanje projektima koji bi korisnicima omogućio da organizuju, prate i koordiniraju različite zadatke, resurse i aktivnosti u okviru svojih projekata.

## 🛠 Razvoj <a name="built-with"></a>

### Tech Stack <a name="tech-stack"></a>

Što se tehnologija tiče, navedena aplikacija je razvijena korišćenjem savremenih web tehnologija - Angular kao frontend, dok je za potrebe serverske strane korišćen .NET framework i MySQL baza podataka.

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
    <li><a href="https://www.mysql.com/">MySQL</a>
    ([Dokumentacija](https://gitlab.pmf.kg.ac.rs/si2024/syncatech/-/blob/master/docs/manuals/mysql/MySQLManual_vPDF.pdf))
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

- [Live Demo Link](https://google.com) - biće priložen prilikom migracije na server

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

Za potrebe kreiranja MySQL baze podataka korišćena je WAMP verzija 3.3.2 koja se može pronaći na sledećem [linku](https://www.wampserver.com/en/).  
Međutim, moguće je korišćenje MySQL baze podataka i na druge načine uz **ograničenje default storage engine-a** na: **InnoDb**.

### Setup

Aplikacija se može klonirati u željeni direktorijum sledećom komandom:

```sh
  git clone http://gitlab.pmf.kg.ac.rs/si2024/syncatech.git
```

Kao rezultat komande u trenutnom radnom direktorijumu će biti kloniran projekat.

Takodje, moguće je preuzeti i **.zip** verziju koju je potrebno otpakovati u određeni direktorijum takođe.

Nakon kreiranja baze podataka pod nazivom "syncatecdb" u fajlu ``` /src/back/backAPI/backAPI/appsettings.json ``` promeniti konekcioni string ka MySQL bazi koji odgovaraju vašim kredencijalima. Primer konekcionog stringa koji je u upotrebi je sledećeg formata:
```sh
"SyncATechDefaultConectionMySQL": "Server=localhost;Database=syncatechdb;username=root;password=;"
```

### Korišćenje

Prvi korak pri korišćenju aplikacije je kreiranje baze. U *Developer PowerShell*-u pokrenuti komandu **dotnet ef database update** iz root direktorijuma solution-a (```/src/back/backAPI/backAPI/```). Ukoliko baza prethodno postoji pokrenuti komandu **dotnet ef database drop**.

Ukoliko koristite WAMP server za potrebe pokretanja aplikacije moguće je na Windows-u pokrenuti .bat fajl: *start_services.bat* lociran u *src* direktorijumu projekta i pratiti dalja uputstva. Pokretanjem ove skripte podići će se lokalni WAMP server i odraditi komande za pokretanje frontend i backend delova aplikacije. (*Napomena: Za potrebe pokretanja na ovaj nacin potrebno je da se instalcija WAMP servera nalazi na putanji:* ```C:\wamp64\wampmanager.exe```)

Takođe, moguće je manuelno pokretanje frontend i backend delova aplikacije:
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

<!--
### Deployment

You can deploy this project using:


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

👤 **Dora Dimitrijević**

- GitHub: [@githubhandle](https://github.com/githubhandle)
- LinkedIn: [LinkedIn](https://linkedin.com/in/linkedinhandle)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- ACKNOWLEDGEMENTS 

## 🙏 Acknowledgments <a name="acknowledgements"></a>

> Give credit to everyone who inspired your codebase.

I would like to thank...

<p align="right">(<a href="#readme-top">back to top</a>)</p>
-->

