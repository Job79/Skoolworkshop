<script setup>
import { watch, ref } from 'vue'
import { useProductStore } from '../store/productStore.js'
import { useWorkshopStore } from '../store/workshopStore.js'
import { useCalendarStore } from '../store/calendarStore.js'
import { useRoute } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import TextInput from '../component/input/TextInput.vue'
import CheckboxInput from '../component/input/CheckboxInput.vue'
import ScanInput from '../component/input/ScanInput.vue'
import NumberInput from '../component/input/NumberInput.vue'
import UrlInput from '../component/input/UrlInput.vue'
import WorkshopBlock from "../component/workshop/WorkshopBlock.vue";

const route = useRoute()
const productStore = useProductStore()
const calendarStore = useCalendarStore()
const workshopStore = useWorkshopStore()

const productId = Number(route.params.id)
const workshopsInCalendar = ref([])

const product = ref(null)

const load = async () => {
    product.value = await productStore.get(productId)
    const workshops = await productStore.getWorkshops(productId)

    if (workshops.length > 0) {
        workshopsInCalendar.value = await Promise.all(workshops.map(async workshop => {
            const workshopDetail = await workshopStore.get(workshop.workshopId)
            return { ...workshop, ...workshopDetail }
        }))

        watch(() => calendarStore.calendarItems, async (newVal) => {
            workshopsInCalendar.value = await Promise.all(newVal.map(async event => {
                const workshop = workshops.find(w => w.workshopId === event.workshopId)
                if (workshop) {
                    const workshopDetail = await workshopStore.get(workshop.workshopId)
                    return { ...workshop, ...workshopDetail }
                }
                return null
            })).then(res => res.filter(item => item)) // filter out null values
        }, { immediate: true })
    }

    await calendarStore.fetch()
}

load()

async function save () {
    const { id, ...data } = product.value
    await productStore.update(data, id)
}
</script>

<template>
      <div v-if="product">
  <div class="row box-header">
    <div class="d-flex align-items-center m-0" style="width: min-content">
      <a class="btn p-2 bg-secondary hover-darken" @click="$router.back()">
        <font-awesome-icon :icon="['fas', 'caret-left']" class="fa-xl" style="width: 24px"/>
      </a>
    </div>

    <div class="col d-flex align-items-center">
      <h3 class="m-0">Product Info</h3>
    </div>
  </div>

  <div class="row box bg-white border-top">
    <text-input name="Naam" v-model:value="product.name" @update:value="save"/>
    <url-input name="Winkel Url" v-model:value="product.shopUrl" @update:value="save"/>
    <number-input name="Voorraad" v-model:value="product.stock" @update:value="save">
      <router-link class="d-flex align-items-center user-select-none" role="button" :to='`/products/${productId}/edit-stock`'>
        <font-awesome-icon
            :icon="['fas', 'layer-group']"
            class="p-3 rounded-3 hover-darken"/>
      </router-link>
    </number-input>

    <number-input name="Buffer Voorraad" v-model:value="product.bufferStock" @update:value="save" :border="true" />
    <checkbox-input name="Herbruikbaar" v-model:value="product.reusable" @update:value="save"/>

    <scan-input v-model:value="product.code" @update:value="save"/>
  </div>
  <div class="row box bg-white border-top">
    <workshop-block v-for="workshop in workshopsInCalendar" :workshop="workshop" :key="workshopId"/>
  </div>
</div>
</template>
