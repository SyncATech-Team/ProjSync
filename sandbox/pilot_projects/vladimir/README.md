# Mini projekat
Manje aplikacija koja ce koristiti tehnologije: Angular, .NET, relacionu bazu podataka

## Front
Angular

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
dotnet ef migrations ---
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