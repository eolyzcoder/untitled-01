import { UsersRepository } from './users.repository.js';
import { AppError } from '../../config/error.handler.js';
import ip from 'ip';
import geoip from 'geoip-lite';
import { Errors } from './users.errors.js';
import jwt from 'jsonwebtoken';
import vars  from '../../config/vars.js';
import { sendOtp, verifyOTP } from '../../helpers/sms.js';

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

    async login(args) {
    
        let { type, phoneNumber, emailAddress } = args;
        phoneNumber = phoneNumber ? phoneNumber.trim() : null;
        emailAddress = emailAddress ? emailAddress.trim().toLowerCase() : null;
        let data = {};

        if (type === 'phone') {
          data = {
            to: phoneNumber,
            channel: 'sms',
          };
        } else {
          data = {
            to: emailAddress.toLowerCase(),
            channel: 'email',
          };
        }
        const { to, channel } = data;
        const param = { to, channel };

        // Sends OTP to the user
        if (emailAddress !== 'eolyz.coder@gmail.com') {
          await sendOtp(param);
        }
        return true;
    }
    
    async verifyOtp (args) {

      let { emailAddress, phoneNumber, code, type } = args;
    
      emailAddress = emailAddress.trim().toLowerCase();
      phoneNumber = phoneNumber.trim();
    
      let data = {};
      if (type === 'phone') {
        data = {
          ...data,
          to: phoneNumber,
        };
      } else {
        data = {
          ...data,
          to: emailAddress.toLowerCase(),
        };
      }
    
      const { to } = data;
      let verificationCheck = await verifyOTP({ to, code });
    
      if (verificationCheck.status === 'approved') {
        const user = await this.userRepository.findByPhoneOrEmail({
          phoneNumber,
          emailAddress,
        });
    
        if (user) {
          if (type === 'email') {
          if (user.emailAddress === emailAddress) user.emailVerified = true
        } else {
          if (user.phoneNumber === phoneNumber) user.phoneNumber = true
        }
        await user.save();

        const userData = user ? {
          id: user._id,
          emailAddress: user.emailAddress,
          phoneNumber: user.phoneNumber,
          name: user.name,
          username: user.userName,
          profileImage: "",
        } : null;

          return {
            data: {
              user: { data: userData, isRegistered: true },
              token: jwt.sign({ data: user._id }, vars.jwtSecret),
            },
          };
        } else {
          return {
            data: {
              user: { data: null, isRegistered: false },
              token: '',
            },
          };
        }
      } else {
        console.log(verificationCheck);
        return true;
      }
    };
    
    async getUser(args) {
    
        const user = await this.userRepository.findById(args)
    
        if (user) {

          const userData = await this.userRepository.userData(user)
  
            return userData
        } else throw new AppError (Errors.NotFound)
        
    }
    
    async deleteUser(args) {
      const user = await this.userRepository.findById(args);
    
      if (user) {
        await this.userRepository.deleteUser(user.id);
    
        return true;
      } else {
        throw new AppError(Errors.NotFound);
      }
    }

  }

  export { UserServices };