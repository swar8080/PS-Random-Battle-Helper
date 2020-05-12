/**
 * @prettier
 */
import { generateMoveSets } from "./generate-movesets";

type RequestParams = { gen?: Generation; pokemon?: string } | null;

exports.lambdaHandler = async (
    event: AWSLambda.APIGatewayEvent,
    context: AWSLambda.APIGatewayEventRequestContext
) => {
    let response;
    try {
        let sets: RandomTeamsTypes.RandomSet[] = [];

        const params: RequestParams = event.queryStringParameters as RequestParams;
        if (params) {
            sets = generateMoveSets(params.pokemon, params.gen, 10);
        }

        response = {
            statusCode: 200,
            body: JSON.stringify(sets),
        };
    } catch (err) {
        console.log(err);
        return err;
    }
    return response;
};
