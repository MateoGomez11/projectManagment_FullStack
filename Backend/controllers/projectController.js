const projectService = require("../services/projectService");
const asyncHandler = require("express-async-handler");
const crypto = require('crypto');

//@desc Get all projects
//@route GET /api/projects
//@access public
const getProjects = asyncHandler(async (req, res) => {
    const projects = await projectService.listProjects();
    res.status(200).json(projects);
});

//@desc Get project by Id
//@route GET /api/projects/:id
//@access public
const getProject = asyncHandler(async (req, res) => {
    const project = await projectService.getProject(req.params.id);
    if (!project) {
        res.status(404);
        throw new Error("Project not found");
    }
    res.status(200).json(project);
});


//@desc Create project
//@route POST /api/projects/
//@access public
const createProject = asyncHandler(async (req, res) => {
    const { name, description, status, startDate, endDate } = req.body;
    if (!name || !description || !startDate || !endDate) {
        res.status(400);
        throw new Error("Please complete empty fields");
    };

    if (status && !["IN_PROGRESS", "PENDING", "COMPLETED"].includes(status)) {
        res.status(400);
        throw new Error("STATUS NOT VALID");
    };

    if (new Date(endDate) < new Date(startDate)) {
        res.status(400);
        throw new Error("The end date cannot be earlier than the start date");
    };

    const project = await projectService.createProject({
        name,
        description,
        status,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
    });

    res.status(201).json(project)
});

//@desc Update project
//@route PUT /api/projects/:id
//@access public
const updateProject = asyncHandler(async (req, res) => {
    const { name, description, status, startDate, endDate } = req.body;

    const project = await projectService.getProject(req.params.id)

    if (!project) {
        res.status(404);
        throw new Error("Project id not found");
    }


    if (status && !['IN_PROGRESS',"PENDING", 'COMPLETED'].includes(status)) {
        res.status(400);
        throw new Error('STATUS NOT VALID');
    }
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
        res.status(400);
        throw new Error('The end date cannot be earlier than the start date');
    }

    const data = { ...req.body };
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);

    const updatedProject = await projectService.updateProject(req.params.id, data);
    res.status(200).json(updatedProject);

});

//@desc Delete project
//@route DELETE /api/projects/:id
//@access public
const deleteProject = asyncHandler(async (req, res) => {
    const project = await projectService.getProject(req.params.id)

    if (!project) {
        res.status(404);
        throw new Error("Project id not found");
    }

    const deletedProject = await projectService.deleteProject(req.params.id);
    res.status(200).json(deletedProject);
});

//@desc generate summary project
//@route GET /api/projects/summary/:id
//@access public
const summarizeProjectGet = asyncHandler(async (req, res) => {
    // defaults fijos porque pediste solo :id (sin body):
    const language = 'es';
    const maxChars = 300;

    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        res.status(400);
        throw new Error('Invalid project id');
    }

    const project = await projectService.getProject(id);
    if (!project) {
        res.status(404);
        throw new Error('Project not found');
    }

    if (!project.description || !project.description.trim()) {
        res.status(400);
        throw new Error('Project has no description to summarize');
    }

    // hash for cache (depends on description + params)
    const hash = crypto
        .createHash('sha256')
        .update(`${project.description}::${language}::${maxChars}`)
        .digest('hex');

    // cache hit
    if (project.summary && project.summaryHash === hash) {
        return res.status(200).json({
            projectId: project.id,
            summary: project.summary,
            language: project.summaryLang || language,
            cached: true,
            summaryAt: project.summaryAt,
        });
    }

    // Gemini
    if (!process.env.GEMINI_API_KEY) {
        res.status(500);
        throw new Error('GEMINI_API_KEY is not configured');
    }

    const summary = await projectService.generateSummaryWithGemini({
        description: project.description,
        language,
        maxChars,
    });

    if (!summary) {
        res.status(502);
        throw new Error('Failed to generate summary');
    }

    // Cache save
    const updated = await projectService.updateProjectSummaryCache(id, {
        summary,
        lang: language,
        hash,
        at: new Date(),
    });

    res.status(200).json({
        projectId: updated.id,
        summary: updated.summary,
        language: updated.summaryLang,
        cached: false,
        summaryAt: updated.summaryAt,
    });
});



module.exports = { getProjects, getProject, createProject, updateProject, deleteProject, summarizeProjectGet };