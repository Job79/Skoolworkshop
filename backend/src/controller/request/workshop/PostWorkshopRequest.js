import { Request } from '../Request.js'

export class PostWorkshopRequest extends Request {
    schema = {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'defaultGroupSize'],
        properties: {
            name: { type: 'string' },
            defaultGroupSize: { type: 'number' }
        }
    }

    constructor (req) {
        super(req.body)
    }
}
