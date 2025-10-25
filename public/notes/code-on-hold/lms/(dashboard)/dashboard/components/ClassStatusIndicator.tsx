import { Clock } from "lucide-react";


const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export default function ClassStatusIndicator() {
  return (
    <div className="mt-4 bg-green-900/30 border border-green-800 rounded-md p-3 flex items-center">
      <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse mr-2"></div>
      <span className="text-sm font-medium text-green-300">
        Class is live now! You can join the session.
      </span>
    </div>
  );


  // return (
  //   <div className="mt-4 bg-gray-800 border border-gray-700 rounded-md p-3 flex items-center">
  //     <span className="text-sm font-medium text-gray-400">
  //       This class has ended. Check your schedule for upcoming sessions.
  //     </span>
  //   </div>
  // );
}