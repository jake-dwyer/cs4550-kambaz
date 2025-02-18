export default function TernaryOperator() {
    let loggedIn = true;
    return (
        <div id="wd-ternary-operator">
            <h4>Logged In</h4>
            { loggedIn ? <p>Welcome back!</p> : <p>Please log in.</p> } <hr />
        </div>
    );
}