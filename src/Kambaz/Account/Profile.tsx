import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import { Form, FormControl, Button } from "react-bootstrap";
import * as client from "./client";

export default function Profile() {
    const [profile, setProfile] = useState<any>({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useSelector((state: any) => state.accountReducer);

    useEffect(() => {
        if (!currentUser) {
            navigate("/Kambaz/Account/Signin");
        } else {
            setProfile(currentUser);
        }
    }, [currentUser, navigate]);

    const signout = async () => {
        await client.signout();
        dispatch(setCurrentUser(null));
        navigate("/Kambaz/Account/Signin");
    };

    const updateProfile = async () => {
        const updatedProfile = await client.updateUser(profile);
        dispatch(setCurrentUser(updatedProfile));
      };    

    return (
        <div className="wd-profile-screen">
            <h3>Profile</h3>
            {profile && (
                <Form>
                    <Form.Group className="mb-2">
                        <Form.Label>Username</Form.Label>
                        <FormControl
                            value={profile.username}
                            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                        />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Password</Form.Label>
                        <FormControl
                            type="password"
                            value={profile.password}
                            onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                        />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>First Name</Form.Label>
                        <FormControl
                            value={profile.firstName}
                            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                        />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Last Name</Form.Label>
                        <FormControl
                            value={profile.lastName}
                            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                        />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Date of Birth</Form.Label>
                        <FormControl
                            type="date"
                            value={profile.dob}
                            onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                        />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Email</Form.Label>
                        <FormControl
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Role</Form.Label>
                        <Form.Select
                            value={profile.role}
                            onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                        >
                            <option value="USER">User</option>
                            <option value="ADMIN">Admin</option>
                            <option value="FACULTY">Faculty</option>
                            <option value="STUDENT">Student</option>
                        </Form.Select>
                    </Form.Group>

                    <button onClick={updateProfile} className="btn btn-primary w-100 mb-2"> Update </button>
                    <Button variant="danger" className="w-100" onClick={signout}>
                        Sign out
                    </Button>
                </Form>
            )}
        </div>
    );
}