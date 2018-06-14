/**
 * Responds to any HTTP request with a helloWorld.
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
exports.helloWorld = function helloWorld (req, res) {
    res.status(200).send({"speech": "Hello World","displayText": "Hello World Displayed"});
};
