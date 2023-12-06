const Errors = {
    UsernameExists: {
      code: 400,
      message: 'Username is taken',
    },
    noParams: {
      code: 400,
      message: 'Missing required properties',
    },
    EmailExists: {
      code: 400,
      message: 'Email already exists',
    },
    PhoneNumberExists: {
      code: 400,
      message: 'Phone number already exists',
    },
    NotFound: {
      code: 404,
      message: 'User not found',
    },
    
  };
  
  export { Errors };
  