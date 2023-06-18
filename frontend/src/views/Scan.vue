<script setup>
import { useProductStore } from '../store/productStore.js'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { StreamBarcodeReader } from 'vue-barcode-reader'
import router from '../router/router.js'
import { useRoute } from 'vue-router'

const productStore = useProductStore()
productStore.fetch()

const route = useRoute()
const action = route.params.action

function onDecode (result) {
    const product = productStore.findCode(result)
    if (!product) {
        throw Error('unknown product')
    }

    if (action === 'redirect') {
        router.push(`/products/${product.id}`)
    } else {
        router.push(`/products/${product.id}`)
    }
}
</script>

<template>
  <div class="row box-header">
    <div class="col d-flex align-items-center">
      <h3 class="m-0">Scan A QR / Barcode</h3>
    </div>

    <div class="col-4 d-flex align-items-center justify-content-end">
      <a class="btn p-2 bg-secondary hover-darken" @click="$router.back()">
        <font-awesome-icon :icon="['fas', 'x']" class="fa-1x" style="width: 24px"/>
      </a>
    </div>
  </div>

  <div class="d-flex justify-content-center">
    <div class="d-flex justify-content-center rounded-4 overflow-hidden">
      <stream-barcode-reader @decode="onDecode" class="p-0 m-0"/>
    </div>
  </div>

</template>
