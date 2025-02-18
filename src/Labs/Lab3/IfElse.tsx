export default function IfElse() {
    let numberVariable = 123, floatingPointNumber =234.345;
    let true1 = true, false1 = false, false2 = true1 && false1;
    let true2 = true1 || false1, true3 = !false2;
    let true4 = numberVariable === 123;
    let true5 = floatingPointNumber !== 321.432;
    let false3 = numberVariable < 100;
    return (
        <div id="wd-if-else">
            <h4>If Else</h4>
            { true1 && <p>true1</p> }
            { !false1 ? <p>false1</p> : <p>false1</p> } <hr />
        </div>
    );
}