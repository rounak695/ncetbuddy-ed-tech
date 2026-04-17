/**
 * Generic JSON-LD structured data injector (Server Component).
 * Usage: <JsonLd data={{ "@context": "https://schema.org", ... }} />
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
