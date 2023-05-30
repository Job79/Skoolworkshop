<script setup>
import { ref } from 'vue'
import { useProductStore } from '../store/productStore.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const productStore = useProductStore()

const product = ref({
    name: '',
    stock: '',
    minStock: ''
})

const message = ref('')

const submitForm = (e) => {
    e.preventDefault()

    if (product.value.name && product.value.stock && product.value.minStock) {
        console.log(product.value)
        productStore.createProduct(product.value)
        message.value = ''
        router.push('/products')
    } else {
        message.value = 'All fields are required'
    }

    if (product.value.stock < product.value.minStock) {
        message.value = 'Stock must be higher than minimum stock'
    }
}
</script>

<template>
    <div class="vh-100 d-flex flex-column justify-content-center align-items-center" style="background-color: #F0F0F0;">
      <h1 class="mb-4 text-center">Add Product</h1>
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

        <button type="submit" class="btn btn-primary btn-lg w-100">Add Product</button>
      </form>
    </div>
  </template>
