# Mini projekat
Manje aplikacija koja ce koristiti tehnologije: Angular, .NET, relacionu bazu podataka

## Front
Angular v16
instaliranje Angular-a:
```bash
npm install -g @angular/cli@16
```
Ukoliko se ne naglasi @16 onda ce da se instalira najnovija verzija.

Kreiranje novog projekta (koji se zove client)
```bash
ng new client
```

Bild i pokretanje aplikacije:
```bash
cd client
ng serve
```

Kreiranje nove komponente i servisa:
```bash
# umesto components moze da se koristi i samo c alias, 
# a --skip-tests je znak da se ne dodaju testovi za komponentu
ng g component nav --skip-tests
ng g service account --skip-tests
```

Dodavanje ngx-bootstarp u projekat (korisceno za dropdown):
```bash
ng add ngx-bootstrap
ng add ngx-bootstrap  --component dropdowns
```
## Backend
.NET 8

Korisne komande:
Kreiranje projekta:
```bash
# dodavanje novog solution fajla
dotnet new sln 
``` 
```bash
# kreiranje novog api projekta, -n name 
dotnet new webapi -n API
# dodavanje API projekta u solution fajl
dotnet sln add API
```

Bildovanje, pokretanje projekta:
```bash
dotnet build
```
```bash
dotnet watch run
```
```bash
# bez hot reload-a nakon izmena
dotnet watch run --no-hot-reload
```

.NET i Entity Framework:
```bash
# InitialCreate za prvo kreiranje, posle je ime opisno sta je dodato
dotnet ef migrations add InitalCreate
dotnet ef database update
```

Paketi potrebni iz NuGet galerije:
za bazu EF i Sqlite
 - Microsoft.EntityFrameworkCore
 - Microsoft.EntityFrameworkCore.Design
 - Microsoft.EntityFrameworkCore.Sqlite

za JWT:
 - Microsoft.IdentityModel.Tokens
 - System.IdentityModel.Tokens.Jwt
 - Microsoft.AspNetCore.Authentication.JwtBearer

## Baza
Sqlite