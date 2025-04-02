import * as dao from "./dao.js";

export default function AssignmentRoutes(app) {
  app.post("/api/modules/:moduleId/assignments", (req, res) => {
    const { moduleId } = req.params;
    const newAssignment = { ...req.body, module: moduleId };
    const created = dao.createAssignment(newAssignment);
    res.send(created);
  });

  app.get("/api/modules/:moduleId/assignments", (req, res) => {
    const { moduleId } = req.params;
    const assignments = dao.findAssignmentsForModule(moduleId);
    res.send(assignments);
  });

  app.put("/api/assignments/:assignmentId", (req, res) => {
    const { assignmentId } = req.params;
    const updates = req.body;
    const updated = dao.updateAssignment(assignmentId, updates);
    res.send(updated);
  });

  app.delete("/api/assignments/:assignmentId", (req, res) => {
    const { assignmentId } = req.params;
    const status = dao.deleteAssignment(assignmentId);
    res.send(status);
  });  
}
