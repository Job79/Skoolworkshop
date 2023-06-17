<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useProductStore } from '../store/productStore.js'
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import router from '../router/router.js'

const route = useRoute()
const productStore = useProductStore()

const productId = Number(route.params.id)
const product = await productStore.get(productId)
const amount = ref(0)

async function update () {
    product.stock += amount.value

    const { id, ...data } = product
    await productStore.update(data, id)
    router.back()
}
</script>

<template>
  <div class="popup-container box text-center bg-white justify-content-center">
    <router-link type="button" class="btn float-start hover-darken" :to="`/products/${productId}`">
      <font-awesome-icon :icon="['fas', 'box']" class="p-2" />
    </router-link>
    <div type="button" class="btn float-end hover-darken" @click="router.back">
      <font-awesome-icon :icon="['fas', 'x']" />
    </div>
    <h3 class="pb-3 me-5">{{ product.name }}</h3>
    <div class="d-flex justify-content-center align-items-center pb-3">
      <div class="me-5 iconDivMin">
        <p class="mb-0">10</p>
        <font-awesome-icon :icon="['fas', 'minus']" class="icon fa-2x p-0 rounded-3 hover-darken user-select-none" @click="amount -= 10"/>
      </div>
      <div class="me-5 iconDivMin">
        <p class="mb-0">1</p>
        <font-awesome-icon :icon="['fas', 'minus']" class="icon fa-2x p-0 rounded-3 hover-darken user-select-none" @click="amount--"/>
      </div>
      <input type="number" class="form-control-plaintext" style="width: 2rem" v-model="amount" @input="update" />
      <div class="ms-5 iconDivMax">
        <p class="mb-0">1</p>
        <font-awesome-icon :icon="['fas', 'plus']" class="icon fa-2x p-0 rounded-3 hover-darken user-select-none" @click="amount++"/>
      </div>
      <div class="ms-5 iconDivMax">
        <p class="mb-0">10</p>
        <font-awesome-icon :icon="['fas', 'plus']" class="icon fa-2x p-0 rounded-3 hover-darken user-select-none" @click="amount += 10"/>
      </div>
    </div>

    <div type="button" class="btn btn-primary w-100" @click="update">
      Opslaan
    </div>
  </div>
</template>
