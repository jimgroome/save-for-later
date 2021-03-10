const dynamodb = require("aws-sdk/clients/dynamodb");
const docClient = new dynamodb.DocumentClient({
  Region: process.env.REGION,
  TableName: process.env.TABLE_NAME,
});

const sortByOrder = (data) => {
  const sorted = data.sort(function (a, b) {
    return a.order - b.order;
  });
  return sorted;
};

const sortByString = (data, order, direction = "asc") => {
  let sorted = data.sort((a, b) => a[order].localeCompare(b[order]));
  if (direction === "desc") sorted = sorted.reverse();
  return sorted;
};

const verifyUserIsAdminOfPlace = async (userId, placeId) => {
  let authorized = false;
  const places = await docClient
    .query({
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: "#id = :id",
      ExpressionAttributeNames: {
        "#id": "id",
      },
      ExpressionAttributeValues: {
        ":id": userId,
        ":recordType": "adminOf",
      },
      FilterExpression: "recordType = :recordType",
    })
    .promise();

  if (places.Count === 1) {
    if (places.Items[0].adminOf === placeId) authorized = true;
  }

  return authorized;
};

const getUserId = (event) => {
  let userId;
  if ("authorizer" in event.requestContext) {
    userId = event.requestContext.authorizer.claims.sub;
  } else {
    userId = "6d5baee8-7ec2-41df-aa5c-0bc7928e02bf";
  }
  return userId;
};

const getPlaceByUserId = async (userId) => {
  const places = await docClient
    .query({
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: "#id = :id",
      ExpressionAttributeNames: {
        "#id": "id",
      },
      ExpressionAttributeValues: {
        ":id": userId,
        ":recordType": "adminOf",
      },
      FilterExpression: "recordType = :recordType",
    })
    .promise();

  const place = await docClient
    .query({
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: "#id = :id",
      ExpressionAttributeNames: {
        "#id": "id",
      },
      ExpressionAttributeValues: {
        ":id": places.Items[0].adminOf,
      },
    })
    .promise();

  return place.Items[0];
};

const getTrackTraceByPlaceId = async (placeId) => {
  const trackTrace = await docClient
    .query({
      TableName: process.env.TABLE_NAME,
      IndexName: "placeId-index",
      KeyConditionExpression: "placeId = :placeId",
      ExpressionAttributeValues: {
        ":recordType": "visit",
        ":placeId": placeId,
      },
      FilterExpression: "recordType = :recordType",
    })
    .promise();

  return trackTrace.Items;
};

exports.getPlace = async (event) => {
  const userId = getUserId(event);
  const place = await getPlaceByUserId(userId);

  if (place.categories.length) {
    place.categories = sortByOrder(place.categories);
    place.categories.forEach((category) => {
      if (category.products.length) {
        category.products = sortByOrder(category.products);
        category.products.forEach((product) => {
          if (product.sizes.length) {
            product.sizes = sortByOrder(product.sizes);
          }
        });
      }
    });
  }

  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify(place),
  };
};
exports.getDashboard = async (event) => {
  const userId = getUserId(event);
  const place = await getPlaceByUserId(userId);

  place.trackTrace = sortByString(await getTrackTraceByPlaceId(place.id), "timestamp", "desc");

  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify(place),
  };
};

exports.updateProducts = async (event) => {
  const body = JSON.parse(event.body);

  const userId = getUserId(event);
  const placeId = body.placeId;

  let response = {
    statusCode: 403,
    headers: { "Access-Control-Allow-Origin": "*" },
  };

  if (await verifyUserIsAdminOfPlace(userId, placeId)) {
    response.statusCode = 200;

    const params = {
      TableName: process.env.TABLE_NAME,
      Key: {
        id: placeId,
      },
      UpdateExpression: "set categories=:products",
      ExpressionAttributeValues: {
        ":products": body.products,
      },
    };

    await docClient.update(params).promise();
  }
  return response;
};
exports.updateBranding = async (event) => {
  const body = JSON.parse(event.body);

  const userId = getUserId(event);
  const placeId = body.placeId;

  let response = {
    statusCode: 403,
    headers: { "Access-Control-Allow-Origin": "*" },
  };

  if (await verifyUserIsAdminOfPlace(userId, placeId)) {
    response.statusCode = 200;

    const params = {
      TableName: process.env.TABLE_NAME,
      Key: {
        id: placeId,
      },
      UpdateExpression: "set branding=:branding",
      ExpressionAttributeValues: {
        ":branding": body.branding,
      },
    };

    await docClient.update(params).promise();
  }
  return response;
};
exports.updateSocial = async (event) => {
  const body = JSON.parse(event.body);

  const userId = getUserId(event);
  const placeId = body.placeId;

  let response = {
    statusCode: 403,
    headers: { "Access-Control-Allow-Origin": "*" },
  };

  if (await verifyUserIsAdminOfPlace(userId, placeId)) {
    response.statusCode = 200;

    const params = {
      TableName: process.env.TABLE_NAME,
      Key: {
        id: placeId,
      },
      UpdateExpression: "set social=:social",
      ExpressionAttributeValues: {
        ":social": body.social,
      },
    };

    await docClient.update(params).promise();
  }
  return response;
};
