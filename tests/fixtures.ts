import data from "./fixtures.json";

// cast the JSON to the expected types
type Fixture = { data: { pubkey: { x: string; y: string }; points: string }[] };
const fixtures = data as Fixture;

export default fixtures;
