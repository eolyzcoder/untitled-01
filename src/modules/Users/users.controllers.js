import { Router } from 'express';
import { UserServices } from './users.services.js'

class UsersController {
  constructor() {
    this.router = Router();
    this.initializeRoutes();
    this.userServices = new UserServices();
  }


  initializeRoutes() {
    this.router.post('/createUserProfile', async (req, res) => {
      try {
        const data = await this.userServices.createUser(req.body);  
        res.status(201).json({
          success: true,
          message: 'Profile created',
          data
         });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to create profile',
          error: error.message,
        });
        console.error(error);
      }
    });
  }
}

export default UsersController;
