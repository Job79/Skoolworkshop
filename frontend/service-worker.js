self.addEventListener('push', function (event) {
    let data = {}

    if (event.data) {
        data = event.data.json()
    }

    const options = {
        body: data.body || 'This is a message body',
        icon: 'public/favicon-32x32.png',
        badge: 'public/favicon-32x32.png'
    }

    event.waitUntil(
        self.registration.showNotification(data.title || 'Push Notification Title', options)
    )
})
