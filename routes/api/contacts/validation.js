import Joi from 'joi'
import pkg from 'mongoose'
import { HttpCode, MESSAGE } from '../../../lib/constans'

const { Types } = pkg

const createSchema = Joi.object({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    favorite: Joi.bool().optional(),
})

const updateSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string().optional(),
    favorite: Joi.bool().optional(),
}).or('name', 'email', 'phone', 'favorite')

const updateFavoriteSchema = Joi.object({
  favorite: Joi.bool().optional(),
})

const regLimit = /\d+/

const querySchema = Joi.object({
  limit: Joi.string().pattern(regLimit).optional(),
  skip: Joi.number().min(0).optional(),
  sortBy: Joi.string().valid('name', 'email').optional(),
  sortByDesc: Joi.string().valid('name', 'email').optional(),
  filter: Joi.string().pattern(new RegExp('(name|email|phone)\\|?(name|email)+')).optional()
})

export const validateCreate = async(req, res, next) => {
    try {
        await createSchema.validateAsync(req.body)
    } catch (err) {
        return res.status(HttpCode.NOT_FOUND).json({message: `Field ${err.message.replace(/"/g, '')}`})
    }
    next()
}

export const validateUpdate = async (req, res, next) => {
    try {
      await updateSchema.validateAsync(req.body)
    } catch (err) {
      const [{ type }] = err.details
      if (type === 'object.missing') {
        return res.status(HttpCode.BAD_REQUEST).json({ message: 'missing fields' })
      }
      return res.status(HttpCode.BAD_REQUEST).json({ message: MESSAGE.BAD_REQUEST })
    }
    next()
  }

  export const validateUpdateFavorite = async (req, res, next) => {
    try {
      await updateFavoriteSchema.validateAsync(req.body)
    } catch (err) {
      const [{ type }] = err.details
      if (type === 'object.missing') {
        return res.status(HttpCode.BAD_REQUEST).json({ message: 'missing field favorite' })
      }

      return res.status(HttpCode.BAD_REQUEST).json({ message: MESSAGE.BAD_REQUEST })
    }
    next()
  }

export const validateId = async (req, res, next) => {
    if(!Types.ObjectId.isValid(req.params.id)){
      return res.status(HttpCode.BAD_REQUEST).json({ message: 'invalid object id' })
    }
    next()
  }

export const validateQuery = async (req, res, next) => {
  try {
    await querySchema.validateAsync(req.query)
  } catch (err) {
    return res
      .status(400)
      .json({ message: `Field ${err.message.replace(/"/g, '')}` })
  }
  next()
}