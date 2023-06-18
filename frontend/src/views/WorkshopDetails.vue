<script setup>
import { useRoute } from 'vue-router'
import { useWorkshopStore } from '../store/workshopStore.js'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import TextInput from '../component/input/TextInput.vue'
import { ref } from 'vue'
import WorkshopItemBlock from '../component/workshopItem/WorkshopItemBlock.vue'
import { useProductStore } from '../store/productStore.js'
import { useWorkshopItemStore } from '../store/workshopItemStore.js'
import NumberInput from '../component/input/NumberInput.vue'

const route = useRoute()
const workshopStore = useWorkshopStore()
const workshopItemStore = useWorkshopItemStore()
const productStore = useProductStore()
const workshopId = Number(route.params.id)
const showPopup = ref(false)

const tasks = await Promise.all([
    workshopStore.get(workshopId),
    workshopItemStore.byWorkshop(workshopId),
    productStore.fetch()
])

const workshop = ref(tasks[0])
const items = tasks[1]
const products = productStore.getMany(items.map(item => item.productId))
const amountOfPeople = ref(0)

async function save () {
    const { id, ...data } = workshop.value
    await workshopStore.update(data, id)
}

async function saveItem (item) {
    const { id, ...data } = item
    await workshopItemStore.update(data, id)
}

async function saveProduct (product) {
    const { id, ...data } = product
    await productStore.update(data, id)
}

function removeAllProducts () {
    for (let i = 0; i < products.length; i++) {
      if (!products[i].reusable) {
        products[i].stock -= Math.round(amountOfPeople.value / (items[i].people / items[i].quantity))
        console.log(Math.round(amountOfPeople.value / (items[i].people / items[i].quantity)))
        if (products[i].stock < 0) {
          products[i].stock = 0
          showPopup.value = false
          throw Error(products[i].name + ' heeft niet genoeg voorraad')
        }
        saveProduct(products[i])
      }
    }
    showPopup.value = false
}
</script>

<template>
  <div class="row box-header">
    <div class="d-flex align-items-center m-0" style="width: min-content">
      <a class="btn p-2 bg-secondary hover-darken" @click="$router.back()">
        <font-awesome-icon :icon="['fas', 'caret-left']" class="fa-xl" style="width: 24px" />
      </a>
    </div>

    <div class="col d-flex align-items-center">
      <h3 class="m-0">Workshop Info</h3>
    </div>
  </div>

  <div class="row box bg-white border-top">
    <text-input name="Naam" v-model:value="workshop.name" @update:value="save" />
    <number-input name="Standaard Groepsgrootte" v-model:value="workshop.defaultGroupSize" @update:value="save" />
  </div>

  <!-- products -->
  <div class="row box-header">
    <div class="col-2 d-flex align-items-center">
      <h3 class="m-2">Producten</h3>
    </div>

    <div class="col-10 d-flex align-items-center justify-content-end">
      <!-- action buttons -->
      <div type="button" class="btn p-3 hover-darken" @click="showPopup = !showPopup" title="Verminder stock alle producten">
        <font-awesome-icon :icon="['fas', 'boxes-packing']" class="fa-xl"/>
      </div>
      <router-link class="btn p-3 hover-darken" :to="`/products/new?workshopId=${workshop.id}`" title="Nieuw product">
        <font-awesome-icon :icon="['fas', 'plus']" class="fa-xl"/>
      </router-link>
      <router-link class="btn p-3 hover-darken" :to="`/workshops/${workshop.id}/items`" title="Producten Beheren">
        <font-awesome-icon :icon="['fas', 'pen-to-square']" class="fa-xl"/>
      </router-link>
    </div>
  </div>

  <!-- conformation pop up -->
  <div v-if="showPopup" class="conformation-popup">
    <h2>Hoeveel personen?</h2>
    <number-input name="Aantal mensen" v-model:value="amountOfPeople" class="mb-3"/>
    <div type="button" class="btn btn-danger me-4" @click="showPopup = false">Annuleren</div>
    <div type="button" class="btn btn-primary ms-4" @click="removeAllProducts" style="color: white">Accepteren</div>
  </div>

  <!-- workshop items list -->
  <workshop-item-block v-for="item in items"
                       class="row box bg-white border-top"
                       :key="item.id"
                       :product="products.find(p => p.id === item.productId)"
                       :workshop-item="item"
                       @update:workshopItem="saveItem" />

  <div v-if="!items.length" class="box bg-white d-flex align-items-center justify-content-center border-bottom">
    <span class="h6 m-4">Geen producten gevonden</span>
  </div>
</template>
