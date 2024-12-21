export function loader() {
  return new Response("", { headers: { "Content-Type": "text/plain" } });
}
