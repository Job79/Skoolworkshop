<script setup>
import { useWorkshopStore } from '../store/workshopStore.js'
import WorkshopBlock from '../component/workshop/WorkshopBlock.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { ref, computed } from 'vue'

const edit = ref(false)
const workshopStore = useWorkshopStore()
await workshopStore.fetch()

const search = ref('')
const filteredWorkshops = computed(() => workshopStore.search(search.value))

async function remove (workshop) {
    await workshopStore.delete(workshop.id)
}
</script>

<template>
  <div class="row box-header">
    <div class="d-flex d-sm-none align-items-center p-0" style="width: min-content">
      <img src="../assets/logo.png" alt="logo" class="py-3 ps-4" style="height: 4rem" />
    </div>

    <div class="col d-flex align-items-center">
      <h3 class="m-2">Workshops</h3>
    </div>

    <div class="col d-flex align-items-center justify-content-end">
      <!-- action buttons -->
      <router-link class="btn p-3 hover-darken" to="/workshops/new">
        <font-awesome-icon :icon="['fas', 'plus']" class="fa-xl"/>
      </router-link>

      <button class="btn p-3 hover-darken" :class="{ 'bg-primary': edit }" @click="edit = !edit" title="Workshops Aanpassen">
        <font-awesome-icon :icon="['fas', 'pen-to-square']" class="fa-xl"/>
      </button>
    </div>
  </div>

  <div class="row box bg-white border-top">
    <!-- workshop list -->
    <div class="p-0 input-group align-items-end">
      <input type="text" v-model="search" placeholder="Zoek workshops..." class="form-control search p-4">
    </div>

    <workshop-block v-for="workshop in filteredWorkshops"
                  :key="workshop.id"
                  :workshop="workshop"
                  :edit="edit"
                  @delete="remove" />

    <div v-if="!filteredWorkshops.length" class="d-flex align-items-center justify-content-center border-bottom">
      <span class="h6 m-4">Geen workshops gevonden</span>
    </div>
  </div>
</template>
