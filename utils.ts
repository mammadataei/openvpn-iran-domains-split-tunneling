import { lookup } from "https://deno.land/std@0.140.0/node/dns/promises.ts";

const IPV4_FAMILY_TYPE = 4;

export async function performDNSLookup(domains: Array<string>) {
  const unresolvedDomains: Array<string> = [];

  const resolvedRecords = await Promise.all(
    domains.map((domain) =>
      lookup(domain, IPV4_FAMILY_TYPE).catch(() => {
        unresolvedDomains.push(domain);
        console.warn(
          `Lookup for ${domain} failed. Domain skipped and will be removed from domains list.`
        );
      })
    )
  );

  const resolvedIPs = resolvedRecords
    .reduce<Array<string | null>>((resolved, record) => {
      if (Array.isArray(record)) {
        return [...resolved, ...record.map(({ address }) => address)];
      }

      if (typeof record === "object") {
        return [...resolved, record.address];
      }

      return resolved;
    }, [])
    .filter((ip) => ip !== null) as string[];

  return {
    resolvedIPs,
    unresolvedDomains,
  };
}
