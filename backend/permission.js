import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function checkProjectPermission(req, res, next) {
  const projectId = parseInt(req.params.projectId);

  const userId = req.session.user.id;

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { teamMembers: true, manager: true },
    });

    if (!project) {
      res.status(404).json({ message: "Project not found" });
    }

    const isManager = project.manager_id === userId;
    const isTeamMember = project.teamMembers.some(
      (member) => member.id === userId
    );

    if (!isManager && !isTeamMember) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export default checkProjectPermission;
