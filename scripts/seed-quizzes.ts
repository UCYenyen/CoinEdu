import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import Groq from 'groq-sdk';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const METRICS = [
  'holdings',
  'avgBuy',
  'pnl',
  'globalMarketCap',
  'fearGreed',
  'price',
  'change24h',
  'marketCap',
  'volume',
  'circulatingSupply',
];

async function generateQuizzes() {
  console.log('Generating quizzes via Groq API...');

  const prompt = `
    Generate a JSON object with a key "quizzes" that is an array of education pop quizzes for the following crypto/financial metrics:
    Metrics: ${METRICS.join(', ')}

    For each metric, provide:
    - name: The display name (e.g., "Market Cap").
    - slug: A kebab-case identifier (e.g., "market-cap").
    - questionText: A clear multiple-choice question.
    - materials: A single string of educational material (2-3 sentences) explaining the metric.
    - options: An array of 4 objects, each with "optionText" (string) and "isCorrect" (boolean). Exactly ONE option must be correct.

    Output format: { "quizzes": [...] }
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
    });

    const content = chatCompletion.choices[0]?.message?.content || '{}';
    console.log('API Response:', content);
    const data = JSON.parse(content);
    const quizzes = data.quizzes || [];

    if (quizzes.length === 0) {
      console.error('No quizzes generated.');
      return;
    }

    console.log(`Generated ${quizzes.length} quizzes. Seeding into database...`);

    for (const quiz of quizzes) {
      console.log(`Processing: ${quiz.name} (${quiz.slug})`);

      // 1. Upsert Indicator
      const indicator = await prisma.indicator.upsert({
        where: { slug: quiz.slug },
        update: { name: quiz.name },
        create: {
          name: quiz.name,
          slug: quiz.slug,
        },
      });

      // 2. Upsert Material
      await prisma.material.deleteMany({ where: { indicatorId: indicator.id } });
      await prisma.material.create({
        data: {
          indicatorId: indicator.id,
          level: 'Basic',
          content: quiz.materials,
          order: 1,
        },
      });

      // 3. Upsert Question
      await prisma.question.deleteMany({ where: { indicatorId: indicator.id } });
      const question = await prisma.question.create({
        data: {
          indicatorId: indicator.id,
          questionText: quiz.questionText,
          xpReward: 10,
        },
      });

      // 4. Create Options
      await prisma.questionOption.createMany({
        data: quiz.options.map((opt: any) => ({
          questionId: question.id,
          optionText: opt.optionText,
          isCorrect: opt.isCorrect,
        })),
      });
    }

    console.log('Seeding complete!');
  } catch (error) {
    console.error('Error generating or seeding quizzes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

generateQuizzes();
