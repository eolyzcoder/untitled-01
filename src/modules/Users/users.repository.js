import { Users } from './users.schema.js'; 
import { decrypt, encrypt } from '../../helpers/encryptors.js'; 

class UsersRepository {
  async findUser(args) {
    const { userName, phoneNumber, emailAddress, id, checkDuplicate } = args;

    const query = {};
    const checkArray = [];

    if (userName) checkArray.push({ userName });
    if (phoneNumber) checkArray.push({ phoneNumber });
    if (emailAddress) checkArray.push({ emailAddress });

    query.$or = checkArray;

    if (checkDuplicate) {
      query._id = { $nin: [id] };
    }

    try {
      const user = await Users.findOne(query);
      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createUser(args) {
    const { emailAddress, phoneNumber, name, userName, countryCode } = args;

    const clone = {
      name,
      emailAddress,
      phoneNumber,
      userName,
      countryCode
    };

    try {
      const user = await new Users(clone).save();
      return user;
    } catch (error) {
      // Handle the error here, e.g., return an error response.
      console.error(error);
      throw error;
    }
  }


async  findByPhoneOrEmail(args) {
  
  const { emailAddress, phoneNumber } = args;
  const encryptedEmail = emailAddress ? encrypt(emailAddress) : '';
  const encryptedPhoneNumber = phoneNumber ? encrypt(phoneNumber) : '';


    const user = await Users.findOne({
        $or: [
            { emailAddress: encryptedEmail },
            { phoneNumber: encryptedPhoneNumber },
            { secondaryEmail: encryptedEmail },
            { secondaryPhone: encryptedPhoneNumber },
        ],
    });

    return user;
}

async findById(args) {

  const user = await Users.findById(args);
  
  return user;
}

async userData(user) {
  if (!user) {
    return null;
  }

  const { _id, userName } = user;

  return {
    id: _id,
    userName: userName,
  };
}


async deleteUser(userId) {

  await Users.deleteOne({ _id: userId });

}

}

export { UsersRepository };

