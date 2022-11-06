import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.create({
        data: {
            name: 'Samuel Doe',
            email: 'samuel.doe@exmaple.com',
            avatarUrl: 'https://github.com/samuelikz.png',
        },
    })

    const pool = await prisma.pool.create({
        data: {
            title : 'Pool 1',
            code : 'BOL123456',
            ownerId : user.id,

            Participants : {
                create : {
                    userId : user.id,
                }
            }
        },
    })

    await prisma.game.create({
        data: {
            date: '2022-11-04T23:54:31.923Z',
            fistTeamCountryCode: 'DE',
            secondTeamCountryCode: 'FR',
        }
    })

    await prisma.game.create({
        data: {
            date: '2022-11-04T23:54:31.923Z',
            fistTeamCountryCode: 'BR',
            secondTeamCountryCode: 'AR',

            guesses : {
                create : {
                    firstTeamPoints : 2,
                    secondTeamPoints : 1,
                    participant: {
                        connect : {
                            userId_poolId : {
                                userId : user.id,
                                poolId : pool.id
                            }
                        }
                    }
                }
            }
        }
    })
}

main()
