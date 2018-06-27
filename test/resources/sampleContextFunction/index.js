/**
 * Responds depending on the context.
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
exports.helloWorld = function helloWorld (req, res) {
    var newMessage;
    if (req.result && req.result.contexts && req.result.contexts[0]) {
        newMessage = req.result.contexts[0].value;
    }

    if (req.queryResult && req.queryResult.outputContexts && req.queryResult.outputContexts[0]) {
        newMessage = req.queryResult.outputContexts[0].value;
    }

    if (newMessage) {
        // We have context, we change the message
        res.status(200).send({
            speech: newMessage,
            displayText: newMessage
        });
        return;
    }

    if (req.queryResult) {
        res.status(200).send({
            speech: "Hello World",
            displayText: "Hello World Displayed",
            // V2 version
            outputContexts: [{
                value: "Simple Context"
            }]
        });
    } else {
        res.status(200).send({
            speech: "Hello World",
            displayText: "Hello World Displayed",
            // V1 version
            contextOut: [{
                value: "Simple Context"
            }]
        });

    }
};