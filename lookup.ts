import {
  resolve4,
  setServers,
} from "https://deno.land/std@0.154.0/node/dns/promises.ts";

setServers(["178.22.122.100"]);

console.log("Loading domains list from `domains.json`...");
const domains: Record<string, string[] | null> = JSON.parse(
  await Deno.readTextFile("domains.json")
);

console.log("Performing DNS lookup, this will take a while...");

let counter = 0;

for await (const domain of Object.keys(domains).slice(0, 2000)) {
  if (domains[domain] === null) {
    console.log(`Resolving "${domain}":`);

    try {
      const IPs = (await resolve4(domain)) as unknown as string[];
      domains[domain] = IPs;
      counter++;
    } catch {
      console.log(`Resolution for ${domain} failed.`);
    }
  }
}

console.log(`${counter} domains resolved. Updating "domains.json"...`);
await Deno.writeTextFile("domains.json", JSON.stringify(domains, null, "  "));

console.log("Done!");
