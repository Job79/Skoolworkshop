<script setup>
import { ref, watch } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const emit = defineEmits(['update:value'])
const props = defineProps({
    name: {
        type: String,
        required: true
    },
    value: {
        type: String,
        default: ''
    }
})

const value = ref(props.value)
const edit = ref(value.value === '')
watch(() => props.value, (newValue) => {
    value.value = newValue
})

function update () {
    if (!edit.value) {
        edit.value = true
        return
    }

    if (!value.value) value.value = props.value
    if (value.value) {
        emit('update:value', value.value)
        edit.value = false
    }
}

function focusOut () {
    setTimeout(() => {
        if (edit.value) update()
    }, 100)
}
</script>

<template>
  <div class="d-flex align-items-center px-2 py-1 border-bottom">
    <span class="mx-3">{{ name }}</span>

    <div class="ms-auto d-flex align-items-center">
      <span v-if="!edit">{{ value }}</span>
      <input v-else type="text" class="form-control" v-model="value" @keydown.enter="update" @blur="focusOut" autofocus/>
      <button @click="update" class="btn btn-sm border-0" title="aanpassen">
        <font-awesome-icon
            :icon="['fas', 'pen']"
            class="p-3 rounded-3 hover-darken"
            :class="{'bg-secondary': edit}"/>
      </button>
    </div>
  </div>
</template>
