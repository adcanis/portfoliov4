/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	NEXT_PUBLIC_LAMBDA_AUTH_KEY
	NEXT_PUBLIC_LAMBDA_AUTH_ID
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

exports.handler = async (event) => {
  console.log(`event >`, JSON.stringify(event, null, 2));
  const { authorizationToken } = event;
  const response = {
    isAuthorized:
      authorizationToken === process.env.NEXT_PUBLIC_LAMBDA_AUTH_KEY,
    resolverContext: {
      userid: NEXT_PUBLIC_LAMBDA_AUTH_ID,
    },
    ttlOverride: 300,
  };
  console.log(`response >`, JSON.stringify(response, null, 2));
  return response;
};
