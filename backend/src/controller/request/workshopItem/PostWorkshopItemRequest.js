import { Request } from '../Request.js'

export class PostWorkshopItemRequest extends Request {
    schema = {
        type: 'object',
        additionalProperties: false,
        required: ['workshopId', 'productId', 'people', 'quantity'],
        properties: {
            workshopId: { type: 'number' },
            productId: { type: 'number' },
            people: { type: 'number' },
            quantity: { type: 'number' }
        }
    }

    constructor (req) {
        super(req.body)
    }
}
