namespace HangFire_Birthday.Models
{
    public class Employee
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public DateTime JoiningDate { get; set; }
        public string Department { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
    }
}
