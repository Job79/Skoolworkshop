import { HttpError } from './error/HttpError.js'
import { PostProductRequest } from './request/product/PostProductRequest.js'

export class ProductController {
    constructor (db) {
        this.db = db
    }

    async get (req, res) {
        const products = await this.db.product.findMany()
        if (!products.length) {
            throw new HttpError(404, 'no products found')
        }

        res.status(200).send(products)
    }

    /**
     * POST /products
     */

    async post (req, res) {
        const product = new PostProductRequest(req).data()

        try {
            const result = await this.db.product.create({
                data: product
            })
            res.status(201).send(result)
        } catch (error) {
            console.log(error.code)
            if (error.code === 'P2002') {
                throw new HttpError(400, 'Product already exists.')
            }
        }
    }

    /**
     * PUT /products/:id
     */
    async put (req, res) {
        const { id } = req.params
        const updatedProductData = req.body

        const updatedProduct = await this.db.product.update({
            where: { id: Number(id) },
            data: updatedProductData
        })

        res.status(200).send(updatedProduct)
    }

    async getId (req, res) {
        const { id } = req.params

        const product = await this.db.product.findFirst({
            where: { id: Number(id) }
        })
        res.status(200).send(product)
    }
}
