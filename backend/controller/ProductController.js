export class ProductController {
    constructor(prisma) {
        this.prisma = prisma
    }

    /**
     * GET /products
     */
    async get(req, res) {
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

    async post(req, res) {
        const { name, stock, minStock } = req.body;
    
        const createdProduct = await this.prisma.product.create({
            data: {
                name: name,
                stock: stock,
                minStock: minStock,
            },
        });

        res.status(201).send(createdProduct);
    }

    /**
     * PUT /products/:id
     */
    async put(req, res) {
        const { id } = req.params;
        const updatedProductData = req.body;

        const updatedProduct = await this.prisma.product.update({
            where: { id: Number(id) },
            data: updatedProductData,
        });

        res.status(200).send(updatedProduct);
    }
}