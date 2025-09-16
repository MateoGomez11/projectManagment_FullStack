const express = require('express');
const router = express.Router();
const projectController = require("../controllers/projectController");
const analyticsController = require("../controllers/analyticsController")

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Projects endopoints
 */

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: Projects list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 */
router.get('/', projectController.getProjects);

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create project
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectCreate'
 *           example:
 *             name: "Network Implementation"
 *             description: "Project to deploy network in Caldas"
 *             status: "IN_PROGRESS"
 *             startDate: "2025-09-20"
 *             endDate: "2025-12-15"
 *     responses:
 *       201:
 *         description: Project created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Validation error
 */
router.post('/', projectController.createProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Get project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Project found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Project not found
 */
router.get('/:id', projectController.getProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Update project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectUpdate'
 *           example:
 *             name: "Network Implementation II"
 *             description: "Updated description"
 *             status: "COMPLETED"
 *             startDate: "2025-09-20"
 *             endDate: "2025-12-31"
 *     responses:
 *       200:
 *         description: Project updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Project not found
 */
router.put('/:id', projectController.updateProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Delete project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Project deleted
 *       404:
 *         description: Project not found
 */
router.delete('/:id', projectController.deleteProject);

/**
 * @swagger
 * /api/projects/{id}/summary:
 *   get:
 *     summary: Generate and cache a summary from project description (Gemini)
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Summary generated or returned from cache
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 projectId: { type: integer, example: 1 }
 *                 summary: { type: string, example: "Short summary of the project..." }
 *                 language: { type: string, example: "es" }
 *                 cached: { type: boolean, example: true }
 *                 summaryAt: { type: string, format: date-time, example: "2025-09-15T12:00:00.000Z" }
 *       400: { description: Validation error }
 *       404: { description: Project not found }
 *       500: { description: Missing configuration (e.g., GEMINI_API_KEY) }
 *       502: { description: LLM provider error }
 */
router.get('/:id/summary', projectController.summarizeProjectGet);

/**
 * @swagger
 * /api/projects/analytics/status:
 *   get:
 *     summary: Count projects grouped by status
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: Counts of projects by status
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     example: "IN_PROGRESS"
 *                   count:
 *                     type: integer
 *                     example: 4
 */

router.get('/analytics/status', analyticsController.getCountsByStatus);

/**
 * @swagger
 * /api/projects/analytics/months:
 *   get:
 *     summary: Count projects grouped by month (based on startDate)
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: Counts of projects by month
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   month:
 *                     type: string
 *                     example: "2025-09"
 *                   count:
 *                     type: integer
 *                     example: 3
 */
router.get('/analytics/months', analyticsController.getCountsByMonth);

module.exports = router;







