<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { ref, watch } from 'vue'
import NumberInput from '../input/NumberInput.vue'

const emit = defineEmits(['update:workshopItem'])
const props = defineProps({
    workshopItem: {
        type: Object,
        required: true
    },
    product: {
        type: Object,
        required: true
    }
})

const workshopItem = ref({ ...props.workshopItem })
watch(() => props.workshopItem, (newValue) => {
    workshopItem.value = { ...newValue }
})

function update () {
    if (!workshopItem.value.people || !workshopItem.value.quantity) {
        return
    }

    emit('update:workshopItem', workshopItem.value)
}
</script>

<template>
    <router-link :to="`/products/${product.id}`" class="d-flex flex-column border-bottom">
      <!-- image and title -->
      <div class="d-flex align-items-center">
        <font-awesome-icon :icon="['fas', 'box']" class="fa-3x img border p-3 ms-1 me-3 my-3" />
        <span class="h5"> {{ props.product.name }} </span>
      </div>

      <div class="bg-white border-top p-0" @click.prevent>
        <number-input name="Voor dit aantal personen" v-model:value="workshopItem.people" @update:value="update" />
        <number-input name="Zijn zoveel producten nodig" v-model:value="workshopItem.quantity" @update:value="update" />
      </div>
    </router-link>
</template>
