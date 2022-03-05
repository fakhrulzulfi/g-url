class CustomError extends Error{
    constructor(message, statusCode = 400) {
        super(message);
        this.name = 'Custom Error';
        this.statusCode = statusCode;
    };
}

module.exports = CustomError;
