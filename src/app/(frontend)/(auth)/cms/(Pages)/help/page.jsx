import React from "react";
import { Collapse } from 'antd';
import { leadStages } from "@cms/_lib/leadStages";

const CSRJobDescription = () => (
  <ol>
    <li>Provide accurate and uptodate information</li>
    <li>Engage Lead</li>
    <li>usp/excit/motivate</li>
    <li>CTA</li>
    <li>maintain leads record properly: record every ineraction</li>
    <li>do aggrasive leads followup: old + new</li>
    <li>negotiate and convince</li>
    <p>++ Regular, Punctual, Honest, Hardworking, Ability</p>
  </ol>
);

const LeadStages = () => (
    <ol>
      {leadStages.map(stage => <li key={stage.label}>{stage.label}</li>)}
      <p>*Interest Levels: Unknown, Low, Medium, High</p>
    </ol>
);

const items = [
  {
    key: '1',
    label: 'CSR Job Description',
    children: <CSRJobDescription />,
  },
  {
    key: '2',
    label: `Lead Stages / Sales Funnel - ${leadStages.length} Stages, 5 groups`,
    children: <LeadStages />,
  },
];

export default function CSRJob() {
  return (
      <Collapse items={items} />
  );
}
