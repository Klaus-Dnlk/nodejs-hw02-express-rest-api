import Joi from 'joi'
import mongoose from 'mongoose'
import {HttpCode, MESSAGE} from '../../../lib/constans'

const { Types } = mongoose

const createSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    favorite: Joi.bool().optional(),
})

const updateSchema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),
    favorite: Joi.bool().optional(),
}).or('name', 'email', 'phone')

const updateFavoriteSchema = Joi.object({
  favorite: Joi.bool().required(),
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
        return res
        .status(HttpCode.BAD_REQUEST)
        .json({message: `Field ${err.message.replace(/"/g, '')}`})
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
      return res
      .status(HttpCode.BAD_REQUEST)
      .json({ message: `${err.message.replace(/"/g, '')}` })
    }
    next()
  }

  export const validateUpdateFavorite = async (req, res, next) => {
    try {
      await updateFavoriteSchema.validateAsync(req.body)
    } catch (err) {
      const [{ type }] = err.details
      if (type === 'object.missing') {
        return res
        .status(HttpCode.BAD_REQUEST)
        .json({ message: 'missing field favorite' })
      }

      return res
      .status(HttpCode.BAD_REQUEST)
      .json({ message: `${err.message.replace(/"/g, '')}` })
    }
    next()
  }

export const validateId = async (req, res, next) => {
    if(!Types.ObjectId.isValid(req.params.id)){
      return res
      .status(HttpCode.BAD_REQUEST)
      .json({ message: 'invalid object id' })
    }
    next()
  }
