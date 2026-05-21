import { generateToolMetadata } from "@/lib/tool-metadata";
import { JsonLd, softwareLd, faqLd } from "@/lib/json-ld";
import { getToolByHref, getPrimaryCollection } from "@/data/tools";
import { ToolPageWrapper } from "@/components/tools/tool-page-wrapper";
import OgImageContent from "./content";
import { TOOL_FAQ } from "@/data/tool-faq";

export const generateMetadata = () => generateToolMetadata("/og-image");

const TOOL_HREF = "/og-image";
const tool = getToolByHref(TOOL_HREF)!;
const collection = getPrimaryCollection(tool);

export default function OgImagePage() {
  const faq = TOOL_FAQ[TOOL_HREF] ?? [];
  return (
    <>
      <JsonLd data={softwareLd({ slug: TOOL_HREF.slice(1), name: tool.name, description: tool.description, collection: collection.title, collectionHref: collection.href })} />
      {faq.length > 0 && <JsonLd data={faqLd(`https://tools.iamkesava.com${TOOL_HREF}`, faq)} />}
      <ToolPageWrapper href={TOOL_HREF}>
        <OgImageContent faqPassages={faq} />
      </ToolPageWrapper>
    </>
  );
}
