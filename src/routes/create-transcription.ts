import { FastifyInstance } from "fastify";
import { z } from "zod"

import { createReadStream } from "node:fs"
import { prisma } from "../lib/prisma";
import { openai } from "../lib/openai";

export async function createTranscriptionRoute(app: FastifyInstance) {
    app.post("/videos/:videoId/transcription", async (req) => {
        const paramsSchema = z.object({
            videoId: z.string().uuid(),

        })

        const { videoId } = paramsSchema.parse(req.params)
        console.log(videoId)

        const bodySchema = z.object({
            prompt: z.string()
        })

        const { prompt } = bodySchema.parse(req.body)
        console.log(prompt)

        const video = await prisma.video.findUniqueOrThrow({
            where: {
                id: videoId,
            }
        })

        const videoPath = video.path
        console.log(videoPath)

        const audioReadStream = createReadStream(videoPath)
        console.log(audioReadStream)

        const response = await openai.audio.transcriptions.create({
            file: audioReadStream,
            model: 'whisper-1',
            language: 'pt',
            response_format: 'json',
            temperature: 0,
            prompt,
        })

        const transcription = response.text
        console.log(transcription)

        await prisma.video.update({
            where: {
                id: videoId,
            },
            data: {
                transcription,
            }
        })
    
        return transcription
    })
} 