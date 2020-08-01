'use strict';

const dynamoUtils = require('../utils/dynamoUtils');
const userCrud = require('../functions/userCrud');

module.exports.hello = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };
};


module.exports.insert_user = async (event, context) => {
  const response = {
    statusCode: 400,
    body: 'Error',
  };

  try {
    let timestamp = new Date().getTime();
    let data = event.body;

    console.log('data:' + JSON.stringify(data));

    if (typeof data.email !== 'string') {
      console.error('Validation Failed');
      throw new Error('Error: invalid email');
    }
  
    const createUserParams = {
      timestamp: timestamp,
      data: data
    };

    const insertUserResponse = await dynamoUtils.insertUser(createUserParams);    
    response.statusCode = 200;
    response.body = `User ${data.email} inserted successfully.`;
  } catch (err) {
    console.log(err);
  }
    return response;
};

module.exports.insert_image = async (event, context) => {
  const response = {
    statusCode: 400,
    body: 'Error',
  };

  try {
    let timestamp = new Date().getTime();
    let email = event.pathParameters.email;
    let imageId = 1514314315;
    let imageData = event.body;
    imageData.imageCreationDate = timestamp;

    console.log('event:' + JSON.stringify(event));

    if (typeof email !== 'string') {
      console.error('Validation Failed');
      throw new Error('Error: invalid email');
    }
  
    const insertImageParams = {
      email:email,
      imageDataElement: [imageId, imageData]
    };

    const insertImageResponse = await dynamoUtils.insertImageIntoImageList(insertImageParams);    
    response.statusCode = 200;
    response.body = `Image ${imageId} inserted successfully.`;
  } catch (err) {
    console.log(err);
  }
    return response;
};

module.exports.get_user = async (event) => {
  const response = {
    statusCode: 400,
    body: 'Error',
  };

  let email = event.pathParameters.email;

  console.log('input email:' + email);

  if (typeof email !== 'string') {
    console.error('Validation Failed');
    throw new Error('Error: invalid email');
  }
  
  try {
    let userInformation = await dynamoUtils.getUser(email);
    if (userInformation) {
      response.statusCode = 200;
      response.body = JSON.stringify(userInformation);
    }
  } catch (error) {
    console.error(error);
  }
  return response;
};

