import { Link, useLocation, useParams } from 'react-router-dom';
import { ListGroup } from 'react-bootstrap';

export default function CourseNavigation() {
    const { pathname } = useLocation();
    const { cid } = useParams();

    const links = [
        { label: "Home", path: `/Kambaz/Courses/${cid}/Home`, icon: "home" },
        { label: "Modules", path: `/Kambaz/Courses/${cid}/Modules`, icon: "modules" },
        { label: "Piazza", path: `/Kambaz/Courses/${cid}/Piazza`, icon: "piazza" },
        { label: "Zoom", path: `/Kambaz/Courses/${cid}/Zoom`, icon: "zoom" },
        { label: "Assignments", path: `/Kambaz/Courses/${cid}/Assignments`, icon: "assignments" },
        { label: "Quizzes", path: `/Kambaz/Courses/${cid}/Quizzes`, icon: "quizzes" },
        { label: "Grades", path: `/Kambaz/Courses/${cid}/Grades`, icon: "grades" },
        { label: "People", path: `/Kambaz/Courses/${cid}/People`, icon: "people" }
    ];

    return (
        <ListGroup className="wd fs-5 rounded-0" id="course-navigation">
            {links.map((link) => (
                <ListGroup.Item key={link.path} as={Link}
                    to={link.path}
                    className={`text-danger border border-0 ${pathname.includes(link.label) ? "active" : "text-danger border border-0"}`}>
                    {link.label}
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
}
