import Fastify from 'fastify'
import cors from '@fastify/cors'
import { PrismaClient } from '@prisma/client'
import {z} from 'zod'
import ShortUniqueID from 'short-unique-id'

async function bootstrap(){
    const prisma = new PrismaClient({
        log: ['query'],
    })

    const fastify = Fastify({
        logger: true
    })

    await fastify.register(cors, {
        origin: true,
    })

    fastify.get('/pools/count', async (request, reply) => {
        const count = await prisma.pool.count()
        return { count }
    })

    fastify.get('/users/count', async (request, reply) => {
        const count = await prisma.user.count()
        return { count }
    })

    fastify.get('/guesses/count', async (request, reply) => {
        const count = await prisma.guess.count()
        return { count }
    })

    fastify.post('/pools', async (request, reply) => {
        const createPoolBody = z.object({
            title: z.string(),
        })

        const { title } = createPoolBody.parse(request.body)
        const generate = new ShortUniqueID({length: 6})
        const code = String(generate()).toUpperCase()
        
        await prisma.pool.create({
            data: {
                title,
                code: generate(),
            },
        })
        return reply.status(201).send({code})
    })

    await fastify.listen({  port:3333 })
}

bootstrap()
