
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar } from "lucide-react";
import { BillingSchedule } from "@/data/mockData";
import { parseISO } from "date-fns";

interface UpcomingBillingsCardProps {
  upcomingBillings: BillingSchedule[];
  formatCurrency: (amount: number) => string;
  getDaysUntilNextBilling: (dateString: string) => string;
  limit?: number;
}

const UpcomingBillingsCard: React.FC<UpcomingBillingsCardProps> = ({
  upcomingBillings,
  formatCurrency,
  getDaysUntilNextBilling,
  limit = 5
}) => {
  const navigate = useNavigate();
  
  // Sort by date (closest first)
  const sortedBillings = [...upcomingBillings].sort((a, b) => {
    return parseISO(a.nextBillingDate).getTime() - parseISO(b.nextBillingDate).getTime();
  });
  
  // Calculate total upcoming revenue
  const totalUpcoming = upcomingBillings.reduce((sum, billing) => sum + billing.amount, 0);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Upcoming Billings
          </div>
          <Badge variant="secondary" className="ml-2">
            {upcomingBillings.length} upcoming • {formatCurrency(totalUpcoming)} total
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {sortedBillings.length > 0 ? (
            sortedBillings.slice(0, limit).map((schedule) => (
              <div key={schedule.id} className="flex flex-col md:flex-row justify-between gap-4 pb-4 border-b">
                <div>
                  <h3 className="font-medium">{schedule.serviceName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {schedule.clientName} - {schedule.fieldName}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="font-semibold">{formatCurrency(schedule.amount)}</div>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                    <span className="text-muted-foreground mr-2">{schedule.nextBillingDate}</span>
                    <Badge variant="outline" className={`
                      ${getDaysUntilNextBilling(schedule.nextBillingDate) === "Today"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : getDaysUntilNextBilling(schedule.nextBillingDate) === "Tomorrow"
                        ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                        : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                      }
                    `}>
                      {getDaysUntilNextBilling(schedule.nextBillingDate)}
                    </Badge>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-4 text-muted-foreground">No upcoming billings in the next 30 days</p>
          )}
          
          {upcomingBillings.length > limit && (
            <div className="text-center pt-2">
              <Button variant="outline" onClick={() => navigate("/billing-schedules?tab=upcoming")}>
                View All ({upcomingBillings.length})
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingBillingsCard;
