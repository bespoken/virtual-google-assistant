exports.handler = function (event, context, callback) {
    callback(null, {
        "fulfillmentMessages": [
            {
                "card": {"title": "card title"}
            }
        ],
    })
}