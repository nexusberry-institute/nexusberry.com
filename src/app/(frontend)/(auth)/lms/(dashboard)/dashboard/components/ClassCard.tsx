import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, Video } from 'lucide-react';
import { format } from "date-fns"

import { TClass } from "../types";
import ClassStatusIndicator from "./ClassStatusIndicator";
import { joinClass } from "../serverActions/joinClass";
import { useToast } from "@/hooks/use-toast";

export const ClassCard = ({
  classItem,
  batch,
  enrollmentId
}: {
  classItem: TClass,
  batch: TClass["batches"][number],
  enrollmentId?: number | null
}) => {

  const { toast } = useToast()

  const handleJoinClass = async (formData: FormData) => {
    try {
      const joiningLink = await joinClass(formData)
      window.location.href = joiningLink
    } catch (error) {
      toast({
        title: "Failed To Join Class",
        description: error instanceof Error ? error.message : String(error)
      })
    }
  }

  return (
    <Card className="h-full flex flex-col overflow-hidden transition-all hover:shadow-md border-l-4 border-l-primary">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">
              {batch["training-courses"].title}
            </CardTitle>
            <CardDescription className="text-sm mt-1.5">
              {batch.slug}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="space-y-3">
          {classItem.expiry && <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>
              {format(classItem.updatedAt, "p")} - {format(classItem.expiry, "p")}
            </span>
          </div>}

          <div className="flex items-center text-sm">
            <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>Lecture Type: {classItem.type}</span>
          </div>

          <ClassStatusIndicator />
        </div>
      </CardContent>

      <CardFooter className="pt-2 mt-auto">
        <form action={handleJoinClass} className="w-full">
          <input type="hidden" name="classId" value={classItem.id} />
          {enrollmentId && <input type="hidden" name="enrollmentId" value={enrollmentId} />}
          <Button
            type="submit"
            variant="default"
            className="w-full"
          >
            <Video className="h-4 w-4 mr-2" />
            Join Class Now
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};