// import React from "react";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import { FileText } from "lucide-react";


// const AccordionModules = ({ modules }: AccordionModulesProps) => {
//   return (
//     <Accordion type="multiple" className="w-full">
//       {modules.map((module) => (
//         <AccordionItem
//           key={module.moduleId}
//           value={module.moduleTitle}
//           className="accordion-module"
//         >
//           <AccordionTrigger className="accordion-module__trigger">
//             <h5 className="accordion-module__title">{module.moduleTitle}</h5>
//           </AccordionTrigger>
//           <AccordionContent className="accordion-module__content">
//             <ul>
//               {module.lectures.map((lecture) => (
//                 <li
//                   key={lecture.lectureId}
//                   className="accordion-module__lecture"
//                 >
//                   <FileText className="mr-2 w-4 h-4" />

//                   <span className="text-sm">{lecture.title}</span>
//                 </li>
//               ))}
//             </ul>
//           </AccordionContent>
//         </AccordionItem>
//       ))}
//     </Accordion>
//   );
// };

// export default AccordionModules;
import React from 'react'

const AccordionSections = () => {
  return (
    <div>AccordionSections</div>
  )
}

export default AccordionSections