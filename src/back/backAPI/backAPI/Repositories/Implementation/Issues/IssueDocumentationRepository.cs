using backAPI.Data;
using backAPI.DTO.Documentation;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface.Issues;
using Microsoft.EntityFrameworkCore;

namespace backAPI.Repositories.Implementation.Issues
{
    public class IssueDocumentationRepository : IIssueDocumentationRepository
    {
        private readonly DataContext _dataContext;

        private readonly string[] allowedFileExtensions = new[] {
            ".jpg", ".jpeg", ".png", ".gif", ".bmp", "svg", // images
            ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt", // documents
        };

        private readonly int MAX_FILESIZE = 10_485_760;

        public IssueDocumentationRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public bool IssueDocumentationDirectoryExist()
        {
            if (Directory.Exists("../issue-documentation"))
                return true;
            return false;
        }

        private bool AllFilesOK(List<IFormFile> files)
        {
            foreach (IFormFile fileItem in files)
            {
                if (fileItem.Length <= 0) // Skip empty files
                    return false;

                if (fileItem.Length > MAX_FILESIZE)
                    return false;

                var extension = Path.GetExtension(fileItem.FileName).ToLower();
                if (!allowedFileExtensions.Contains(extension)) // Not allowed extension
                    return false;
            }

            // ALL OK :)
            return true;
        }

        public async Task<IEnumerable<IssueDocumentation>> GetDocumentationForIssue(int issueId)
        {
            Console.WriteLine("ISSUE ID  " + issueId);
            var result = await _dataContext.IssueDocumentation.Where(doc => doc.IssueId == issueId).ToListAsync();
            return result;

        }

        public async Task<string> WriteMultipleFilesAsync(int issueId, List<IFormFile> files)
        {
            // Perform file check for all of the passed files
            var filesOK = AllFilesOK(files);
            if (!filesOK)
                return "Files are not valid for upload";

            var arr = new List<IssueDocumentation>();
            foreach (IFormFile fileItem in files)
            {
                var extension = Path.GetExtension(fileItem.FileName).ToLower();

                // Cleaning file name in case there are invalid characters
                var fileName = Path.GetFileNameWithoutExtension(fileItem.FileName);
                fileName = Path.GetInvalidFileNameChars().Aggregate(
                    fileName,
                    (current, c) => current.Replace(c.ToString(), string.Empty)
                );
                fileName = fileName.Replace(" ", "_");

                var uniqueFileName = $"{fileName}_{DateTime.Now.Ticks}{extension}";
                var filePath = "../issue-documentation/" + uniqueFileName;

                // Save this path in the database
                // Title, Path, IssueId, DateUploaded
                arr.Add(new IssueDocumentation
                {
                    Title = fileName + extension,
                    Path = filePath,
                    IssueId = issueId,
                    DateUploaded = DateTime.Now
                });

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await fileItem.CopyToAsync(stream);
                }

                // Set file attributes to disable execution
                File.SetAttributes(filePath, FileAttributes.ReadOnly | FileAttributes.NotContentIndexed);
            }

            await _dataContext.IssueDocumentation.AddRangeAsync(arr);
            await _dataContext.SaveChangesAsync();

            return "OK";
        }

        public async Task<bool> DeleteDocument(int documentId)
        {
            var itemToDelete = await _dataContext.IssueDocumentation.FirstOrDefaultAsync(doc => doc.Id == documentId);
            if (itemToDelete == null)
                return false;

            var documentPath = itemToDelete.Path;

            _dataContext.IssueDocumentation.Remove(itemToDelete);
            await _dataContext.SaveChangesAsync();

            try
            {
                // Validate and delete the file
                if (!string.IsNullOrEmpty(documentPath) && File.Exists(documentPath))
                {
                    File.SetAttributes(documentPath, File.GetAttributes(documentPath) & ~FileAttributes.ReadOnly);
                    File.Delete(documentPath);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting file: {ex.Message}");
                return false;
            }

            return true;
        }

        public IEnumerable<DocumentTitles> GetOlderVersionsSorted(ProjectDocumentation newest, IEnumerable<ProjectDocumentation> all)
        {
            List<DocumentTitles> documentTitles = new List<DocumentTitles>();

            return documentTitles;
        }

        public async Task<IssueDocumentation> GetDocumentById(int documentId)
        {
            return await _dataContext.IssueDocumentation.FirstOrDefaultAsync(d => d.Id == documentId);
        }
    }
}
