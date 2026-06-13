const { PrismaClient, UserRole } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 12)
  const userPasswordHash = await bcrypt.hash('usuario123', 12)

  const admin = await prisma.user.upsert({
    where: { login: 'admin' },
    update: {},
    create: {
      name: 'Administrador',
      login: 'admin',
      passwordHash,
      role: UserRole.ADMIN,
    },
  })

  const users = await Promise.all([
    prisma.user.upsert({
      where: { login: 'ana' },
      update: {},
      create: {
        name: 'Ana Silva',
        login: 'ana',
        passwordHash: userPasswordHash,
        role: UserRole.USUARIO,
      },
    }),
    prisma.user.upsert({
      where: { login: 'bruno' },
      update: {},
      create: {
        name: 'Bruno Costa',
        login: 'bruno',
        passwordHash: userPasswordHash,
        role: UserRole.USUARIO,
      },
    }),
    prisma.user.upsert({
      where: { login: 'carla' },
      update: {},
      create: {
        name: 'Carla Souza',
        login: 'carla',
        passwordHash: userPasswordHash,
        role: UserRole.USUARIO,
      },
    }),
  ])

  const brazil = await prisma.team.upsert({
    where: { id: 1 },
    update: {},
    create: { name: 'Brasil' },
  })

  const argentina = await prisma.team.upsert({
    where: { id: 2 },
    update: {},
    create: { name: 'Argentina' },
  })

  const france = await prisma.team.upsert({
    where: { id: 3 },
    update: {},
    create: { name: 'França' },
  })

  const players = await Promise.all([
    prisma.player.upsert({
      where: { id: 1 },
      update: {},
      create: { name: 'Vinicius Jr.', teamId: brazil.id },
    }),
    prisma.player.upsert({
      where: { id: 2 },
      update: {},
      create: { name: 'Neymar', teamId: brazil.id },
    }),
    prisma.player.upsert({
      where: { id: 3 },
      update: {},
      create: { name: 'Messi', teamId: argentina.id },
    }),
    prisma.player.upsert({
      where: { id: 4 },
      update: {},
      create: { name: 'Mbappe', teamId: france.id },
    }),
  ])

  const competition = await prisma.competition.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Copa do Mundo 2026',
      startDate: new Date('2026-06-01T00:00:00.000Z'),
      status: 'ACTIVE',
    },
  })

  await Promise.all([
    prisma.userCompetition.upsert({
      where: {
        userId_competitionId: {
          userId: admin.id,
          competitionId: competition.id,
        },
      },
      update: {},
      create: { userId: admin.id, competitionId: competition.id },
    }),
    ...users.map((user) =>
      prisma.userCompetition.upsert({
        where: {
          userId_competitionId: {
            userId: user.id,
            competitionId: competition.id,
          },
        },
        update: {},
        create: { userId: user.id, competitionId: competition.id },
      }),
    ),
  ])

  const match = await prisma.match.upsert({
    where: { id: 1 },
    update: {},
    create: {
      competitionId: competition.id,
      homeTeamId: brazil.id,
      awayTeamId: argentina.id,
      matchDate: new Date('2026-06-10T19:00:00.000Z'),
      brazilGame: true,
      status: 'SCHEDULED',
    },
  })

  await prisma.competitionStanding.upsert({
    where: {
      userId_competitionId: {
        userId: users[0].id,
        competitionId: competition.id,
      },
    },
    update: {},
    create: {
      userId: users[0].id,
      competitionId: competition.id,
    },
  })

  console.log('Seed concluído:', {
    admin: admin.login,
    users: users.map((user) => user.login),
    teams: [brazil.name, argentina.name, france.name],
    players: players.map((player) => player.name),
    competition: competition.name,
    matchId: match.id,
  })
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })