// src/Kambaz/Courses/People/index.tsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { findUsersForCourse } from "../client";
import PeopleTable from "./Table"

export default function CoursePeople() {
  const { cid } = useParams();
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      if (!cid) return;
      console.log("Fetching users for course:", cid);
      const response = await findUsersForCourse(cid);
      console.log("Fetched users:", response);
      setUsers(response);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };  

  useEffect(() => {
    fetchUsers();
  }, [cid]);

  return <PeopleTable users={users} />;
}
