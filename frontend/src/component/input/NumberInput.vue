<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { ref, watch } from 'vue'

const emit = defineEmits(['update:value'])
const props = defineProps({
    name: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        default: 1
    }
})

const value = ref(props.value)
watch(() => props.value, (newValue) => {
    value.value = newValue
})

function update () {
    if (!value.value && value.value !== 0) {
        return
    }

    emit('update:value', value.value)
}
</script>

<template>
  <div class="d-flex align-items-center px-2 py-1 border-bottom">
    <span class="mx-3">{{ name }}</span>

    <div class="ms-auto d-flex align-items-center">
      <slot>
        <!-- slot for additional buttons -->
      </slot>

      <button @click="value = Math.max(value - 1, 0); update()" class="btn btn-sm border-0" title="voorraad - 1">
        <font-awesome-icon
          :icon="['fas', 'minus']"
          class="p-3 rounded-3 hover-darken"/>
      </button>

      <input type="number" class="form-control-plaintext text-center" style="width: 2rem" v-model="value" @input="update" />

      <button @click="value += 1; update()" class="btn btn-sm border-0" title="voorraad + 1">
        <font-awesome-icon
          :icon="['fas', 'plus']"
          class="p-3 rounded-3 hover-darken"/>
      </button>
    </div>
  </div>
</template>
