import { Router } from 'express'
import { validateCreate, validateUpdate, 
    validateUpdateFavorite, 
    validateId, validateQuery } from '../contacts/validation' 
import { getContacts, getContactById, addContact, removeContact, updateContact, updateStatusContact 
} from '../../../controllers/contacts/index'

const router = new Router()

router.get('/', validateQuery, getContacts)

router.get('/:id', validateId, getContactById)

router.post('/', validateCreate, addContact)

router.delete('/:id', validateId, removeContact)

router.put('/:id', validateId, validateUpdate, updateContact)

router.patch('/:id/favorite', validateId, validateUpdateFavorite, updateStatusContact)

export default router
