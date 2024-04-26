﻿using backAPI.Data;
using backAPI.DTO.Documentation;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface.Projects;
using Google.Protobuf;
using Microsoft.EntityFrameworkCore;
using System.Security.AccessControl;

namespace backAPI.Repositories.Implementation.Projects {
    public class ProjectDocumentationRepository : IProjectDocumentationRepository {
        private readonly DataContext _dataContext;

        private readonly string[] allowedFileExtensions = new[] {
            ".jpg", ".jpeg", ".png", ".gif", ".bmp", "svg", // images
            ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt", // documents
        };

        private readonly int MAX_FILESIZE = 10_485_760;

        public ProjectDocumentationRepository(DataContext dataContext) {
            _dataContext = dataContext;
        }

        public bool ProjectDocumentationDirectoryExist() {
            if (Path.Exists("../project-documentation")) return true;
            return false;
        }

        public async Task<string> WriteMultipleFilesAsync(int projectId, List<IFormFile> files) {

            // perform file check for all of the passed files
            var filesOK = allFilesOK(files);
            if (!filesOK) return "Files are not valid for upload";

            Console.WriteLine("All files OK");

            Console.WriteLine("Duzina niza: " +  files.Count);

            var arr = new List<ProjectDocumentation>();
            foreach (IFormFile fileItem in files) {

                Console.WriteLine(fileItem.Name);

                var extension = Path.GetExtension(fileItem.FileName).ToLower();

                // sredjivanje naziva fajla u slucaju da posoje karakteri koji nisu validni
                var fileName = Path.GetFileNameWithoutExtension(fileItem.FileName);
                fileName = Path.GetInvalidFileNameChars().Aggregate(
                    fileName,
                    (current, c) => current.Replace(c.ToString(), string.Empty)
                );
                fileName = fileName.Replace(" ", "_");

                var uniqueFileName = $"{fileName}_{DateTime.Now.Ticks}{extension}";
                var filePath = "../project-documentation/" + uniqueFileName;

                // sacuvati ovu putanju u bazi
                // Title, Path, ProjectId, DateUploaded
                arr.Add(new ProjectDocumentation {
                    Title = fileName + extension,
                    Path = filePath,
                    ProjectId = projectId,
                    DateUploaded = DateTime.Now
                });

                using (var stream = new FileStream(filePath, FileMode.Create)) {
                    await fileItem.CopyToAsync(stream);
                }

            }

            await _dataContext.ProjectDocumentation.AddRangeAsync(arr);
            await _dataContext.SaveChangesAsync();

            return "OK";
        }

        public async Task<IEnumerable<ProjectDocumentation>> GetDocumentationForProject(int projectId) {

            var result = await _dataContext.ProjectDocumentation.Where(doc => doc.ProjectId == projectId).ToListAsync();
            return result;

        }

        private bool allFilesOK(List<IFormFile> files) {

            foreach (IFormFile fileItem in files) {
                if (fileItem.Length <= 0) { // skip empty files
                    return false;
                }

                if (fileItem.Length > MAX_FILESIZE) {
                    return false;
                }

                var extension = Path.GetExtension(fileItem.FileName).ToLower();
                if (!allowedFileExtensions.Contains(extension)) { // not allowed extension
                    return false;
                }
            }

            // ALL OK :)
            return true;
        }

        public IEnumerable<DocumentTitles> GetOlderVersionsSorted(ProjectDocumentation newest, IEnumerable<ProjectDocumentation> all) {
            List<DocumentTitles> documentTitles = new List<DocumentTitles>();

            return documentTitles;
        }

        public async Task<bool> DeleteDocument(int documentId) {
            var itemToDelete = await _dataContext.ProjectDocumentation.FirstOrDefaultAsync(doc => doc.Id == documentId);
            if (itemToDelete == null) return false;

            _dataContext.ProjectDocumentation.Remove(itemToDelete);
            await _dataContext.SaveChangesAsync();
            return true;
        }

        public async Task<ProjectDocumentation> GetDocumentById(int documentId) {
            return await _dataContext.ProjectDocumentation.FirstOrDefaultAsync(d => d.Id == documentId);
        }
    }
}
