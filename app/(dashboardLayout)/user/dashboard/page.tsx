import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

const page = () => {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>

        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Work in Progress</AlertTitle>
            <AlertDescription>
              Dashboard work is currently under process.  
              Please cooperate with us and check other sections.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
