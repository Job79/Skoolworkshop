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
        default: null
    },
    startOpen: {
        type: Boolean,
        default: false
    }
})

// create a copy of the value prop to be able to edit it
// without directly changing the prop
const value = ref(props.value)
watch(() => props.value, (newValue) => {
    value.value = newValue
})

const edit = ref(props.startOpen)

function isValidUrl (string) {
    try {
        const url = new URL(string)
        return url.protocol === 'http:' || url.protocol === 'https:'
    } catch {
        return false
    }
}

function update () {
    if (!edit.value) {
        edit.value = true
        return
    }

    if (!value.value) value.value = props.value
    if (!value.value) return

    if (!isValidUrl(value.value)) {
        throw new Error('ShopUrl is not a valid URL')
    }

    emit('update:value', value.value)
    edit.value = false
}

function focusOut () {
    setTimeout(() => {
        if (edit.value) update()
    }, 100)
}
</script>

<template>
  <div class="d-flex align-items-center p-2 border-bottom">
    <span class="mx-3">{{ name }}</span>

    <div class="ms-auto d-flex align-items-center">
      <div v-if="!edit" >
        <a v-if="value" :href="value" target="_blank" class="d-flex align-items-center" style="max-width: 10rem">
          <span class="text-truncate">{{ value }}</span>
          <font-awesome-icon :icon="['fas', 'external-link-alt']" class="p-1"/>
        </a>
      </div>
      <input v-else type="text" class="form-control" v-model="value" @keydown.enter="update" @blur="focusOut" autofocus/>
      <div role="button" @click="update" class="user-select-none">
        <font-awesome-icon
            :icon="['fas', 'pen']"
            class="p-3 mx-2 rounded-3 hover-darken"
            :class="{'bg-secondary': edit}"/>
      </div>
    </div>
  </div>
</template>
