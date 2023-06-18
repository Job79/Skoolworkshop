import { defineStore } from 'pinia'
import axios from 'axios'

export const useWorkshopItemStore = defineStore('workshopItem', {
    state: () => ({
        cacheByWorkshop: {},
        cacheByProduct: {}
    }),
    actions: {
        async byWorkshop (id, force = false) {
            if (this.cacheByWorkshop[id] && !force) return this.cacheByWorkshop[id]

            try {
                const { data } = await axios.get(`/api/workshops/${id}/items`)
                this.cacheByWorkshop[id] = data
                return data
            } catch (err) {
                this.cacheByWorkshop[id] = []
                return this.cacheByWorkshop[id]
            }
        },

        async byProduct (id, force = false) {
            if (this.cacheByProduct[id] && !force) return this.cacheByProduct[id]

            try {
                const { data } = await axios.get(`/api/products/${id}/items`)
                this.cacheByProduct[id] = data
                return data
            } catch (err) {
                this.cacheByProduct[id] = []
                return this.cacheByProduct[id]
            }
        },

        async create (workshopItem) {
            try {
                const { data } = await axios.post('/api/workshopItems', workshopItem)

                if (this.cacheByWorkshop[workshopItem.workshopId]) {
                    this.cacheByWorkshop[workshopItem.workshopId].push(data)
                }

                if (this.cacheByProduct[workshopItem.productId]) {
                    this.cacheByProduct[workshopItem.productId].push(data)
                }

                return data
            } catch (err) {
                throw new Error(err.response.data.error)
            }
        },

        async update (workshopItem, id) {
            try {
                const { data } = await axios.put(`/api/workshopItems/${id}`, workshopItem)

                if (this.cacheByWorkshop[workshopItem.workshopId]) {
                    const idx = this.cacheByWorkshop[workshopItem.workshopId].findIndex(w => w.id === id)
                    this.cacheByWorkshop[workshopItem.workshopId][idx] = data
                }

                if (this.cacheByProduct[workshopItem.productId]) {
                    const idx = this.cacheByProduct[workshopItem.productId].findIndex(w => w.id === id)
                    this.cacheByProduct[workshopItem.productId][idx] = data
                }
            } catch (err) {
                throw new Error(err.response.data.error)
            }
        },

        async delete (id) {
            try {
                await axios.delete(`/api/workshopItems/${id}`)

                for (const workshopId in this.cacheByWorkshop) {
                    const idx = this.cacheByWorkshop[workshopId].findIndex(w => w.id === id)
                    if (idx > -1) {
                        this.cacheByWorkshop[workshopId].splice(idx, 1)
                        break
                    }
                }

                for (const productId in this.cacheByProduct) {
                    const idx = this.cacheByProduct[productId].findIndex(w => w.id === id)
                    if (idx > -1) {
                        this.cacheByProduct[productId].splice(idx, 1)
                        break
                    }
                }
            } catch (err) {
                throw new Error(err.response.data.error)
            }
        }
    }
})
