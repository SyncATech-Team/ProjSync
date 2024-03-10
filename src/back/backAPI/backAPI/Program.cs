using backAPI.Data;
using backAPI.Repositories.Implementation;
using backAPI.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


/*
// SQLite
builder.Services.AddDbContext<DataContext>(opt => {
    opt.UseSqlite(builder.Configuration.GetConnectionString("SyncATechDefaultConectionSQLite"));
});
*/

// MySQL
builder.Services.AddDbContext<DataContext>(opt => {
    opt.UseMySQL(builder.Configuration.GetConnectionString("SyncATechDefaultConectionMySQL"));
});

builder.Services.AddScoped<IUsersRepository, UsersRepository>();                    // inject service
builder.Services.AddScoped<ICompanyRolesRepository, CompanyRolesRepository>();      // inject service
builder.Services.AddScoped<IWorkingHoursRepository, WorkingHoursRepository>();      // inject service

var app = builder.Build();

// Configure the HTTP request pipeline
if(app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI();
}

// da bi front klijent mogao da zove api, potrebno je da se dozvoli CORS
// klijentska aplikacija radi na portu 4200
app.UseCors(builder => builder.AllowAnyHeader().AllowAnyMethod()
    .WithOrigins("http://localhost:4200"));

app.UseAuthorization();
app.MapControllers();

app.Run();

// test commit