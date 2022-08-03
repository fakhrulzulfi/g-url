class CustomError extends Error{
    constructor(message, code = 400) {
        super(message);
        this.name = 'Custom Error';
        this.code = code;
    };
}

module.exports = CustomError;
