const app = new Vue({
    el: '#app',
    data: {
        url: '',
        alias: '',
        created: null
    },
    methods: {
        async createUrl() {
            const response = await fetch('/', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    url: this.url,
                    alias: this.alias
                })
            })
            this.created = await response.json();
        }
    }
})