export type PassportMeta = {
  name: string;
  description: string;
  image: string; // data:image/svg+xml;base64,... — usable directly as <img src>
  attributes: { trait_type: string; value: string | number }[];
};

/** Decode the on-chain data:application/json;base64 tokenURI into usable metadata. */
export function parseTokenURI(uri?: string): PassportMeta | null {
  if (!uri || !uri.startsWith("data:application/json;base64,")) return null;
  try {
    const b64 = uri.split("base64,")[1];
    const json = decodeURIComponent(escape(atob(b64)));
    return JSON.parse(json) as PassportMeta;
  } catch {
    return null;
  }
}
