import { Router } from 'express';
import { ProductServices } from './products.services.js'
import { uploadFile } from '../../middleware/FileHandler.js'
import bodyParser from 'body-parser';

const jsonParser = bodyParser.json();




class ProductsController {
  constructor() {
    this.router = Router();
    this.initializeRoutes();
    this.productServices = new ProductServices();
  }


  initializeRoutes() {

    this.router.get('/categories', jsonParser, async (req, res) => { 
      const data = await this.productServices.getCategories(req.body);  
      res.status(200).json({
        success: true,
        message: '',
        data,
      });
    });

    
    this.router.get('/details/:productId', jsonParser, async (req, res) => { 
        const data = await this.productServices.getProductDetails(req.body);  
        res.status(200).json({
          success: true,
          message: '',
          data,
        });
      });
      
    
    this.router.get('/filter', jsonParser, async (req, res) => { 
        const data = await this.productServices.filterProducts(req.body);  
        res.status(200).json({
          success: true,
          message: '',
          data,
        });
      });
    
    
  }
}

export default ProductsController;
