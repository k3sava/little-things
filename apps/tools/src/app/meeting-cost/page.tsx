import { generateToolMetadata } from "@/lib/tool-metadata";
import { JsonLd, softwareLd, faqLd } from "@/lib/json-ld";
import { getToolByHref, getPrimaryCollection } from "@/data/tools";
import { ToolPageWrapper } from "@/components/tools/tool-page-wrapper";
import MeetingCostContent from "./content";

export const generateMetadata = () => generateToolMetadata("/meeting-cost");

const tool = getToolByHref("/meeting-cost")!;
const collection = getPrimaryCollection(tool);

const faqPassages = [
  { q: "How does the meeting cost calculator work?", a: "Enter the number of attendees and average annual salary. The calculator multiplies attendees × (salary ÷ 2,080 working hours ÷ 60 minutes) to get cost per minute, then multiplies by elapsed meeting time." },
  { q: "Is the Meeting Cost Meter free to use?", a: "Yes. Free, no account, no ads, no data collection. The timer runs entirely in your browser — nothing is sent to a server." },
  { q: "Can I share a meeting cost link with my team?", a: "Yes. The URL encodes the number of attendees and salary so anyone who opens your link starts with the same settings." },
  { q: "Does it work on mobile?", a: "Yes. Tap Start to begin the timer. Swipe up from the bottom to adjust attendees and salary." },
];

export default function MeetingCostPage() {
  return (
    <>
      <JsonLd data={softwareLd({ slug: "meeting-cost", name: tool.name, description: tool.description, collection: collection.title, collectionHref: collection.href })} />
      <JsonLd data={faqLd(`https://tools.iamkesava.com/meeting-cost`, faqPassages)} />
      <ToolPageWrapper href="/meeting-cost">
        <MeetingCostContent faqPassages={faqPassages} />
      </ToolPageWrapper>
    </>
  );
}
