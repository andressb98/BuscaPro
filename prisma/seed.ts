import 'dotenv/config'; // Carga las variables de tu archivo .env
import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

// 1. Validamos que exista la URL, igual que en tu app
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl || !dbUrl.trim()) {
  throw new Error('DATABASE_URL no está definido. Revisa tu archivo .env');
}

// 2. Inicializamos Prisma con el adaptador de BetterSqlite3
const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: dbUrl })
});

async function main() {
  const especializaciones: Prisma.EspecializacionCreateInput[] = [
    { 
      nombre: 'Plomería', 
      descripcion: 'Instalación, mantenimiento y reparación de tuberías.' 
    },
    { 
      nombre: 'Electricidad', 
      descripcion: 'Instalaciones eléctricas residenciales y comerciales.' 
    },
    { 
      nombre: 'Soporte Técnico', 
      descripcion: 'Mantenimiento de equipos de cómputo, software y redes.' 
    },
    { 
      nombre: 'Herrería', 
      descripcion: 'Trabajos de soldadura, diseño y reparación de estructuras metálicas.' 
    },
    { 
      nombre: 'Carpintería', 
      descripcion: 'Fabricación, instalación y reparación de muebles de madera.' 
    }
  ];

  console.log('Iniciando el poblamiento (seeding) de la base de datos...');

  for (const esp of especializaciones) {
    const registro = await prisma.especializacion.upsert({
      where: { nombre: esp.nombre },
      update: {}, 
      create: esp
    });
    console.log(`Especialización registrada: ${registro.nombre}`);
  }

  console.log('Seeding completado con éxito.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e: Error) => {
    console.error('Error durante el seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  });