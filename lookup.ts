import { performDNSLookup } from "./utils.ts";

console.log("Loading domains list from `domains.txt`...");
const domains = (await Deno.readTextFile("domains.txt")).split("\n");

console.log("Performing DNS lookup, this will take a while...");
const { resolvedIPs, unresolvedDomains } = await performDNSLookup(domains);

console.log("Updating `resolvedIPs.txt`...");
await Deno.writeTextFile("resolvedIPs.txt", resolvedIPs.join("\n"));

console.log("Removing unresolved domains from `domains.txt`...");
const updatedDomainsList = domains.filter(
  (domain) => !unresolvedDomains.includes(domain)
);

console.log("Updating `domains.txt`...");
await Deno.writeTextFile("domains.txt", updatedDomainsList.join("\n"));

console.log("Done!");
