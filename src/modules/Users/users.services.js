import { UsersRepository } from './users.repository.js';
import { AppError } from '../../config/error.handler.js';
import ip from 'ip';
import geoip from 'geoip-lite';
import { Errors } from './users.errors.js';
import jwt from 'jsonwebtoken';
import vars  from '../../config/vars.js';

class UserServices {
    constructor() {
      this.userRepository = new UsersRepository(); 
    }
    
    async generateToken(id) {
      return jwt.sign({ data: id }, vars.jwtSecret);
    }

    async getLocation() {
      const myIpAddress = ip.address();
      const geo = geoip.lookup(myIpAddress);
  
      const location = {};
      if (geo) {
        location.latitude = geo.ll[0];
        location.longitude = geo.ll[1];
        location.timezone = geo.timezone;
        location.country = geo.country;
  
        const tzDate = new Date().toLocaleString('en-US', { timeZone: geo.timezone });
        const timezoneOffsetInHours = new Date(tzDate).getHours() - new Date().getHours();
  
        location.hours_difference = timezoneOffsetInHours;
      } else {
        return undefined;
      }
      return location;
    }
  
    async createUser(args) {
      const { userName, name, emailAddress, phoneNumber, countryCode, deviceToken } =  args || {};

       // Check if required properties are provided
      if (!userName || !name || !emailAddress || !phoneNumber || !countryCode || !deviceToken) {
        throw new AppError(Errors.noParams);
      }

      const existingUser = await this.userRepository.findUser({ userName, emailAddress, phoneNumber });
  
      if (existingUser) {
        if (existingUser.phoneNumber === phoneNumber) throw new AppError(Errors.PhoneNumberExists);
        if (existingUser.emailAddress === emailAddress) throw new AppError(Errors.EmailExists);
        if (existingUser.userName === userName) throw new AppError(Errors.UsernameExists);
      }
  
      const location = await this.getLocation();
      let profileImage = 'public/default_profile.png';
      const newUser = await this.userRepository.createUser({
        emailAddress,
        phoneNumber,
        location,
        deviceToken,
        countryCode,
        userName,
        name,
        profileImage,
      });
  
      const token = await this.generateToken(newUser._id);
      return {
        user: newUser,
        token,
      };
    }
  }

  export { UserServices };