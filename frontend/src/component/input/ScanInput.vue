<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { StreamBarcodeReader } from 'vue-barcode-reader'
import { ref } from 'vue'
import { useProductStore } from '../../store/productStore.js'
import VueQrcode from "vue-qrcode";

const emit = defineEmits(['update:value'])
const props = defineProps({
    value: {
        type: String,
        required: false
    }
})

const productStore = useProductStore()
const showScanner = ref(false)

function onDecode (result) {
    emit('update:value', result)
    showScanner.value = false
}

function generateCode () {
    const code = Math.floor(Math.random() * 1000000)
    if (productStore.findCode(code)) {
        generateCode()
    } else {
        emit('update:value', code.toString())
    }
}

function printQr () {
  const prtContent = document.getElementById('qrCode')
  const winPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0')
  winPrint.document.write(prtContent.innerHTML)
  winPrint.document.close()
  winPrint.focus()
  winPrint.print()
  winPrint.close()
}
</script>

<template>
  <div type="button" class="d-flex align-items-center p-2 border-bottom">
    <span class="mx-3">QR/Bar Code</span>

    <div class="ms-auto d-flex align-items-center">
      <div class="d-flex align-items-center user-select-none" role="button" @click="showScanner = !showScanner">
        <font-awesome-icon
          :icon="['fas', 'qrcode']"
          class="p-3 mx-1 rounded-3 hover-darken"/>
      </div>

      <div v-if="!value" class="d-flex align-items-center user-select-none" role="button" @click="generateCode">
        <font-awesome-icon
          :icon="['fas', 'shuffle']"
          class="p-3 mx-1 rounded-3 hover-darken"/>
      </div>
      <div v-else class="d-flex align-items-center user-select-none" role="button" @click="printQr">
        <font-awesome-icon
            :icon="['fas', 'print']"
            class="p-3 mx-1 rounded-3 hover-darken"/>
      </div>
    </div>
  </div>

  <div v-if="showScanner" class="p-0">
        <div class=" w-100">
          <stream-barcode-reader @decode="onDecode"/>
        </div>
  </div>

  <div id="qrCode" style="display: none">
    <vue-qrcode
        v-if="props.value"
        :value="props.value"
        type="image/png"
        :width="250"
        :color="{dark: '#000000', light: '#ffffff'}"
    />
  </div>
</template>
