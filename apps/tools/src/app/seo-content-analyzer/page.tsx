import { generateToolMetadata } from "@/lib/tool-metadata";
import { JsonLd, softwareLd, faqLd } from "@/lib/json-ld";
import { getToolByHref, getPrimaryCollection } from "@/data/tools";
import { ToolPageWrapper } from "@/components/tools/tool-page-wrapper";
import SeoContentAnalyzerContent from "./content";
import { TOOL_FAQ } from "@/data/tool-faq";

export const generateMetadata = () => generateToolMetadata("/seo-content-analyzer");

const TOOL_HREF = "/seo-content-analyzer";
const tool = getToolByHref(TOOL_HREF)!;
const collection = getPrimaryCollection(tool);

export default function SeoPageAnalyzerPage() {
  const faq = TOOL_FAQ[TOOL_HREF] ?? [];
  return (
    <>
      <JsonLd data={softwareLd({ slug: TOOL_HREF.slice(1), name: tool.name, description: tool.description, collection: collection.title, collectionHref: collection.href })} />
      {faq.length > 0 && <JsonLd data={faqLd(`https://tools.iamkesava.com${TOOL_HREF}`, faq)} />}
      <ToolPageWrapper href={TOOL_HREF}>
        <SeoContentAnalyzerContent faqPassages={faq} />
      </ToolPageWrapper>
    </>
  );
}
