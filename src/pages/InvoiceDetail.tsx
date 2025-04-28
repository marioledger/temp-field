
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Download, Send, Receipt, FileText, Mail, Printer } from "lucide-react";
import { 
  getInvoiceById, 
  getPaymentsByInvoice, 
  Invoice, 
  Payment 
} from "@/data/mockData";
import InvoiceStatusBadge from "@/components/invoices/InvoiceStatusBadge";
import { format } from "date-fns";

const InvoiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [invoice, setInvoice] = useState<Invoice | undefined>(undefined);
  const [payments, setPayments] = useState<Payment[]>([]);
  
  useEffect(() => {
    if (id) {
      const foundInvoice = getInvoiceById(id);
      setInvoice(foundInvoice);
      
      if (foundInvoice) {
        const invoicePayments = getPaymentsByInvoice(foundInvoice.id);
        setPayments(invoicePayments);
      }
    }
  }, [id]);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BAM',
      minimumFractionDigits: 2,
    }).format(amount);
  };
  
  const handleSendInvoice = () => {
    toast({
      title: "Invoice sent",
      description: "The invoice has been sent to the client.",
    });
  };
  
  const handlePrintInvoice = () => {
    toast({
      title: "Feature in development",
      description: "Printing invoices will be available soon.",
    });
  };
  
  const handleDownloadPdf = () => {
    toast({
      title: "Feature in development",
      description: "Downloading invoice PDFs will be available soon.",
    });
  };
  
  const handleRecordPayment = () => {
    toast({
      title: "Feature in development",
      description: "Recording payments will be available soon.",
    });
  };
  
  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold mb-4">Invoice Not Found</h1>
        <p className="text-muted-foreground mb-6">The invoice you're looking for doesn't exist or has been deleted.</p>
        <Button onClick={() => navigate("/invoices")}>Back to Invoices</Button>
      </div>
    );
  }
  
  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const balance = invoice.total - totalPaid;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" className="mr-2" onClick={() => navigate("/invoices")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Invoices
        </Button>
      </div>
      
      {/* Invoice Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
        <div>
          <h1 className="text-3xl font-bold">{invoice.invoiceNumber}</h1>
          <div className="flex items-center mt-2">
            <InvoiceStatusBadge status={invoice.status} />
            <span className="text-muted-foreground ml-4">
              {new Date(invoice.issueDate) <= new Date() ? "Issued" : "Will be issued"} on {invoice.issueDate}
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {invoice.status === "draft" && (
            <Button onClick={handleSendInvoice}>
              <Send className="mr-2 h-4 w-4" />
              Send Invoice
            </Button>
          )}
          <Button variant="outline" onClick={handlePrintInvoice}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" onClick={handleDownloadPdf}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          {['sent', 'overdue'].includes(invoice.status) && (
            <Button variant="outline" onClick={handleRecordPayment}>
              <Receipt className="mr-2 h-4 w-4" />
              Record Payment
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Payment Summary */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-xl">Payment Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Amount</span>
              <span className="font-semibold">{formatCurrency(invoice.total)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Paid Amount</span>
              <span className="font-semibold text-green-600">{formatCurrency(totalPaid)}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Balance Due</span>
              <span className="font-bold text-xl">{formatCurrency(balance)}</span>
            </div>
            
            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-2">Due Date</p>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">{invoice.dueDate}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Invoice Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl">Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Bill To</h3>
                <p className="text-muted-foreground">{invoice.clientName}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Invoice Information</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Invoice Number:</span>
                    <span>{invoice.invoiceNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Issue Date:</span>
                    <span>{invoice.issueDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Due Date:</span>
                    <span>{invoice.dueDate}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Invoice Items */}
            <div>
              <h3 className="font-medium mb-2">Items</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.quantity * item.unitPrice)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="mt-4 flex flex-col items-end">
                <div className="w-full sm:w-60 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(invoice.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax ({invoice.taxRate}%)</span>
                    <span>{formatCurrency(invoice.taxAmount)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(invoice.total)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {invoice.notes && (
              <div>
                <h3 className="font-medium mb-2">Notes</h3>
                <p className="text-sm text-muted-foreground">{invoice.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Payments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell className="capitalize">{payment.method.replace('_', ' ')}</TableCell>
                    <TableCell>{payment.reference || '-'}</TableCell>
                    <TableCell className="text-right">{formatCurrency(payment.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-6 text-muted-foreground">No payments recorded yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceDetail;
