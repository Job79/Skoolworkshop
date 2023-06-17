<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const emit = defineEmits(['close'])
const props = defineProps({
    shown: {
        type: Boolean,
        required: true
    },
    message: {
        type: String,
        required: true
    }
})
</script>

<template>
  <div class="fixed-top m-3 d-flex justify-content-center" v-if="props.shown">
    <div class="d-flex align-items-center bg-red p-1 rounded-5 text-white" style="width: 100%; max-width: 40rem">
      <strong class="ms-3">Error!</strong>
      <span class="ms-1">{{ props.message }}</span>
      <button class="btn ms-auto text-white" @click="emit('close')">
        <font-awesome-icon :icon="['fas', 'x']" />
      </button>
    </div>
  </div>
</template>
