import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface Question {
  question: string;
  type: 'text' | 'image';
  answer: string;
  points: number;
}

interface Category {
  name: string;
  questions: Question[];
}

async function importQuestions() {
  // Support both Docker and local paths
  let categoriesPath = path.join(__dirname, '..', '..', '..', 'categories');
  
  // In Docker, categories are mounted at /app/categories
  if (!fs.existsSync(categoriesPath)) {
    categoriesPath = '/app/categories';
  }
  
  // Check if categories folder exists
  if (!fs.existsSync(categoriesPath)) {
    console.error('❌ Папка categories не найдена');
    console.error('   Проверьте путь:', categoriesPath);
    process.exit(1);
  }

  // Get all JSON files
  const files = fs.readdirSync(categoriesPath).filter(f => f.endsWith('.json'));
  
  if (files.length === 0) {
    console.error('❌ JSON файлы не найдены в папке categories');
    process.exit(1);
  }

  console.log(`📁 Найдено ${files.length} файлов категорий`);

  // Clear existing data
  await prisma.question.deleteMany();
  await prisma.category.deleteMany();
  console.log('🗑️  Старые данные очищены');

  let totalQuestions = 0;

  for (const file of files) {
    const filePath = path.join(categoriesPath, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const categoryData: Category = JSON.parse(content);

    const category = await prisma.category.create({
      data: {
        name: categoryData.name,
        questions: {
          create: categoryData.questions.map(q => ({
            question: q.question,
            type: q.type,
            answer: q.answer,
            points: q.points,
          })),
        },
      },
    });

    console.log(`✅ Категория "${category.name}": ${categoryData.questions.length} вопросов`);
    totalQuestions += categoryData.questions.length;
  }

  console.log(`\n🎄 Импорт завершён! Всего: ${files.length} категорий, ${totalQuestions} вопросов`);
}

importQuestions()
  .catch((e) => {
    console.error('❌ Ошибка импорта:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
