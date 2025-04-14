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

export default function PeopleTable({ users: propUsers }: { users?: User[] }) {
  const { cid } = useParams();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (propUsers) {
      setUsers(propUsers);
      return;
    }

    if (!cid) return;

    const fetchUsers = async () => {
      try {
        const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER || "http://localhost:4000";
        const response = await axios.get(`${REMOTE_SERVER}/api/courses/${cid}/users`);
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, [cid, propUsers]);

  return (
    <div id="wd-people-table">
      {!propUsers && <PeopleDetails />}
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
              <td colSpan={6} className="text-center text-muted">No users enrolled.</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id}>
                <td className="wd-full-name text-nowrap">
                  <Link to={`/Kambaz/Account/Users/${user._id}`} className="text-decoration-none">
                    <FaUserCircle className="me-2 fs-1 text-secondary" />
                    <span>{user.firstName}</span> <span>{user.lastName}</span>
                  </Link>
                </td>
                <td>{user.loginId}</td>
                <td>{user.section}</td>
                <td>{user.role}</td>
                <td>{user.lastActivity}</td>
                <td>{user.totalActivity}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
}
