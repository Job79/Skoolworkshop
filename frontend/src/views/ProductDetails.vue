<script setup>
import { ref, computed } from 'vue'
import { useProductStore } from '../store/productStore.js'
import { useWorkshopStore } from '../store/workshopStore.js'
import { useRoute } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import TextInput from '../component/input/TextInput.vue'
import CheckboxInput from '../component/input/CheckboxInput.vue'
import ScanInput from '../component/input/ScanInput.vue'
import NumberInput from '../component/input/NumberInput.vue'
import UrlInput from '../component/input/UrlInput.vue'
import WorkshopBlock from '../component/workshop/WorkshopBlock.vue'
import { useWorkshopItemStore } from '../store/workshopItemStore.js'
import CalendarItemBlock from '../component/calendar/CalendarItemBlock.vue'
import { useCalendarStore } from '../store/calendarStore.js'
import ProductBlock from '../component/product/ProductBlock.vue'

const route = useRoute()
const productStore = useProductStore()
const workshopStore = useWorkshopStore()
const workshopItemStore = useWorkshopItemStore()
const calendarStore = useCalendarStore()

const productId = Number(route.params.id)

const tasks = await Promise.all([
    productStore.get(productId),
    workshopItemStore.byProduct(productId),
    calendarStore.byProduct(productId),
    calendarStore.fetchRequiredStock(),
    workshopStore.fetch()
])

const product = ref(tasks[0])
const workshopItems = ref(tasks[1])
const calendar = ref(tasks[2])
const requiredStock = computed(() => calendarStore.requiredStock[productId]?.quantity ?? 0)
const workshops = computed(() => workshopStore.workshops)
const tab = ref('Planning')

async function save () {
    const { id, ...data } = product.value
    await productStore.update(data, id)
}

function requiredProductAmount (calendarItem) {
    const workshopItem = workshopItems.value.find(item => item.workshopId === calendarItem.workshopId)
    return Math.ceil(calendarItem.participantCount / workshopItem.people) * workshopItem.quantity
}
</script>

<template>
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
      <router-link class="d-flex align-items-center user-select-none"
                   :to='`/products/${productId}/edit-stock`'>
        <font-awesome-icon
            :icon="['fas', 'layer-group']"
            class="p-3 rounded-3 hover-darken"/>
      </router-link>
    </number-input>

    <number-input name="Buffer Voorraad" v-model:value="product.bufferStock" @update:value="save" :border="true"/>
    <checkbox-input name="Herbruikbaar" v-model:value="product.reusable" @update:value="[save(), calendarStore.fetchRequiredStock()]"/>
    <scan-input v-model:value="product.code" @update:value="save"/>
  </div>

  <!-- product usage -->
  <div class="row box-header">
    <div class="col-4 d-flex align-items-center">
      <h3 class="m-2">{{ tab }}</h3>
    </div>

    <div class="col-8 d-flex align-items-center justify-content-end">
      <!-- action buttons -->
      <button class="btn p-3 hover-darken" :class="{'bg-secondary': tab === 'Planning'}" @click="tab = 'Planning'" title="Planning">
        <font-awesome-icon :icon="['fas', 'calendar-day']" class="fa-xl"/>
      </button>
      <button class="btn p-3 ms-1 hover-darken" :class="{'bg-secondary': tab === 'Workshops'}" @click="tab = 'Workshops'" title="Workshops">
        <font-awesome-icon :icon="['fas', 'people-group']" class="fa-xl"/>
      </button>
    </div>
  </div>

  <div v-if="tab === 'Workshops'" class="row box bg-white border-top">
    <workshop-block v-for="item in workshopItems"
                    :key="item.workshopId"
                    :workshop="workshops.find((w) => w.id === item.workshopId)">

      <div class="m-3">
        <font-awesome-icon :icon="['fas', 'repeat']" class="fa-xl me-3"/>
        <span>{{ calendar.filter((c) => c.workshopId === item.workshopId)?.length ?? 0 }}</span>
      </div>
    </workshop-block>
  </div>
  <div v-if="tab === 'Planning'" class="row box bg-white border-top">
    <product-block :product="{...product, name: 'Totaal'}" :required-stock="requiredStock" class="border-3" />
    <calendar-item-block
        v-for="item in calendar"
        :key="item.id"
        :workshop="workshops.find((w) => w.id === item.workshopId)"
        :item="item"
        :product-amount="requiredProductAmount(item)" />
  </div>
</template>
