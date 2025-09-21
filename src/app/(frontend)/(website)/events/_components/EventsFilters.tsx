// import { Button } from '@/components/ui/button';
// import React from 'react'

// const EventsFilters = ({
//   selectedTab,
//   setSelectedTab,
//   departMents
// }: {
//   selectedTab: string,
//   setSelectedTab: (selectedTab: string) => void,
//   departMents: any
// }) => {
//   return (
//     <div className="container mx-auto flex  gap-2 px-4 flex-wrap  lg:px-10 mb-10 max-sm:mb-5">
//       {!departments.map((department, index) => (
//         <Button
//           key={index}
//           onClick={() => setSelectedTab(department)}
//           className={`${selectedTab === "all" ? 'bg-primary text-card' : 'bg-card text-foreground'}
//                w-fit rounded-xl border-2 border-foreground hover:shadow-[2px_2px_0px_rgba(0,0,0,0.9)] duration-2000 hover:bg-primary hover:text-background`}
//         >
//           {/* {event}{" "}({filteredArray.filter((str) => str === event).length}) */}
//           {department}
//         </Button>
//       ))}
//     </div>
//   )
// }

// export default EventsFilters