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
        type: Boolean,
        default: false
    }
})

const checked = ref(props.value)
watch(() => props.value, (newValue) => {
    checked.value = newValue
})

function update () {
    checked.value = !checked.value
    emit('update:value', checked.value)
}
</script>

<template>
  <div class="d-flex align-items-center px-2 py-1 border-bottom">
    <span class="mx-3">{{ name }}</span>

    <div class="ms-auto d-flex align-items-center">
      <button @click="update" class="btn btn-sm border-0" title="herbruikbaar toggle">
        <font-awesome-icon
            :icon="checked ? ['fas', 'toggle-on'] : ['fas', 'toggle-off']"
            class="fa-2x p-2 rounded-3" />
      </button>
    </div>
  </div>
</template>
