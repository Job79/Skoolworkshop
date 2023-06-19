<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import CalendarItemBlock from '../component/calendar/CalendarItemBlock.vue'
import { useCalendarStore } from '../store/calendarStore.js'
import { useWorkshopStore } from '../store/workshopStore.js'

const calendarStore = useCalendarStore()
const workshopStore = useWorkshopStore()

await Promise.all([
    calendarStore.fetch(),
    workshopStore.fetch()
])

const workshops = workshopStore.workshops
</script>

<template>
  <div class="row box-header">
    <div class="d-flex d-sm-none align-items-center p-0" style="width: min-content">
      <img src="../assets/logo.png" alt="logo" class="py-3 ps-4" style="height: 4rem" />
    </div>

    <div class="col d-flex align-items-center">
      <h3 class="m-2">Kalender</h3>
    </div>

    <div class="col d-flex align-items-center justify-content-end">
      <!-- action buttons -->
      <button class="btn p-3 hover-darken" @click="calendarStore.refresh()" title="Verversen">
        <font-awesome-icon :icon="['fas', 'arrows-rotate']" class="fa-xl" />
      </button>
    </div>
  </div>

  <div class="row box bg-white border-top">

    <!-- calendar items -->
    <calendar-item-block
        v-for="item in calendarStore.calendarItems"
        :key="item.id"
        :item="item"
        :workshop="workshops.find(w => w.id === item.workshopId)" />

    <div v-if="!calendarStore.calendarItems.length" class="d-flex align-items-center justify-content-center border-bottom">
      <span class="h6 m-4">Kalender is leeg</span>
    </div>
  </div>
</template>
