import { Users } from './users.schema.js'; 

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
    const { emailAddress, phoneNumber, deviceToken, userName, location, countryCode, profileImage } = args;

    const clone = {
      emailAddress,
      phoneNumber,
      userName,
      location,
      countryCode,
      deviceToken,
      profileImage,
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
}

export { UsersRepository };

