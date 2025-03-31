import { createUser, loginUser, renewToken } from 'controllers/authController';
import { fieldsValidators } from 'middleware/fieldsValidators';
import { jwtValidator } from 'middleware/jwt-validator';
import express, { RequestHandler } from 'express';
import { check } from 'express-validator';


const router = express.Router();


//? register
router.post('/create',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is required').not().isEmpty().isEmail(),
    check('password', 'Password is required').not().isEmpty().isLength({ min : 3 }),
    fieldsValidators,
  ],
  createUser  as RequestHandler
); 
 
//? login default

router.post('/',
  [
    check('email', 'Email is required').not().isEmpty().isEmail(),
    check('password', 'Password is required').not().isEmpty().isLength({ min : 3 }),
    fieldsValidators,
  ],
  loginUser  as RequestHandler
);



//? renew token

router.get('/renew',
  jwtValidator as RequestHandler,
  renewToken as RequestHandler
);




export default router;