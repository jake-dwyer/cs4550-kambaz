import { FaPlus } from 'react-icons/fa6';
import { IoEllipsisVertical } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AssignmentControlButtons() {
  const navigate = useNavigate();
  const { cid } = useParams();

  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const canEdit = currentUser && (currentUser.role === "ADMIN" || currentUser.role === "FACULTY");

  if (!canEdit) {
    return null;
  }

  return (
    <div className="float-end">
      <div
        id="wd-total"
        className="d-inline-block rounded-pill border border-dark px-2 me-2"
      >
        40% of Total
      </div>
      <FaPlus
        className="fs-4 cursor-pointer"
        onClick={() => navigate(`/Kambaz/Courses/${cid}/Assignments/new`)}
      />
      <IoEllipsisVertical className="fs-4" />
    </div>
  );
}