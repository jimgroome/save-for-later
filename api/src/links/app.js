const dynamodb = require("aws-sdk/clients/dynamodb");

const docClient = new dynamodb.DocumentClient({
  Region: process.env.REGION,
  TableName: process.env.TABLE_NAME,
});

exports.links = async (event, context) => {
  let returnValues = { statusCode: 501 };
  switch (event.httpMethod) {
    case "GET":
      const links = await getLinks();
      if (links) {
        let activeLinks = [];
        let archivedLinks = [];
        links.forEach((link) => {
          if (link.status === "archived") archivedLinks.push(link);
          else activeLinks.push(link);
        });
        returnValues = { statusCode: 200, body: JSON.stringify({ active: activeLinks, archived: archivedLinks }) };
      }

      break;

    case "POST":
      if (await insertLink(event, context)) returnValues.statusCode = 201;
      break;

    case "DELETE":
      if (await deleteLink(event)) returnValues.statusCode = 200;
      break;

    default:
      break;
  }

  returnValues.headers = { "Access-Control-Allow-Origin": "*" };
  return returnValues;
};

const getLinks = async () => {
  let links = [];

  await docClient
    .scan({ TableName: process.env.TABLE_NAME })
    .promise()
    .then((response) => (links = response.Items))
    .catch((e) => {
      console.log(e);
      return false;
    });

  links = sortArrayOfObjectsByKey(links, "created", false);

  return links;
};
const insertLink = async (event, context) => {
  const body = JSON.parse(event.body);
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
const deleteLink = async (event) => {
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
