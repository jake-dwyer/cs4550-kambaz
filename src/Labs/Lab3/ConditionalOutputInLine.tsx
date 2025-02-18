const ConditionalOutputInLine = () => {
    const loggedIn = false;
    return (
        <div id="wd-conditional-output-inline">
            { loggedIn && <h2>Welcome Inline</h2> }
            { !loggedIn && <h2>Please log in Inline</h2> }
        </div>
    );
};

export default ConditionalOutputInLine;