export class AppError extends Error {
    constructor(error) {
      const { code, message } = error;
      super();
      this.statusCode = code;
      this.message = message;
    }
  }
  
  export class ErrorHandler extends Error {
    constructor(statusCode, message) {
      super()
      this.statusCode = statusCode
      this.message = message
    }
  }
  
  export const handleError = (err, res) => {
    const statusCode = err.statusCode ? err.statusCode : 500
    const message = err.message ? err.message : "Something went wrong"
    
    return res.status(statusCode).json({
      status: false,
      message
    })
  }
  
  export const errorHandle = (statusCode, err, res) => {
    return res.status(statusCode).json({
      status: false,
      message: err
    })
  }
  