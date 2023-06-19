<script setup>
import { useUserStore } from '../store/userStore.js'
import UserBlock from '../component/user/UserBlock.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { ref, computed } from 'vue'

const edit = ref(false)
const userStore = useUserStore()
userStore.fetch()

const search = ref('')
const filteredUsers = computed(() => userStore.search(search.value))

async function remove (user) {
    await userStore.delete(user.id)
}
</script>

<template>
  <div class="row box-header">
    <div class="d-flex d-sm-none align-items-center p-0" style="width: min-content">
      <img src="../assets/logo.png" alt="logo" class="py-3 ps-4" style="height: 4rem" />
    </div>

    <div class="col d-flex align-items-center">
      <h3 class="m-2">Gebruikers</h3>
    </div>

    <div class="col d-flex align-items-center justify-content-end">
      <!-- action buttons -->
      <router-link class="btn p-3 hover-darken" to="/users/new">
        <font-awesome-icon :icon="['fas', 'plus']" class="fa-xl"/>
      </router-link>

      <button class="btn p-3 hover-darken" :class="{'bg-primary': edit}" @click="edit = !edit" title="Gebruikers Aanpassen">
        <font-awesome-icon :icon="['fas', 'pen-to-square']" class="fa-xl"/>
      </button>
    </div>
  </div>

  <div class="row box bg-white border-top">
    <input type="text" v-model="search" placeholder="Zoek gebruikers..." class="form-control search p-4">

    <!-- user list -->
    <user-block
        v-for="user in filteredUsers"
        :key="user.id"
        :user="user"
        :edit="edit"
        @delete="remove"/>
  </div>
</template>
