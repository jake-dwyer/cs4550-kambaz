import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { Table } from "react-bootstrap";
import PeopleDetails from "./Details";

type User = {
  _id: string;
  firstName?: string;
  lastName?: string;
  loginId?: string;
  section?: string;
  role?: string;
  lastActivity?: string;
  totalActivity?: string;
};

export default function PeopleTable() {
  // Get the course id from the URL. Ensure your route is set to something like "/Kambaz/Courses/:cid/People"
  const { cid } = useParams();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!cid) return;

    const fetchUsers = async () => {
      try {
        const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER || "http://localhost:4000";
        const response = await axios.get(`${REMOTE_SERVER}/api/courses/${cid}/users`);
        console.log("Fetched users:", response.data);
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, [cid]);

 // console.log("🧑‍🤝‍🧑 Users passed to PeopleTable:", users);

  return (
    <div id="wd-people-table">
      <PeopleDetails />
      <Table striped>
        <thead>
          <tr>
            <th>Name</th>
            <th>Login ID</th>
            <th>Section</th>
            <th>Role</th>
            <th>Last Activity</th>
            <th>Total Activity</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center text-muted">
                No users enrolled in this course.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id}>
                <td className="wd-full-name text-nowrap">
                  <Link
                    to={`/Kambaz/Account/Users/${user._id}`}
                    className="text-decoration-none"
                  >
                    <FaUserCircle className="me-2 fs-1 text-secondary" />
                    <span className="wd-first-name">{user.firstName}</span>
                    <span className="wd-last-name"> {user.lastName}</span>
                  </Link>
                </td>
                <td className="wd-login-id">{user.loginId}</td>
                <td className="wd-section">{user.section}</td>
                <td className="wd-role">{user.role}</td>
                <td className="wd-last-activity">{user.lastActivity}</td>
                <td className="wd-total-activity">{user.totalActivity}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
}