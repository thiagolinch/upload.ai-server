import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

import { randomUUID } from "node:crypto"
import fs from "node:fs"
import { pipeline } from "node:stream";
import { promisify } from "node:util";

import { fastifyMultipart } from "@fastify/multipart"
import path from "path";

const pump = promisify(pipeline)


export async function uploadVideoRoute(app: FastifyInstance) {
    app.register(fastifyMultipart, {
        limits: {
            fieldSize: 1048576 * 35, //35mb
        }
    })
    app.post("/videos", async (req, res) => {
        const data = await req.file()

        if(!data) {
            return res.status(400).send({error: "No data"})
        }

        const extencion = path.extname(data.filename)

        if(extencion != '.mp3') {
            return res.status(400).send({error: "Ivalid input type!"})
        }

        const fileBasename = path.basename(data.filename, extencion)
        const fileUploadName = `${fileBasename}-${randomUUID()}${extencion}`
        const uploadDestination = path.resolve(__dirname, '../../tmp', fileUploadName)

        await pump(data.file, fs.createWriteStream(uploadDestination))
        console.log(uploadDestination)
        const video = await prisma.video.create({
            data: {
                name: data.filename,
                path: uploadDestination
            }
        })

        return {
            video,
        }
    })
} 