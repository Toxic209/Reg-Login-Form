class ApiResponse{
    constructor(statusCode, data, message = "Success"){
        this.statusCode = statusCode,
        this.data = data,
        this.message = message,
        this.success = statusCode < 400 //using below 400 for Api Response, above 400 are errors which are handled in ApiError.js
    }
}

export {ApiResponse}