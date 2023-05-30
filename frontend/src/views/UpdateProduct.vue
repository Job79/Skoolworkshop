<script setup>
import { ref } from 'vue'
import { useProductStore } from '../store/productStore.js'
import { useRoute } from 'vue-router'

const rout = useRoute()
const productStore = useProductStore()

const product = ref({
    name: '',
    stock: '',
    minStock: ''
})

const id = rout.params.id
product.value = await productStore.getProduct(id)

console.log(product.value)
const message = ref('')

async function submitForm (e) {
    e.preventDefault()
    // Check if all fields are filled in
    if (product.value.name && product.value.stock && product.value.minStock) {
        console.log(product.value)
        await productStore.updateProduct(product.value, id)
        message.value = ''
    } else {
        message.value = 'All fields are required'
    }
}

</script>

<template>
    <div class="vh-100 d-flex flex-column justify-content-center align-items-center" style="background-color: #F0F0F0;">
      <h1 class="mb-4 text-center">Update Product</h1>
      <form class="col-lg-6" @submit.prevent="submitForm">
        <div class="mb-4">
          <input type="text" class="form-control form-control-lg" id="name" v-model="product.name" placeholder="Name">
        </div>

        <div class="mb-4">
          <input type="number" class="form-control form-control-lg" id="stock" v-model="product.stock" placeholder="Stock" min="0">
        </div>

        <div class="mb-4">
          <input type="number" class="form-control form-control-lg" id="minStock" v-model="product.minStock" placeholder="Minimum Stock"  min="0">
        </div>

        <!-- Display validation message -->
        <p class="text-danger">{{ message }}</p>

        <button type="submit" class="btn btn-primary btn-lg w-100">Update</button>
      </form>
    </div>
  </template>
