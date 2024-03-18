using backAPI.Data;
using backAPI.Entities.Domain;
using backAPI.Extensions;
using backAPI.Repositories.Implementation;
using backAPI.Repositories.Interface;
using backAPI.Services.Implementation;
using backAPI.Services.Interface;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

builder.Services.AddIdentityServices(builder.Configuration);

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
builder.Services.AddScoped<IProjectsRepository, ProjectsRepository>();
builder.Services.AddScoped<IProjectTypesRepository, ProjectTypesRepository>();
builder.Services.AddScoped<IProjectVisibilitiesRepository, ProjectVisibilitiesRepository>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IEmailService, EmailService>();

var app = builder.Build();

// Configure the HTTP request pipeline
if(app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI();
}

// da bi front klijent mogao da zove api, potrebno je da se dozvoli CORS
Console.ForegroundColor = ConsoleColor.Yellow;
Console.WriteLine("Adding CORS policy");
Console.WriteLine("");

int numOfOrigins = int.Parse(builder.Configuration["AllowedCorsOrigins:NumOfOrigins"]);
string[] origins = new string[numOfOrigins];
for (int i = 0; i < numOfOrigins; i++) {
    string key = "AllowedCorsOrigins:Addresses:" + i;
    var address = builder.Configuration[key];
    Console.WriteLine("\tAllowing CORS policy to origin address [" + address + "]...");

    origins[i] = address;
}
app.UseCors(builder => builder.AllowAnyHeader().AllowAnyMethod().WithOrigins(origins));

Console.WriteLine("");
Console.WriteLine("CORS policy specified...");

Console.ForegroundColor = ConsoleColor.White;

app.UseAuthorization();
app.MapControllers();

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

var context = services.GetRequiredService<DataContext>();
if (!context.Roles.Any(r => r.Name == "Admin"))
{
    var roleManager = services.GetRequiredService<RoleManager<AppRole>>();
    var userManager = services.GetRequiredService<UserManager<User>>();
    var roles = new List<AppRole>()
    {
        new AppRole{Name = "Admin"},
        new AppRole{Name = "Worker"},
        new AppRole{Name = "Guest"}
    };

    foreach (var role in roles)
    {
        await roleManager.CreateAsync(role);
    }

    context.CRoles.Add(new CompanyRole { Name = "Developer" });

    var admin = new User 
    { 
        Email = "admin@gmail.com",
        FirstName = "Admin",
        LastName = "Admin",
        UserName = "admin",
        CompanyRoleId = 1
    };

    await userManager.CreateAsync(admin, "Pa$$w0rd");
    await userManager.AddToRoleAsync(admin, "Admin");
}

app.Run();

// test commit