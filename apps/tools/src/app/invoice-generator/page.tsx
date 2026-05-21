import { generateToolMetadata } from "@/lib/tool-metadata";
import { JsonLd, softwareLd, faqLd } from "@/lib/json-ld";
import { getToolByHref, getPrimaryCollection } from "@/data/tools";
import { ToolPageWrapper } from "@/components/tools/tool-page-wrapper";
import InvoiceGeneratorContent from "./content";
import { TOOL_FAQ } from "@/data/tool-faq";

export const generateMetadata = () => generateToolMetadata("/invoice-generator");

const TOOL_HREF = "/invoice-generator";
const tool = getToolByHref(TOOL_HREF)!;
const collection = getPrimaryCollection(tool);

export default function InvoiceGeneratorPage() {
  const faq = TOOL_FAQ[TOOL_HREF] ?? [];
  return (
    <>
      <JsonLd data={softwareLd({ slug: TOOL_HREF.slice(1), name: tool.name, description: tool.description, collection: collection.title, collectionHref: collection.href })} />
      {faq.length > 0 && <JsonLd data={faqLd(`https://tools.iamkesava.com${TOOL_HREF}`, faq)} />}
      <ToolPageWrapper href={TOOL_HREF}>
        <InvoiceGeneratorContent />
      </ToolPageWrapper>
      {faq.length > 0 && (
        <section className="tool-faq" aria-label="Frequently asked questions" data-server-faq>
          <h2 className="tool-faq-heading">About this tool</h2>
          <dl className="tool-faq-list">
            {faq.map(({ q, a }, i) => (
              <div key={i} className="tool-faq-item">
                <dt className="tool-faq-question">{q}</dt>
                <dd className="tool-faq-answer">{a}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </>
  );
}
