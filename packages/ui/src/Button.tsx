"use client";

export function Button(): JSX.Element {
  return (
    <button
      onClick={(): void => alert("booped")}
      type="button"
      className="rounded border border-solid border-black bg-lime-200 p-3"
    >
      Boop
    </button>
  );
}
