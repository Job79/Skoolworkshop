<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useCalendarStore } from '../../store/calendarStore.js'
import { computed } from 'vue'

const props = defineProps({
    item: {
        type: Object,
        required: true
    },
    workshop: {
        type: Object,
        required: true
    },
    productAmount: {
        type: Number,
        required: false
    }
})

const calendarStore = useCalendarStore()
const startDate = new Date(props.item.startDate)
const endDate = new Date(props.item.endDate)

const pad = (num) => String(num).padStart(2, '0')
const dateStr = computed(() => `${pad(startDate.getDate())}-${pad(startDate.getMonth() + 1)}`)
const timeStr = computed(() => `${pad(startDate.getHours())}:${pad(startDate.getMinutes())} - ${pad(endDate.getHours())}:${pad(endDate.getMinutes())}`)
</script>

<template>
  <router-link class="d-flex align-items-center border-bottom hover-darken"
               :class="{'bg-tint-secondary': endDate < calendarStore.startDate || endDate > calendarStore.endDate}"
               :to="`/workshops/${workshop.id}`">

    <!-- image and title -->
    <font-awesome-icon :icon="['fas', 'people-robbery']" class="fa-3x img border p-3 ms-1 me-3 my-3"
                       style="width: 3rem; height: 3rem"/>
    <span class="h5 w-50"> {{ props.workshop.name }} </span>

    <div class="ms-auto p-2" style="width: 12rem" @click.prevent>
      <div v-if="productAmount" class="ms-auto d-flex align-items-center">
        <font-awesome-icon :icon="['fas', 'box']" class="fa-1x" style="width: 2rem"/>
        <span>{{ productAmount }}</span>
      </div>

      <div class="ms-auto d-flex align-items-center">
        <font-awesome-icon :icon="['fas', 'people-group']" class="fa-1x" style="width: 2rem"/>
        <span>
          {{ props.item.participantCount }}
        </span>
      </div>

      <div class="ms-auto d-flex align-items-center"
           :class="{'text-danger': endDate < calendarStore.startDate, 'text-primary': endDate > calendarStore.endDate}">
        <font-awesome-icon :icon="['fas', 'calendar-day']" class="fa-1x" style="width: 2rem"/>
        <div class="d-flex flex-wrap">
          <span class="me-2">{{ dateStr }}</span>
          <span>{{ timeStr }}</span>
        </div>
      </div>
    </div>
  </router-link>
</template>
