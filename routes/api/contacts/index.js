import express from 'express'
import { 
    getContacts, 
    getContactById, 
    addContact, 
    removeContact, 
    updateContact 
} from '../../../controllers/contacts/index'
import { 
    validateCreate, 
    validateUpdate, 
    validateUpdateFavorite, 
    validateId
} from './validation'
import guard from '../../../middlewares/guard'
import wrapperError from '../../../middlewares/error-handler'

const router = express.Router()

router.get('/', guard,wrapperError(getContacts))

router.get('/:id',guard,  validateId, wrapperError(getContactById))

router.post('/', guard, validateCreate, wrapperError(addContact))

router.delete('/:id', guard, validateId, wrapperError(removeContact))

router.put('/:id', guard, validateId, validateUpdate, wrapperError(updateContact))

router.patch('/:id/favorite', guard, validateId, validateUpdateFavorite, wrapperError(updateContact))

export default router
