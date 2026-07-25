import bcrypt from 'bcryptjs'
import prisma from '../src/lib/prisma'

const DEFAULT_PASSWORD = 'digitalheroes123@'

const admins = [
  {
    email: 'rikibiswas2005@gmail.com',
    phone: '+919907927383',
  },
  {
    email: 'contact@digitalheroesco.com',
    phone: '+918840925421',
  },
]

async function main() {
  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10)

  for (const admin of admins) {
    const result = await prisma.adminUser.upsert({
      where: { email: admin.email },
      update: {
        passwordHash: hashedPassword,
        phone: admin.phone,
      },
      create: {
        email: admin.email,
        phone: admin.phone,
        passwordHash: hashedPassword,
      },
    })
    console.log(`✅ Admin created/updated: ${result.email} (${result.phone})`)
  }

  console.log('\n🔑 Default password for all admins: digitalheroes123@')
  console.log('⚠️  Please change your password after first login using Forgot Password!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
