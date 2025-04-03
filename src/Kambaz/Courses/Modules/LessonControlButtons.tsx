import { IoEllipsisVertical } from "react-icons/io5";
import { FaPencil } from "react-icons/fa6";
import GreenCheckmark from "./GreenCheckmark";

export default function LessonControlButtons({
  editLesson,
}: {
  editLesson: () => void;
}) {
  return (
    <div className="float-end">
      <GreenCheckmark />
      <IoEllipsisVertical className="fs-4" />
    </div>
  );
}
