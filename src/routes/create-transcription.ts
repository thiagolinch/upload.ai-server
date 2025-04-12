import fs from 'node:fs';
import path from 'node:path';
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
        
        // certifique-se de que o caminho é válido
        if (!fs.existsSync(videoPath)) {
            throw new Error('Arquivo de áudio não encontrado.');
        }

        const audioReadStream = createReadStream(videoPath)

        const audioFile = {
            name: path.basename(videoPath),
            type: 'audio/mpeg', // ou 'audio/wav' dependendo do tipo
            data: audioReadStream
        };

        try {
            console.log("Enviando para OpenAI...", videoPath);
        
            const response = await openai.audio.transcriptions.create({
                file: audioFile as any,
                model: 'whisper-1',
                language: 'pt',
                response_format: 'json',
                temperature: 0,
                prompt,
            });
        
            console.log("Transcrição recebida:", response.text);
        
            const transcription = response.text;
        
            await prisma.video.update({
                where: { id: videoId },
                data: { transcription },
            });
        
            return transcription;
        } catch (error) {
            console.error("Erro ao transcrever:", error);
            throw new Error("Falha ao transcrever o áudio.");
        }
        
    })
} 