'use strict';

const TABLE_USER = process.env.DYNAMODB_USERS_TABLE;

const getDynamoDBDocumentClient = (previousOptions) => {
  const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
  AWS.config.update({region: process.env.DDB_REGION});
  const options = previousOptions ? previousOptions : {};
//   connect to local DB if running offline
  if (process.env.IS_OFFLINE) {
    options['endpoint'] = "http://localhost:8000";
    options['region'] = process.env.DDB_REGION;
  } else {
    options['region'] = process.env.DDB_REGION;
  }
  const dynamoDbClient = new AWS.DynamoDB.DocumentClient(options);
  return dynamoDbClient;
}

const insertUser = async (params) => {
    const dynamoDbClient = getDynamoDBDocumentClient();
    const insertParams = {
        TableName: TABLE_USER,
        Item: {
            email: params.data.email,
            images: [],
            createdAt: params.timestamp,
            updatedAt: params.timestamp,
        },
        ConditionExpression: 'attribute_not_exists(email)',
    };

    let response = {};
    try {
        response = await dynamoDbClient.put(insertParams).promise();
    } catch (error) {
        // throw new Error(error);
        throw new Error(`Unable to create user. User ${params.data.email} already exists.`);
    }
    return response;
}

const insertImageIntoImageList = async (params) => {
  const dynamoDbClient = getDynamoDBDocumentClient();
  const updateParams = {
      TableName: TABLE_USER,
      Key: { 
        email: params.email,
      },
      UpdateExpression: 'SET images = list_append(images, :newImage)', 
      ConditionExpression: 'attribute_exists(email)',    
      ExpressionAttributeValues: { 
        ':newImage': [params.imageDataElement]
      },
  };

  let response = {};
  try {
      response = await dynamoDbClient.update(updateParams).promise();
  } catch (error) {
      throw new Error(error);
      // throw new Error(`Unable to update list of images. User ${params.data.email} already exists.`);
  }
  return response;
}

const getUser = async (email) => {
    const dynamoDbClient = getDynamoDBDocumentClient();
    const getParams = {
      TableName: TABLE_USER,
      Key: {
        email: email,
      },
    };
  
    let response;
    try {
        response = await dynamoDbClient.get(getParams).promise();
    } catch (error) {
        throw new Error(error);
    }
    console.log('getUser response:' + JSON.stringify(response));
    return response.Item;
  };

module.exports = {
  insertUser,
  getUser,
  insertImageIntoImageList
};