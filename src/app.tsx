import { For, Show, createSignal } from "solid-js";
import "./app.css";

type Scale = boolean[];

function range(n: number) {
  return [...new Array(n).keys()];
}

function binaryLength(n: number) {
  return Math.floor(Math.log2(n)) + 1;
}

function scaleFromNumber(n: number): Scale {
  return range(binaryLength(n))
    .reverse()
    .map((i) => (n >> i) % 2 !== 0);
}

function wrap<T>(array: T[], index: number): T {
  return array[index % array.length];
}

const notes = range(7).map((i) => String.fromCharCode("A".charCodeAt(0) + i));

const scales = {
  major: scaleFromNumber(0b101011010101),
};

const names = scales.major
  .reduce<number[]>(
    (acc, _, index, array) => [
      ...acc,
      (acc[index - 1] ?? 0) + (array[index - 1] && array[index] ? 2 : 1),
    ],
    []
  )
  .map(
    (n) =>
      wrap(notes, notes.indexOf("C") + Math.floor((n - 1) / 2)) +
      ((n - 1) % 2 === 0 ? "" : "♯")
  );

export default function App() {
  const [key, setKey] = createSignal(0);

  return (
    <main>
      {names[key()]}
      <select
        value={key()}
        onChange={(event) => {
          setKey(Number(event.currentTarget.value));
        }}
      >
        <For each={names}>
          {(name, index) => <option value={index()}>{name}</option>}
        </For>
      </select>
      <For each={scales.major}>
        {(note, index) => (
          <Show when={note}>{wrap(names, key() + index())} </Show>
        )}
      </For>
    </main>
  );
}
