import { fastify } from 'fastify'

const app = fastify()

app.get("/", () => {
    console.log("Hello world")
})

app.listen({
    port: 5432,
}).then(() => {
    console.log("HTTP server running")
})