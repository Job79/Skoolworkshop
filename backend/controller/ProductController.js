export class ProductController {
    constructor (prisma) {
        this.prisma = prisma
    }

    /**
     * GET /products
     */
    async get (req, res) {
        const products = await this.prisma.product.findMany()
        if (!products) {
            res.status(404).send({ message: 'No products found' })
            return
        }

        res.status(200).send(products)
    }

    /**
     * POST /products
     */

    async post (req, res) {
        const { name, stock, minStock } = req.body

        if (!name || !stock || !minStock) {
            res.status(400).send({ message: 'Product name, stock, or minStock is missing.' })
            return
        }

        try {
            const createdProduct = await this.prisma.product.create({
                data: {
                    name,
                    stock,
                    minStock
                }
            })

            res.status(201).send(createdProduct)
        } catch (error) {
            console.log(error.code)

            if (error.code === 'P2002') {
                res.status(400).send({ message: `Product with name ${name} already exists.` })
            }
        }
    }

    /**
     * PUT /products/:id
     */
    async put (req, res) {
        const { id } = req.params
        const updatedProductData = req.body

        const updatedProduct = await this.prisma.product.update({
            where: { id: Number(id) },
            data: updatedProductData
        })

        res.status(200).send(updatedProduct)
    }
}
