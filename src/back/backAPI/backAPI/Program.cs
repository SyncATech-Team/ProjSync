using backAPI.Data;
using backAPI.Entities.Domain;
using backAPI.Extensions;
using backAPI.Repositories.Implementation;
using backAPI.Repositories.Implementation.Projects;
using backAPI.Repositories.Implementation.Issues;
using backAPI.Repositories.Interface;
using backAPI.Repositories.Interface.Projects;
using backAPI.Repositories.Interface.Issues;
using backAPI.Services.Implementation;
using backAPI.Services.Interface;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using backAPI.SignalR;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

builder.Services.AddIdentityServices(builder.Configuration);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// SQLite
builder.Services.AddDbContext<DataContext>(opt => {
    opt.UseSqlite(builder.Configuration.GetConnectionString("SyncATechDefaultConectionSQLite"));
});

/*
// MySQL
builder.Services.AddDbContext<DataContext>(opt => {
    opt.UseMySQL(builder.Configuration.GetConnectionString("SyncATechDefaultConectionMySQL"));
});
*/

builder.Services.AddScoped<IUsersRepository, UsersRepository>();                    // inject service
builder.Services.AddScoped<ICompanyRolesRepository, CompanyRolesRepository>();      // inject service
builder.Services.AddScoped<IWorkingHoursRepository, WorkingHoursRepository>();      // inject service
builder.Services.AddScoped<IUserOnProjectRepository, UserOnProjectRepository>();
builder.Services.AddScoped<IProjectsRepository, ProjectsRepository>();
builder.Services.AddScoped<IProjectTypesRepository, ProjectTypesRepository>();
builder.Services.AddScoped<IProjectVisibilitiesRepository, ProjectVisibilitiesRepository>();
builder.Services.AddScoped<IIssueGroupRepository, IssueGroupRepository>();
builder.Services.AddScoped<IIssueRepository, IssueRepository>();
builder.Services.AddScoped<IIssuePriorityRepository, IssuePriorityRepository>();
builder.Services.AddScoped<IIssueStatusRepository, IssueStatusRepository>();
builder.Services.AddScoped<IIssueTypeRepository, IssueTypeRepository>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IImageRepository, ImageRepository>();
builder.Services.AddScoped<IProjectDocumentationRepository, ProjectDocumentationRepository>();
builder.Services.AddScoped<IUserOnIssueRepository, UserOnIssueRepository>();
builder.Services.AddSignalR();
// uzimamo singleton, necemo da se unisti u scope-u, nego da traje dok i aplikacija
builder.Services.AddSingleton<PresenceTracker>();
builder.Services.AddSingleton<IssueNotificationService>();

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
app.UseCors(builder => builder.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins(origins));

Console.WriteLine("");
Console.WriteLine("CORS policy specified...");

Console.ForegroundColor = ConsoleColor.White;

app.UseAuthorization();
app.MapControllers();
app.MapHub<PresenceHub>("hubs/presence");
app.MapHub<NotificationHub>("hubs/notification");

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

/* ********************************************************************************************
 * SEED DATABASE
 * ******************************************************************************************** */
var context = services.GetRequiredService<DataContext>();

// Seed project type
if (!context.ProjectTypes.Any()) {
    await context.ProjectTypes.AddRangeAsync(
        new ProjectType { Id = 1, Name = "Software development" },
        new ProjectType { Id = 2, Name = "Marketing" },
        new ProjectType { Id = 3, Name = "Business" },
        new ProjectType { Id = 4, Name = "IT" },
        new ProjectType { Id = 5, Name = "Health care" }
    );
}

// Seed project visibility
if(!context.ProjectVisibilities.Any()) {
    await context.ProjectVisibilities.AddRangeAsync(
        new ProjectVisibility { Id = 1, Name = "Public" },
        new ProjectVisibility { Id = 2, Name = "Private" },
        new ProjectVisibility { Id = 3, Name = "Archived" }
    );
}

// Seed task priority
if (!context.IssuePriority.Any()) {
    await context.IssuePriority.AddRangeAsync(
        new IssuePriority { Id = 1, Name = "Lowest" },
        new IssuePriority { Id = 2, Name = "Low" },
        new IssuePriority { Id = 3, Name = "Medium" },
        new IssuePriority { Id = 4, Name = "High" },
        new IssuePriority { Id = 5, Name = "Highest" }
    );
}

// Seed task type
if(!context.IssueTypes.Any()) {
    await context.IssueTypes.AddRangeAsync(
        new IssueType { Id = 1, Name = "Task"},
        new IssueType { Id = 2, Name = "Bug"},
        new IssueType { Id = 3, Name = "Story"}
    );
}

// Seed task statuses
if(!context.IssueStatuses.Any()) {
    await context.IssueStatuses.AddRangeAsync(
        new IssueStatus { Id = 1, Name = "Planning" },
        new IssueStatus { Id = 2, Name = "In progress" },
        new IssueStatus { Id = 3, Name = "Done" }
    );
}

if(!context.CRoles.Any()) {
    await context.CRoles.AddAsync(new CompanyRole {
        Name = "Administrator",
        CanLeaveComments = false,
        CanUploadFiles = false,
        CanManageProjects = false,
        CanUpdateTaskProgress = false,
        CanManageTasks = false
    });
}

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