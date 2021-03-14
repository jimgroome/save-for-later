const dynamodb = require("aws-sdk/clients/dynamodb");

const docClient = new dynamodb.DocumentClient({
  Region: process.env.REGION,
  TableName: process.env.TABLE_NAME,
});

exports.links = async (event, context) => {
  let returnValues = { statusCode: 401 };
  const userId = getUserId(event);
  if (userId) {
    switch (event.httpMethod) {
      case "GET":
        const items = await getLinks(userId);
        if (items) {
          let activeLinks = [];
          let archivedLinks = [];
          let lists = [];
          items.forEach((item) => {
            if (item.recordType === "list") lists.push(item);
            if (item.recordType === "link") {
              if (item.status === "archived") archivedLinks.push(item);
              else activeLinks.push(item);
            }
          });
          returnValues = {
            statusCode: 200,
            body: JSON.stringify({ active: activeLinks, archived: archivedLinks, lists: lists }),
          };
        }

        break;

      case "POST":
        if (await insertLink(event, context, userId)) returnValues.statusCode = 201;
        break;

      case "DELETE":
        if (await archiveLink(event)) returnValues.statusCode = 200;
        break;

      default:
        break;
    }
  }

  returnValues.headers = { "Access-Control-Allow-Origin": "*" };
  return returnValues;
};

exports.lists = async (event, context) => {
  let returnValues = { statusCode: 401 };
  const userId = getUserId(event);
  if (userId) {
    switch (event.httpMethod) {
      case "GET":
        const items = await getLists(userId);
        if (items) {
          returnValues = {
            statusCode: 200,
            body: JSON.stringify({ lists: items }),
          };
        }
        break;

      case "POST":
        if (await insertList(event, context, userId)) returnValues.statusCode = 201;

        break;

      case "PUT":
        if ("id" in event.pathParameters) {
          if (await updateList(event, context, userId)) returnValues.statusCode = 200;
        }
        break;

      case "DELETE":
        if (await deleteList(event, userId)) returnValues.statusCode = 200;
        break;

      default:
        break;
    }
  }

  returnValues.headers = { "Access-Control-Allow-Origin": "*" };
  return returnValues;
};

const getLinks = async (userId) => {
  let links = [];

  await docClient
    .query({
      TableName: process.env.TABLE_NAME,
      IndexName: "userId-created-index",
      KeyConditionExpression: "#userId = :userId",
      ExpressionAttributeNames: { "#userId": "userId" },
      ExpressionAttributeValues: { ":userId": userId },
    })
    .promise()
    .then((response) => (links = response.Items))
    .catch((e) => {
      console.log(e);
      return false;
    });

  links = sortArrayOfObjectsByKey(links, "created", false);

  return links;
};
const getLists = async (userId) => {
  let lists = [];

  await docClient
    .query({
      TableName: process.env.TABLE_NAME,
      IndexName: "userId-created-index",
      KeyConditionExpression: "#userId = :userId, recordType = list",
      ExpressionAttributeNames: { "#userId": "userId" },
      ExpressionAttributeValues: { ":userId": userId },
    })
    .promise()
    .then((response) => (lists = response.Items))
    .catch((e) => {
      console.log(e);
      return false;
    });

  lists = sortArrayOfObjectsByKey(lists, "created", false);

  return lists;
};
const insertLink = async (event, context, userId) => {
  const body = JSON.parse(event.body);
  console.log(body);
  const currentDateTime = new Date();
  let response = false;
  await docClient
    .put({
      TableName: process.env.TABLE_NAME,
      Item: {
        uuid: context.awsRequestId,
        url: body.url,
        title: body.title,
        created: currentDateTime.toISOString(),
        status: "active",
        userId: userId,
        recordType: "link",
      },
    })
    .promise()
    .then(() => {
      response = true;
    })
    .catch((e) => {
      console.log(e);
    });
  return response;
};
const insertList = async (event, context, userId) => {
  const body = JSON.parse(event.body);
  console.log(body);
  const currentDateTime = new Date();
  let response = false;
  await docClient
    .put({
      TableName: process.env.TABLE_NAME,
      Item: {
        uuid: context.awsRequestId,
        title: body.title,
        created: currentDateTime.toISOString(),
        status: "active",
        userId: userId,
        recordType: "list",
      },
    })
    .promise()
    .then(() => {
      response = true;
    })
    .catch((e) => {
      console.log(e);
    });
  return response;
};
const updateList = async (event) => {
  const body = JSON.parse(event.body);
  let response = false;
  await docClient
    .update({
      TableName: process.env.TABLE_NAME,
      Key: {
        uuid: event.pathParameters.id,
      },
      UpdateExpression: "set title = :title",
      ExpressionAttributeValues: { ":title": body.title },
    })
    .promise()
    .then(() => {
      response = true;
    })
    .catch((e) => {
      console.log(e);
    });
  return response;
};

const archiveLink = async (event) => {
  let response = false;
  if ("id" in event.pathParameters) {
    await docClient
      .update({
        TableName: process.env.TABLE_NAME,
        Key: { uuid: event.pathParameters.id },
        UpdateExpression: "set #status = :status",
        ExpressionAttributeNames: { "#status": "status" },
        ExpressionAttributeValues: { ":status": "archived" },
      })
      .promise()
      .then(() => {
        response = true;
      })
      .catch((e) => console.log(e));
  }
  return response;
};
const deleteList = async (event, userId) => {
  let response = false;
  if ("id" in event.pathParameters) {
    await docClient
      .delete({
        TableName: process.env.TABLE_NAME,
        Key: { uuid: event.pathParameters.id },
      })
      .promise()
      .then(async () => {
        response = true

        // To do: Get all links in this list, and delete them all

        // await docClient
        //   .query({
        //     TableName: process.env.TABLE_NAME,
        //     IndexName: "userId-created-index",
        //     KeyConditionExpression: "#userId = :userId",
        //     FilterExpression: "listId = :listId",
        //     ExpressionAttributeNames: { "#userId": "userId" },
        //     ExpressionAttributeValues: { ":userId": userId, ":listId": event.pathParameters.id },
        //   })
        //   .promise()
        //   .then((response) => (console.log(response.Items)))
        //   .catch((e) => {
        //     console.log(e);
        //     return false;
        //   });
      })
      .catch((e) => console.log(e));
  }
  return response;
};
const sortArrayOfObjectsByKey = (array, field, ascending = true) => {
  return array.sort(function (a, b) {
    var x = a[field];
    var y = b[field];

    if (typeof x == "string") {
      x = ("" + x).toLowerCase();
    }
    if (typeof y == "string") {
      y = ("" + y).toLowerCase();
    }

    if (ascending) {
      return x < y ? -1 : x > y ? 1 : 0;
    } else {
      return x > y ? -1 : x < y ? 1 : 0;
    }
  });
};
const getUserId = (event) => {
  let userId;
  if ("authorizer" in event.requestContext) {
    userId = event.requestContext.authorizer.claims.sub;
  } else {
    userId = "c7249ceb-7494-47b2-b9a6-6ace630746f8";
  }
  return userId;
};
