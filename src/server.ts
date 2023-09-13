import { fastify } from 'fastify'
import { prisma } from './lib/prisma'
import { getAllPromtpsRoute } from './routes/get-all-prompts'
import { uploadVideoRoute } from './routes/upload-video'
import { createTranscriptionRoute } from './routes/create-transcription'

const app = fastify()

app.register(getAllPromtpsRoute)
app.register(uploadVideoRoute)
app.register(createTranscriptionRoute)

app.listen({
    port: 5432,
}).then(() => {
    console.log("HTTP server running")
})