
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  getInvoicesByStatus, 
  invoices, 
  payments, 
  getUpcomingBillings,
  getPaidTotal,
  getOutstandingTotal
} from "@/data/mockData";
import { format, parseISO, isWithinInterval, subDays } from "date-fns";

const DashboardFinancials: React.FC = () => {
  const navigate = useNavigate();
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BAM',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Recent activity - last 30 days
  const thirtyDaysAgo = subDays(new Date(), 30);
  
  const recentInvoices = invoices
    .filter(inv => {
      const invoiceDate = parseISO(inv.issueDate);
      return isWithinInterval(invoiceDate, { 
        start: thirtyDaysAgo, 
        end: new Date() 
      });
    })
    .sort((a, b) => 
      parseISO(b.issueDate).getTime() - parseISO(a.issueDate).getTime()
    );
  
  const recentPayments = payments
    .filter(pay => {
      const paymentDate = parseISO(pay.date);
      return isWithinInterval(paymentDate, { 
        start: thirtyDaysAgo, 
        end: new Date() 
      });
    })
    .sort((a, b) => 
      parseISO(b.date).getTime() - parseISO(a.date).getTime()
    );
  
  const upcomingBillings = getUpcomingBillings(7);
  const overdueBillings = getInvoicesByStatus("overdue");
  
  // Summary data
  const totalInvoiced = recentInvoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalCollected = recentPayments.reduce((sum, pay) => sum + pay.amount, 0);
  const outstanding = getOutstandingTotal();
  
  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Financial Overview</CardTitle>
        <Button variant="outline" size="sm" onClick={() => navigate("/invoices")}>
          View All Invoices
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">30-Day Invoiced</div>
            <div className="text-2xl font-bold">{formatCurrency(totalInvoiced)}</div>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">30-Day Collected</div>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalCollected)}</div>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Outstanding</div>
            <div className="text-2xl font-bold text-amber-600">{formatCurrency(outstanding)}</div>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Overdue Invoices</div>
            <div className="text-2xl font-bold text-red-600">{overdueBillings.length}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div>
            <h3 className="font-medium text-lg mb-3">Recent Activity</h3>
            {recentInvoices.length === 0 && recentPayments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent financial activity</p>
            ) : (
              <div className="space-y-3">
                {/* Show most recent 3 actions, mix of invoices and payments */}
                {[...recentInvoices.map(inv => ({ 
                  type: 'invoice', 
                  date: inv.issueDate, 
                  amount: inv.total,
                  client: inv.clientName,
                  id: inv.id,
                  number: inv.invoiceNumber
                })), 
                ...recentPayments.map(pay => ({
                  type: 'payment',
                  date: pay.date,
                  amount: pay.amount,
                  client: pay.clientName,
                  id: pay.id,
                  number: pay.invoiceNumber
                }))].sort((a, b) => 
                  parseISO(b.date).getTime() - parseISO(a.date).getTime()
                ).slice(0, 4).map((item, index) => (
                  <div key={`${item.type}-${item.id}`} className={`
                    flex justify-between items-center p-2 rounded-md
                    ${item.type === 'invoice' ? "hover:bg-blue-50/50" : "hover:bg-green-50/50"} 
                    cursor-pointer
                  `} onClick={() => navigate(`/invoices/${item.id}`)}>
                    <div>
                      <p className="font-medium">
                        {item.type === 'invoice' ? 'Invoice Created' : 'Payment Received'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.client} • {format(parseISO(item.date), "MMM d, yyyy")}
                      </p>
                    </div>
                    <div className={`text-right ${item.type === 'payment' ? "text-green-600" : ""}`}>
                      {item.type === 'payment' ? '+ ' : ''}{formatCurrency(item.amount)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Coming Up */}
          <div>
            <h3 className="font-medium text-lg mb-3">Coming Up</h3>
            <div className="space-y-3">
              {upcomingBillings.length === 0 ? (
                <p className="text-sm text-muted-foreground">No upcoming billings in the next 7 days</p>
              ) : (
                upcomingBillings.slice(0, 4).map((billing) => (
                  <div key={billing.id} className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50 cursor-pointer" onClick={() => navigate("/billing-schedules")}>
                    <div>
                      <p className="font-medium">{billing.serviceName}</p>
                      <p className="text-xs text-muted-foreground">
                        {billing.clientName} • {billing.nextBillingDate}
                      </p>
                    </div>
                    <div className="text-right">{formatCurrency(billing.amount)}</div>
                  </div>
                ))
              )}
              
              {overdueBillings.length > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-red-600">Overdue Invoices</h4>
                    <span className="text-xs text-red-600 font-medium">{overdueBillings.length} total</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => navigate("/invoices?status=overdue")}
                  >
                    View Overdue Invoices
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardFinancials;
