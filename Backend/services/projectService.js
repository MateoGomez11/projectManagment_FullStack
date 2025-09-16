const { PrismaClient } = require('@prisma/client');
const { GoogleGenerativeAI } = require('@google/generative-ai');


const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

async function listProjects() {
    return prisma.project.findMany();
};

async function getProject(id) {
    return prisma.project.findUnique({ where: { id: Number(id) } });
}

async function createProject(data) {
    return prisma.project.create({ data });
};

async function updateProject(id, data) {
    return prisma.project.update({
        where: { id: Number(id) },
        data
    });
}

async function deleteProject(id) {
    return prisma.project.delete({ where: { id: Number(id) } });
};

async function updateProjectSummaryCache(id, { summary, lang, hash, at }) {
  return prisma.project.update({
    where: { id: Number(id) },
    data: {
      summary: summary ?? null,
      summaryLang: lang ?? null,
      summaryHash: hash ?? null,
      summaryAt: at ?? null,
    },
    select: { id: true, name: true, summary: true, summaryLang: true, summaryAt: true },
  });
}

async function generateSummaryWithGemini({ description, language = 'es', maxChars = 300 }) {
  const prompt = `
Eres un asistente que resume descripciones de proyectos.
Idioma: ${language}. Límite aproximado: ${maxChars} caracteres.
Resumen claro. No inventes datos.

Descripción:
"""${description}"""

Devuelve solo el resumen en texto plano.
`.trim();

  const res = await geminiModel.generateContent(prompt);
  const text = (await res.response.text())?.trim();
  return text || '';
};


module.exports =  { listProjects, getProject, createProject, updateProject, deleteProject, updateProjectSummaryCache, generateSummaryWithGemini};