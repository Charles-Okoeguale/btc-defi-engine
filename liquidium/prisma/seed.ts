// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create user
  const user = await prisma.user.create({
    data: {
      address: "bc1pgf7ta8xmtnv4jav0anwcyfm3xq2aa28a2nalpvndf6wckt3gl5lssj3gqu"
    }
  })

  // Create collection
  const collection = await prisma.collection.create({
    data: {
      slug: "season0",
      name: "Season 0 : Casey's Collection",
      floorPrice: 1.2
    }
  })

  // Create ordinal
  const ordinal = await prisma.ordinal.create({
    data: {
      inscriptionId: "eac6459bd3180b4e9a0380ec4cd1b2e106df8eb7eba9540815f177827d45c8dei2",
      inscriptionNumber: 76152697,
      name: "Wanko Manko #3",
      contentUrl: "https://bis-ord-content.fra1.cdn.digitaloceanspaces.com/ordinals/eac6459bd3180b4e9a0380ec4cd1b2e106df8eb7eba9540815f177827d45c8dei2",
      renderUrl: "https://bis-ord-renders.fra1.cdn.digitaloceanspaces.com/renders/eac6459bd3180b4e9a0380ec4cd1b2e106df8eb7eba9540815f177827d45c8dei2.png",
      lastSalePrice: 0.00965696,
      ownerWalletAddr: "bc1pgf7ta8xmtnv4jav0anwcyfm3xq2aa28a2nalpvndf6wckt3gl5lssj3gqu",
      collectionId: collection.id
    }
  })

  console.log(`User ID: ${user.id}`)
  console.log(`Ordinal ID: ${ordinal.id}`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })