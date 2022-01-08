import Joi from "joi";
import { HttpCode } from "../../../lib/constans";

const createSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

export const validateUser = async (req, res, next) => {
    try {
        await createSchema.validateAsync(req.body)
    } catch (error) {
        return res
        .status(HttpCode.BAD_REQUEST)
        .json({ 
            status: 'Bad request',
            code: HttpCode.BAD_REQUEST,
            message: `Field ${error.message.replace(/"/g, '')}`
        })
    }
    next()
}