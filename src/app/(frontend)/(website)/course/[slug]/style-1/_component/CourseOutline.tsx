'use client';

import React from 'react';
import { Play } from 'lucide-react';
import RenderRichText from './RenderRichText'

interface Module {
  id?: string | null;
  _id?: string;
  heading?: string | null;
  content?: any;
}

interface CourseOutlineProps {
  modules: Module[];
}

const CourseOutline: React.FC<CourseOutlineProps> = ({ modules }) => {
  const [expandedId, setExpandedId] = React.useState<string | number | null>(null);

  const toggleAccordion = (id: string | number) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-4 mx-auto mt-4">
      {modules.map((module, index) => {
        const uniqueId = module.id ?? module._id ?? index;

        return (
          <div key={uniqueId} className="border bg-card rounded-xl shadow-md">
            <button
              onClick={() => toggleAccordion(uniqueId)}
              className="flex w-full p-4 gap-4 items-center focus:outline-none"
              aria-expanded={expandedId === uniqueId}
            >
              <div className="bg-background rounded-full p-3 flex items-center justify-center h-fit">
                <Play strokeWidth={3} size={14} />
              </div>
              <div className="flex-1 text-left">
                <h2 className="text-lg font-medium">{module.heading}</h2>
              </div>
              <div className="text-xl text-primary-500 font-bold select-none">
                {expandedId === uniqueId ? '-' : '+'}
              </div>
            </button>

            {expandedId === uniqueId && module.content && (
              <div className="">
                {/* <RichTextRenderer /> */}
                <RenderRichText richText={module.content} />

              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CourseOutline;
