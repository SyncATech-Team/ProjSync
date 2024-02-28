﻿// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Server.Data;

#nullable disable

namespace Server.Data.Migrations
{
    [DbContext(typeof(AppDbContext))]
    partial class AppDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "8.0.2");

            modelBuilder.Entity("Server.Data.Models.Post", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<bool>("Published")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("Posts");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            Content = "Content of post 1",
                            Published = true,
                            Title = "Post 1"
                        },
                        new
                        {
                            Id = 2,
                            Content = "Content of post 2",
                            Published = true,
                            Title = "Post 2"
                        },
                        new
                        {
                            Id = 3,
                            Content = "Content of post 3",
                            Published = true,
                            Title = "Post 3"
                        },
                        new
                        {
                            Id = 4,
                            Content = "Content of post 4",
                            Published = true,
                            Title = "Post 4"
                        },
                        new
                        {
                            Id = 5,
                            Content = "Content of post 5",
                            Published = true,
                            Title = "Post 5"
                        },
                        new
                        {
                            Id = 6,
                            Content = "Content of post 6",
                            Published = true,
                            Title = "Post 6"
                        });
                });
#pragma warning restore 612, 618
        }
    }
}
