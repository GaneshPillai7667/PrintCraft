namespace PrintCraft.Application.Services;

public class ServiceResponse<T>
{
    public bool Success { get; init; }
    public string Message { get; init; } = string.Empty;
    public T? Data { get; init; }
    public int StatusCode { get; init; }

    public static ServiceResponse<T> Ok(T data, string message = "Success") => new()
    {
        Success = true,
        Message = message,
        Data = data,
        StatusCode = 200
    };

    public static ServiceResponse<T> Created(T data, string message = "Created") => new()
    {
        Success = true,
        Message = message,
        Data = data,
        StatusCode = 201
    };

    public static ServiceResponse<T> Fail(string message, int statusCode = 400) => new()
    {
        Success = false,
        Message = message,
        Data = default,
        StatusCode = statusCode
    };
}
