const dynamodb = require("aws-sdk/clients/dynamodb");
const docClient = new dynamodb.DocumentClient({
  Region: process.env.REGION,
  TableName: process.env.TABLE_NAME,
});

exports.getPlaceDetails = async (event) => {
  const placeDetail = await docClient
    .query({
      TableName: process.env.TABLE_NAME,
      IndexName: "slug-index",
      KeyConditionExpression: "#slug = :slug",
      ExpressionAttributeNames: {
        "#slug": "slug",
      },
      ExpressionAttributeValues: {
        ":slug": event.queryStringParameters.slug,
      },
    })
    .promise();

  console.log(placeDetail)

  const response = {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify(placeDetail.Items[0]),
  };

  return response;
};

exports.newTrackTrace = async (event, context) => {
  const body = JSON.parse(event.body);

  let response = {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
  };

  let timestamp = new Date();
  timestamp = timestamp.toISOString();

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      id: context.awsRequestId,
      recordType: "visit",
      placeId: body.placeId,
      name: body.name,
      phone: body.phone,
      email: body.email,
      timestamp: timestamp,
    },
  };

  await docClient.put(params).promise();
  return response;
};
