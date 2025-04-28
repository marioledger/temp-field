
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Download, 
  Send, 
  Receipt, 
  FileText, 
  Mail, 
  Printer, 
  Calendar,
  Clock,
  History,
  CheckCircle2,
} from "lucide-react";
import { 
  getInvoiceById, 
  getPaymentsByInvoice, 
  Invoice, 
  Payment 
} from "@/data/mockData";
import InvoiceStatusBadge from "@/components/invoices/InvoiceStatusBadge";
import { format, parseISO, addDays } from "date-fns";

const InvoiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [invoice, setInvoice] = useState<Invoice | undefined>(undefined);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [activeTab, setActiveTab] = useState("details");
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<string>("bank_transfer");
  const [paymentReference, setPaymentReference] = useState("");
  
  useEffect(() => {
    if (id) {
      const foundInvoice = getInvoiceById(id);
      setInvoice(foundInvoice);
      
      if (foundInvoice) {
        const invoicePayments = getPaymentsByInvoice(foundInvoice.id);
        setPayments(invoicePayments);
        
        // If there's an outstanding balance, prefill the payment amount
        const totalPaid = invoicePayments.reduce((sum, payment) => sum + payment.amount, 0);
        const balance = foundInvoice.total - totalPaid;
        setPaymentAmount(balance.toString());
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
      title: "Invoice printing",
      description: "The invoice is being prepared for printing.",
    });
  };
  
  const handleDownloadPdf = () => {
    toast({
      title: "PDF download started",
      description: "Your invoice PDF is being generated.",
    });
  };
  
  const handleRecordPayment = () => {
    setShowPaymentDialog(true);
  };
  
  const submitPayment = () => {
    toast({
      title: "Payment recorded",
      description: `Payment of ${formatCurrency(parseFloat(paymentAmount))} has been recorded.`,
    });
    setShowPaymentDialog(false);
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
  
  // Calculate due date information
  const dueDate = parseISO(invoice.dueDate);
  const today = new Date();
  const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
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
            <Button variant="default" onClick={handleRecordPayment}>
              <Receipt className="mr-2 h-4 w-4" />
              Record Payment
            </Button>
          )}
        </div>
      </div>
      
      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="details">Invoice Details</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>
        
        {/* Invoice Details Tab */}
        <TabsContent value="details" className="space-y-6">
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
                
                <div className="bg-muted p-3 rounded-md mt-2">
                  <div className="flex items-center text-sm font-medium mb-1">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Due {invoice.dueDate}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      {daysUntilDue > 0
                        ? `Due in ${daysUntilDue} days`
                        : daysUntilDue === 0
                        ? "Due today"
                        : `Overdue by ${Math.abs(daysUntilDue)} days`}
                    </span>
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
        </TabsContent>
        
        {/* Payment History Tab */}
        <TabsContent value="payments">
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
                    {balance > 0 && ['sent', 'overdue'].includes(invoice.status) && (
                      <TableRow className="bg-muted/50">
                        <TableCell colSpan={3} className="font-medium">Outstanding Balance</TableCell>
                        <TableCell className="text-right font-semibold">{formatCurrency(balance)}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                    <Receipt className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No payments recorded yet</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                    There are no payments recorded for this invoice. Record a payment when you receive it.
                  </p>
                  {['sent', 'overdue'].includes(invoice.status) && (
                    <Button onClick={handleRecordPayment}>
                      <Receipt className="mr-2 h-4 w-4" />
                      Record Payment
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Timeline Tab */}
        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Invoice Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Create Event */}
                <div className="flex">
                  <div className="mr-4 flex flex-col items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="h-full w-px bg-border"></div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">Invoice Created</h3>
                      <span className="text-xs text-muted-foreground">
                        {format(parseISO(invoice.issueDate), "MMM d, yyyy")}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Invoice #{invoice.invoiceNumber} was created.
                    </p>
                  </div>
                </div>
                
                {/* Send Event - if applicable */}
                {invoice.status !== "draft" && (
                  <div className="flex">
                    <div className="mr-4 flex flex-col items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
                        <Mail className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div className="h-full w-px bg-border"></div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">Invoice Sent</h3>
                        <span className="text-xs text-muted-foreground">
                          {format(parseISO(invoice.issueDate), "MMM d, yyyy")}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Invoice was sent to {invoice.clientName}.
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Payment Events */}
                {payments.map((payment, index) => (
                  <div className="flex" key={payment.id}>
                    <div className="mr-4 flex flex-col items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                        <Receipt className="h-4 w-4 text-green-600" />
                      </div>
                      {index < payments.length - 1 || invoice.status !== "paid" ? (
                        <div className="h-full w-px bg-border"></div>
                      ) : null}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">Payment Received</h3>
                        <span className="text-xs text-muted-foreground">
                          {format(parseISO(payment.date), "MMM d, yyyy")}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Payment of {formatCurrency(payment.amount)} received via {payment.method.replace('_', ' ')}.
                        {payment.reference && ` Reference: ${payment.reference}`}
                      </p>
                    </div>
                  </div>
                ))}
                
                {/* Paid Event - if applicable */}
                {invoice.status === "paid" && (
                  <div className="flex">
                    <div className="mr-4 flex flex-col items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">Invoice Paid</h3>
                        <span className="text-xs text-muted-foreground">
                          {format(parseISO(payments[payments.length - 1].date), "MMM d, yyyy")}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Invoice was marked as fully paid.
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Due Date - if not paid */}
                {invoice.status !== "paid" && (
                  <div className="flex">
                    <div className="mr-4 flex flex-col items-center">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full 
                        ${daysUntilDue < 0 
                          ? "bg-red-100" 
                          : daysUntilDue <= 3 
                          ? "bg-amber-100" 
                          : "bg-blue-100"}`}
                      >
                        <Calendar className={`h-4 w-4 
                          ${daysUntilDue < 0 
                            ? "text-red-600" 
                            : daysUntilDue <= 3 
                            ? "text-amber-600" 
                            : "text-blue-600"}`} 
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">Payment Due</h3>
                        <span className="text-xs text-muted-foreground">
                          {format(parseISO(invoice.dueDate), "MMM d, yyyy")}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {daysUntilDue > 0
                          ? `Payment due in ${daysUntilDue} days.`
                          : daysUntilDue === 0
                          ? "Payment due today."
                          : `Payment is overdue by ${Math.abs(daysUntilDue)} days.`}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Record Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              Record a payment for invoice {invoice.invoiceNumber}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="amount" className="text-right text-sm font-medium">
                Amount
              </label>
              <div className="col-span-3">
                <div className="flex items-center">
                  <span className="mr-2">BAM</span>
                  <input
                    id="amount"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    type="number"
                    min="0.01"
                    step="0.01"
                    max={balance}
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Balance due: {formatCurrency(balance)}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="method" className="text-right text-sm font-medium">
                Method
              </label>
              <select
                id="method"
                className="col-span-3 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cash">Cash</option>
                <option value="credit_card">Credit Card</option>
                <option value="check">Check</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="reference" className="text-right text-sm font-medium">
                Reference
              </label>
              <input
                id="reference"
                className="col-span-3 rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Optional reference number"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Cancel
            </Button>
            <Button onClick={submitPayment} disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}>
              Record Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvoiceDetail;
