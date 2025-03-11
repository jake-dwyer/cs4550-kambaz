export default function ChildStateComponent(
    { counter, setCounter }:
        {
            counter: number;
            setCounter: (counter: number) => void;
        }
    ) {
    return (
        <div id="wd-child-state">
            <h3>Counter {counter}</h3>
            <button onClick={() => setCounter(counter + 1)} >
                Increment</button>
            <button onClick={() => setCounter(counter - 1)} >
                Decrement</button>
            <hr /></div>);
}

const numbers = [1, 2, 3, 4];
const sum = numbers.reduce(
  (accumulator, currentValue) =>
    accumulator + currentValue, 0);
 console.log(sum); // 1

 