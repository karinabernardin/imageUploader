# Image Uploader

Basic serverless API to control the upload of images to S3.


## Using the lambda functions

- `sls dynamodb start --stage local`
  > Dynamodb Local Started, Visit: http://localhost:8000/shell
	Serverless: DynamoDB - created table imageuploader-local


- `sls invoke local -f createUser --path inputs\createUser_input.json --stage local`
> data:{"email":"lalala@jmail.com"}
>{
"statusCode": 200,
"body": "User lalala@jmail.com inserted successfully."
}


- `sls invoke local -f getUser --path inputs\getUser_input.json --stage local`
> input email:lalala@jmail.com
> getUser response:{"Item":{"createdAt":1596308842520,"images":[],"email":"lalala@jmail.com","updatedAt":1596308842520}}
{
"statusCode": 200,
"body": "{\"createdAt\":1596308842520,\"images\":[],\"email\":\"lalala@jmail.com\",\"updatedAt\":1596308842520}"
}