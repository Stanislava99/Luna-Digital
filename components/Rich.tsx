/** Shows a translated text that may contain <em> or <b>. Nothing else is interpreted as HTML. */
export function Rich({ text }: { text: string }) {
  return text.split(/(<em>.*?<\/em>|<b>.*?<\/b>)/).map((part, i) => {
    const m = part.match(/^<(em|b)>(.*)<\/\1>$/);
    if (!m) return part;
    return m[1] === "em" ? <em key={i}>{m[2]}</em> : <b key={i}>{m[2]}</b>;
  });
}
