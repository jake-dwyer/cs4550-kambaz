import { Link, useLocation } from 'react-router-dom';
import { useSelector } from "react-redux";

export default function AccountNavigation() {
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    return (
        <div id="account-navigation">
            <Link to={`/Kambaz/Account/Signin`}>Signin</Link> <br />
            <Link to={`/Kambaz/Account/Signup`}>Signup</Link> <br />
            <Link to={`/Kambaz/Account/Profile`}>Profile</Link>
        </div>
    );
}