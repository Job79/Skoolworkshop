import { Request } from '../Request.js'

export class RequiredStockRequest extends Request {
    schema = {
        type: 'object',
        additionalProperties: false,
        required: ['startDate', 'endDate'],
        properties: {
            startDate: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time' }
        }
    }

    constructor (req) {
        super(req.query)
    }
}
