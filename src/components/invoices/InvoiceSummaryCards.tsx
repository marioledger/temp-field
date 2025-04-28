
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface InvoiceSummaryProps {
  totalInvoiced: number;
  totalPaid: number;
  totalOverdue: number;
  formatCurrency: (amount: number) => string;
}

const InvoiceSummaryCards: React.FC<InvoiceSummaryProps> = ({
  totalInvoiced,
  totalPaid,
  totalOverdue,
  formatCurrency
}) => {
  const collectionRate = totalInvoiced > 0 
    ? Math.round((totalPaid / totalInvoiced) * 100)
    : 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="md:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Invoiced
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(totalInvoiced)}
          </div>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Paid
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(totalPaid)}
          </div>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Outstanding Amount
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-600">
            {formatCurrency(totalOverdue)}
          </div>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Collection Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold flex items-baseline gap-2">
              {collectionRate}%
              <span className="text-sm text-muted-foreground font-normal">
                collected
              </span>
            </div>
            <Progress value={collectionRate} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceSummaryCards;
