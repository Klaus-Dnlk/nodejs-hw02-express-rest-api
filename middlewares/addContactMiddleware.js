const Joi = require('joi');

module.exports = {
    addContactValidation: (req, res, next) => {
        const schema = Joi.object({
            name: Joi.string()
                .alphanum()
                .min(1)
                .max(30)
                .required(),
            email: Joi.string()
                .email()
                .min(5)
                .max(30)
                .required(),
            phone: Joi.string()
                .alphanum()
                .min(7)
                .max(10)
                .required()
        })

        const validationResult = schema.validate(req.body)
        if(validationResult.error) {
            return res.status(400).json({status: validationResult.error.details})
        }
        next()
    }, 

    


}