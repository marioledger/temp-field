
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { format, parseISO, isAfter, isBefore, startOfMonth, endOfMonth } from "date-fns";
import { invoices, payments } from "@/data/mockData";

interface FinancialData {
  month: string;
  invoiced: number;
  collected: number;
  name: string;
}

const FinancialOverview: React.FC = () => {
  // Get last 6 months of data
  const getFinancialData = () => {
    const today = new Date();
    const data: FinancialData[] = [];
    
    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(today.getMonth() - i);
      
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      const monthName = format(date, "MMM");
      const monthYear = format(date, "MMM yyyy");
      
      // Calculate invoiced amount for the month
      const invoicedAmount = invoices
        .filter((invoice) => {
          const invoiceDate = parseISO(invoice.issueDate);
          return !isBefore(invoiceDate, monthStart) && !isAfter(invoiceDate, monthEnd);
        })
        .reduce((sum, invoice) => sum + invoice.total, 0);
      
      // Calculate collected amount for the month
      const collectedAmount = payments
        .filter((payment) => {
          const paymentDate = parseISO(payment.date);
          return !isBefore(paymentDate, monthStart) && !isAfter(paymentDate, monthEnd);
        })
        .reduce((sum, payment) => sum + payment.amount, 0);
      
      data.push({
        month: monthName,
        name: monthYear,
        invoiced: invoicedAmount,
        collected: collectedAmount,
      });
    }
    
    return data;
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BAM',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const financialData = getFinancialData();
  
  // Calculate totals
  const totalInvoiced = financialData.reduce((sum, month) => sum + month.invoiced, 0);
  const totalCollected = financialData.reduce((sum, month) => sum + month.collected, 0);
  const collectionRate = totalInvoiced > 0 ? Math.round((totalCollected / totalInvoiced) * 100) : 0;
  
  // Custom tooltip to make it look better
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border rounded-md shadow-md">
          <p className="font-medium">{payload[0].payload.name}</p>
          <p className="text-sm">
            <span className="text-blue-600">Invoiced: </span> 
            {formatCurrency(payload[0].value)}
          </p>
          <p className="text-sm">
            <span className="text-green-600">Collected: </span> 
            {formatCurrency(payload[1].value)}
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Financial Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm">Total Invoiced</p>
            <p className="text-2xl font-bold">{formatCurrency(totalInvoiced)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm">Total Collected</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalCollected)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm">Collection Rate</p>
            <p className="text-2xl font-bold">{collectionRate}%</p>
          </div>
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={financialData}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <XAxis dataKey="month" />
              <YAxis 
                tickFormatter={(value) => `${formatCurrency(value)}`}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="invoiced" name="Invoiced" fill="#9b87f5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="collected" name="Collected" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialOverview;
