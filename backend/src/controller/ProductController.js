export class ProductController {
    constructor(db) {
        this.db = db
    }

    async get(req, res) {
        const products = await this.db.product.findMany()
        if (!products.length) {
            res.status(404).send({ message: 'No products found' })
            return
        }

        res.status(200).send(products)
    }

    /** 
     * POST /products
     */

    async post(req, res) {
        console.log(req.body);
        const { name, stock, minStock } = req.body;

        const createdProduct = await this.db.product.create({
            data: {
                name: name,
                stock: stock,
                minStock: minStock,
            },
        });
        console.log('Created product:', createdProduct);
        res.status(201).send(createdProduct);
    }
    /**
     * PUT /products/:id
     */
    async put(req, res) {
        const { id } = req.params;
        const updatedProductData = req.body;

        const updatedProduct = await this.db.product.update({
            where: { id: Number(id) },
            data: updatedProductData,
        });

        res.status(200).send(updatedProduct);
    }

    async getId(req, res) {
        const { id } = req.params;

        const product = await this.db.product.findFirst({
            where: { id: Number(id) }
        });
        res.status(200).send(product);

    }
}
