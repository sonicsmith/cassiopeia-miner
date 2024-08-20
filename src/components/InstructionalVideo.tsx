import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

export const InstructionalVideo = () => {
  return (
    <div className="w-fit m-auto">
      <div className="mb-3">Watch Instructional Video:</div>
      <iframe
        className="murf-embed m-auto"
        width="500"
        height="315"
        src="https://murf.ai/embeds/index.html?embedId=m0300r81"
        // allowfullscreen
        title="Murf Embed Player"
        // style="border: none;"
      ></iframe>
      <script src="https://murf.ai/embeds/widget.js"></script>
    </div>
  );
};

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>
      Yes. It adheres to the WAI-ARIA design pattern.
    </AccordionContent>
  </AccordionItem>
</Accordion>;
