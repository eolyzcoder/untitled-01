import { Router } from 'express';
import { UserServices } from './users.services.js'
import { uploadFile } from '../../middleware/FileHandler.js'
import bodyParser from 'body-parser';

const jsonParser = bodyParser.json();




class UsersController {
  constructor() {
    this.router = Router();
    this.initializeRoutes();
    this.userServices = new UserServices();
  }


  initializeRoutes() {
    this.router.post('/createUserProfile', jsonParser, async (req, res) => {
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

    this.router.post('/login', jsonParser, async (req, res) => { 
      const data = await this.userServices.login(req.body);  
      res.status(200).json({
        success: true,
        message: 'Otp sent successful',
        data,
      });
    });

    this.router.post('/verifyOtp', jsonParser, async (req, res) => { 
      const data = await this.userServices.verifyOtp(req.body);  
      res.status(200).json({
        success: true,
        message: 'Verified',
        data,
      });
    });

    this.router.post('/uploadFiles', jsonParser, async (req, res) => { 
      const uploadedFiles = uploadFile.array('files', 10);
      res.status(200).json({
          success: true,
          message: "File uploaded successfully!",
          data: uploadedFiles,
        });
    });

    this.router.get('/', async (req, res) => {
      const data = await this.userServices.getUser(req.query.id);  
      res.status(200).json({
        success: true,
        message: 'User Retrieved!',
        data,
      });
      
    });
    
  }
}

export default UsersController;
