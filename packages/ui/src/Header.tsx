export function Header({ text }: { text: string }): JSX.Element {
  return <h1 className="text-red-700">Hello {text}</h1>;
}
