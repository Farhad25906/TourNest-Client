import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { HostToursTable } from "@/components/module/Tour/HostToursTable";
import HostTourStats from "@/components/module/Tour/HostTourStats";
import { getMyTours, getMyTourStats } from "@/services/tour/tour.service";
import DashboardPageHeader from "@/components/module/Dashboard/DashboardPageHeader";
import { ShieldCheck } from "lucide-react"; // Assuming ShieldCheck is needed for the icon prop

async function ToursContent() {
  const [toursResponse, statsResponse] = await Promise.all([
    getMyTours(),
    getMyTourStats()
  ]);
  console.log(toursResponse);


  const tours = toursResponse?.data || [];
  const stats = statsResponse?.data || null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <DashboardPageHeader
        title="Expedition Fleet"
        subtitle="Manage and monitor your active tour inventory"
        icon={ShieldCheck}
        badge="Inventory Live"
      />

      {stats && <HostTourStats stats={stats} />}

      <Card>
        <CardHeader>
          <CardTitle>All Tours</CardTitle>
          <CardDescription>
            View, edit, and manage all your tour listings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HostToursTable tours={tours} />
        </CardContent>
      </Card>
    </div>
  );
}

export default function HostToursPage() {
  return (
    <div className="container mx-auto py-6">
      <Suspense fallback={<TableSkeleton columnCount={8} rowCount={10} />}>
        <ToursContent />
      </Suspense>
    </div>
  );
}