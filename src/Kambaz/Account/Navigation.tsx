import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

export default function AccountNavigation() {
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const { pathname } = useLocation();
    const active = (path: string) => (pathname.includes(path) ? "active" : "");
    return (
        <div id="account-navigation" className="list-group">
            <Link to={`/Kambaz/Account/Signin`}>Signin</Link> <br />
            <Link to={`/Kambaz/Account/Signup`}>Signup</Link> <br />
            <Link to={`/Kambaz/Account/Profile`}>Profile</Link>
            {currentUser && currentUser.role === "ADMIN" && (
       <Link to={`/Kambaz/Account/Users`}> Users </Link> )}
        </div>
    );
}