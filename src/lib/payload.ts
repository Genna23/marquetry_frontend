export async function getHeroData() {
  const res = await fetch(`${import.meta.env.PUBLIC_PAYLOAD_API}/api/hero`);
  const { docs } = await res.json();
  return docs[0];
}
