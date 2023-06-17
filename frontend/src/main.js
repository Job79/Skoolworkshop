import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router/router.js'
import './style/styles.scss'
import './icons.js'
import './service/axios.js'

// create and mount Vue application
const app = createApp(App)
app.use(router)
app.use(createPinia())
app.mount('#app')

if ('serviceWorker' in navigator && 'PushManager' in window) {
    registerServiceWorker()
    askPermission().then(subscribeUserToPush)
}

function urlBase64ToUint8Array (base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}

function registerServiceWorker () {
    return navigator.serviceWorker
        .register('/service-worker.js')
        .then(registration => {
            console.log('Service worker successfully registered.', registration)
        })
        .catch(err => {
            console.error('Unable to register service worker.', err)
        })
}

function askPermission () {
    return new Promise(function (resolve, reject) {
        const permissionResult = Notification.requestPermission(function (result) {
            resolve(result)
        })

        if (permissionResult) {
            permissionResult.then(resolve, reject)
        }
    })
        .then(function (permissionResult) {
            if (permissionResult !== 'granted') {
                throw new Error("We weren't granted permission.")
            }
        })
}

function subscribeUserToPush () {
    return navigator.serviceWorker
        .register('/service-worker.js')
        .then(function (registration) {
            const subscribeOptions = {
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(
                    'BPAm8av-4R6wngbi4_9ahOI8bEtKCFq6iBY-dc5l5G23Z4DNd5GxMiOUvBt3BUf-lWsD2z2SWW4QdMOM32jrdqc'
                )
            }

            return registration.pushManager.subscribe(subscribeOptions)
        })
        .then(function (pushSubscription) {
            console.log(
                'Received PushSubscription: ',
                JSON.stringify(pushSubscription)
            )
            return sendSubscriptionToBackEnd(pushSubscription)
        })
}

function sendSubscriptionToBackEnd (subscription) {
    return fetch('/api/save-subscription/', {
        method: 'POST',
        headers: {  
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
    })
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Bad status code from server.')
            }

            return response.json()
        })
        .then(function (responseData) {
            if (!(responseData.data && responseData.data.success)) {
                throw new Error('Bad response from server.')
            }
        })

}
