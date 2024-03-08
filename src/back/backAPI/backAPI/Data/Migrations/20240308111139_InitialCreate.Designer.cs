﻿// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using backAPI.Data;

#nullable disable

namespace backAPI.Data.Migrations
{
    [DbContext(typeof(DataContext))]
    [Migration("20240308111139_InitialCreate")]
    partial class InitialCreate
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "8.0.2");

            modelBuilder.Entity("backAPI.Entities.RoleCompany", b =>
                {
                    b.Property<int>("RoleCompanyId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<double>("OvertimeHourPrice")
                        .HasColumnType("REAL");

                    b.Property<string>("RoleCompanyName")
                        .HasColumnType("TEXT");

                    b.Property<double>("WeekendHourPrice")
                        .HasColumnType("REAL");

                    b.Property<double>("WorkingHourPrice")
                        .HasColumnType("REAL");

                    b.HasKey("RoleCompanyId");

                    b.HasIndex("RoleCompanyName")
                        .IsUnique();

                    b.ToTable("Roles");
                });

            modelBuilder.Entity("backAPI.Entities.User", b =>
                {
                    b.Property<int>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<byte[]>("PasswordHash")
                        .HasColumnType("BLOB");

                    b.Property<byte[]>("PasswordSalt")
                        .HasColumnType("BLOB");

                    b.Property<int>("RoleCompany")
                        .HasColumnType("INTEGER");

                    b.Property<string>("UserAddress")
                        .HasColumnType("TEXT");

                    b.Property<string>("UserContactPhone")
                        .HasColumnType("TEXT");

                    b.Property<string>("UserEmail")
                        .HasColumnType("TEXT");

                    b.Property<string>("UserFirstName")
                        .HasColumnType("TEXT");

                    b.Property<string>("UserLastName")
                        .HasColumnType("TEXT");

                    b.Property<string>("UserLinkedinProfile")
                        .HasColumnType("TEXT");

                    b.Property<string>("UserProfilePhoto")
                        .HasColumnType("TEXT");

                    b.Property<string>("UserStatus")
                        .HasColumnType("TEXT");

                    b.Property<string>("Username")
                        .HasColumnType("TEXT");

                    b.HasKey("UserId");

                    b.HasIndex("UserEmail")
                        .IsUnique();

                    b.HasIndex("Username")
                        .IsUnique();

                    b.ToTable("Users");
                });
#pragma warning restore 612, 618
        }
    }
}
