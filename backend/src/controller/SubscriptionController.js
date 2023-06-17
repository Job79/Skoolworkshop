
export class SubscriptionController {
    constructor(db) {
        this.db = db;
    }

    isValidSaveRequest(req, res) {
        // Check the request body has at least an endpoint.
        if (!req.body || !req.body.endpoint) {
            // Not a valid subscription.
            res.status(400);
            res.setHeader('Content-Type', 'application/json');
            res.send(
                JSON.stringify({
                    error: {
                        id: 'no-endpoint',
                        message: 'Subscription must have an endpoint.',
                    },
                }),
            );
            return false;
        }
        return true;
    }

    async save(req, res) {
        if (!this.isValidSaveRequest(req, res)) {
            return;
        }

        try {
            const subscription = await this.db.subscription.create({
                data: {
                    endpoint: req.body.endpoint,
                    keys: req.body.keys
                    // Add any other fields from the subscription here.
                }
            });

            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ data: { success: true } }));
        } catch (err) {
            res.status(500);
            res.setHeader('Content-Type', 'application/json');
            res.send(
                JSON.stringify({
                    error: {
                        id: 'unable-to-save-subscription',
                        message:
                            'The subscription was received but we were unable to save it to our database.',
                    },
                }),
            );
        }
    }
}
