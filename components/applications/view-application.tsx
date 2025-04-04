import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface ViewApplicationProps {
  coverLetter: string;
  cvPath: string;
}

export default function ViewApplication({
  coverLetter,
  cvPath,
}: ViewApplicationProps) {
  const [isPdf, setIsPdf] = useState(false);

  useEffect(() => {
    if (cvPath && cvPath.toLowerCase().endsWith(".pdf")) {
      setIsPdf(true);
    }
  }, [cvPath]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Application Details</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 mt-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Cover Letter</h3>
            <div className="p-4 bg-muted rounded-md">
              {coverLetter ? (
                <p className="whitespace-pre-line">{coverLetter}</p>
              ) : (
                <p className="text-muted-foreground">
                  No cover letter provided
                </p>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">CV / Resume</h3>
            {cvPath ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button asChild variant="outline">
                    <Link
                      href={cvPath}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View CV
                    </Link>
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Click to view the full document
                  </p>
                </div>

                {isPdf && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">PDF Preview</h4>
                    <div className="border rounded-md overflow-hidden">
                      <iframe
                        src={`${cvPath}#toolbar=0&scrollbar=0`}
                        className="w-full h-96 overflow-hidden"
                        style={{
                          scrollbarWidth: "none",
                          msOverflowStyle: "none",
                        }}
                        title="CV Preview"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Preview shows first page only. Click "View CV" for full
                      document.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">No CV uploaded</p>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
