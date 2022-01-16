import { jest } from '@jest/globals'
 import { HttpCode, MESSAGE} from '../../lib/constans'
import { registration, login } from './index'
import userService from '../../service/users/index'

describe('SignUp Unit-test', () => {
    let req, res, next
    beforeEach(() => {
        req = {body: {email: 'tests@test.com', password: '123345678'}}
        res = { status: jest.fn().mockReturnThis(), json: jest.fn((data) => data)}
        next = jest.fn()
        userService.create = jest.fn(async (data) => data)
    })

    test('SignUp new User', async () => {
        userService.isUserExist = jest.fn(async () => false)
        await registration(req, res, next)
        expect(userService.isUserExist).toHaveBeenCalledWith(req.body.email)
        expect(res.status).toHaveBeenCalledWith(HttpCode.CREATED)
    })

    test('SignIn User', async () => {
        userService.getUser = jest.fn(async () => ({
            email: 'test@test.com',
            subscription: 'starter'
        }))
        userService.getToken = jest.fn(async (data) => data)
        userService.setToken = jest.fn(async (data) => data)

        await login(req, res, next)

        expect(userService.getUser).toHaveBeenCalledWith(
            req.body.email, 
            req.body.password
            )
        expect(res.status).toHaveBeenCalledWith(HttpCode.OK)
    })  

    test('Login with invalid credentials', async () => {
        userService.getUser = jest.fn(async () => false);
    
        await login(req, res, next);
    
        expect(userService.getUser).toHaveBeenCalledWith(
          req.body.email,
          req.body.password,
        );
        expect(res.status).toHaveBeenCalledWith(HttpCode.UNAUTHORIZED);
      });


    test('SignUp already exist User', async () => {
        userService.isUserExist = jest.fn(async () => true)
        await registration(req, res, next)
        expect(userService.isUserExist).toHaveBeenCalledWith(req.body.email)
        expect(res.status).toHaveBeenCalledWith(HttpCode.CONFLICT)
    })
    test('SIgnUp with error database', async () => {
        const testError = new Error('Database Error')
        userService.isUserExist = jest.fn(async () => {
            throw testError
        })
        await registration(req, res, next)
        expect(userService.isUserExist).toHaveBeenCalledWith(req.body.email)
        expect(next).toHaveBeenCalledWith(testError)
    })
})