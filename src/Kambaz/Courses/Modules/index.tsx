import { ListGroup } from 'react-bootstrap';
import { useParams } from 'react-router';
import { BsGripVertical } from 'react-icons/bs';
import LessonControlButtons from "./LessonControlButtons.tsx";
import { useState, useEffect } from 'react';
import { setModules, addModule, editModule, updateModule, deleteModule } from "./reducer";
import { useSelector, useDispatch } from "react-redux";
import ModulesControls from "./ModulesControls";
import ModuleControlButtons from "./ModuleControlButtons.tsx";
import * as coursesClient from "../client";
import * as modulesClient from "./client";
import { v4 as uuidv4 } from 'uuid';

export default function Modules() {
  const { cid } = useParams();
  const [moduleName, setModuleName] = useState("");
  const { modules } = useSelector((state: any) => state.modulesReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const canEdit = currentUser && (currentUser.role === "ADMIN" || currentUser.role === "FACULTY");

  const dispatch = useDispatch();

  const saveModule = async (module: any) => {
    await modulesClient.updateModule(module);
    dispatch(updateModule(module));
  };

  const removeModule = async (moduleId: string) => {
    await modulesClient.deleteModule(moduleId);
    dispatch(deleteModule(moduleId));
  };

  const fetchModules = async () => {
    const modules = await coursesClient.findModulesForCourse(cid as string);
    dispatch(setModules(modules));
  };

  useEffect(() => {
    fetchModules();
  }, [cid]);

  const createModuleForCourse = async () => {
    if (!cid) return;
    const newModule = { name: moduleName, course: cid };
    const module = await coursesClient.createModuleForCourse(cid, newModule);
    dispatch(addModule(module));
    setModuleName("");
  };

  const addLessonToModule = async (moduleId: string) => {
    const module = modules.find((m: any) => m._id === moduleId);
    if (!module) return;

    const newLesson = {
      _id: uuidv4(),
      name: "New Lesson",
      module: moduleId,
    };

    const updatedModule = {
      ...module,
      lessons: [...(module.lessons || []), newLesson],
    };

    await modulesClient.updateModule(updatedModule);

    const newModules = modules.map((m: any) =>
      m._id === moduleId ? updatedModule : m
    );

    dispatch(setModules(newModules));
  };

  return (
    <div className="wd-modules">
      {canEdit && (
        <ModulesControls
          setModuleName={setModuleName}
          moduleName={moduleName}
          addModule={createModuleForCourse}
        />
      )}
      <br /><br /><br /><br />
      <ListGroup id="wd-modules" className="rounded-0">
        {modules.map((module: any) => (
          <ListGroup.Item
            key={module._id}
            className="wd-module p-0 mb-5 fs-5 border-gray"
          >
            <div className="wd-title p-3 ps-2 bg-secondary">
              <BsGripVertical className="me-2 fs-3" />
              {!module.editing && module.name}
              {module.editing && canEdit && (
                <input
                  value={module.name}
                  className="form-control w-50 d-inline-block"
                  onChange={(e) =>
                    dispatch(updateModule({ ...module, name: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      saveModule({ ...module, editing: false });
                    }
                  }}
                />
              )}
              {canEdit && (
                <ModuleControlButtons
                  moduleId={module._id}
                  deleteModule={(moduleId) => removeModule(moduleId)}
                  editModule={(moduleId) => dispatch(editModule(moduleId))}
                  addLesson={addLessonToModule}
                />
              )}
            </div>
            {module.lessons && (
              <ListGroup className="wd-lessons rounded-0">
                {module.lessons.map((lesson: any) => (
                  <ListGroup.Item
                    key={lesson._id || lesson.name}
                    className="wd-lesson p-3 ps-1"
                  >
                    <BsGripVertical className="me-2 fs-3" />
                    {lesson.name}
                    <LessonControlButtons
                      editLesson={() => console.log("Edit lesson", lesson._id)}
                    />
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}
