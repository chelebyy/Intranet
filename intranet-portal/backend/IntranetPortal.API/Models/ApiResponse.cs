using Microsoft.AspNetCore.Mvc;

namespace IntranetPortal.API.Models
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public T? Data { get; set; }
        public string? Message { get; set; }
        public ApiError? Error { get; set; }

        public static ApiResponse<T> Ok(T data, string? message = null)
        {
            return new ApiResponse<T> { Success = true, Data = data, Message = message ?? "İşlem başarılı" };
        }

        public static ApiResponse<T> Fail(string message, string code = "ERROR")
        {
            return new ApiResponse<T> 
            { 
                Success = false, 
                Error = new ApiError { Code = code, Message = message } 
            };
        }
    }

    public class ApiError
    {
        public string Code { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public List<string>? Details { get; set; }
    }
}
