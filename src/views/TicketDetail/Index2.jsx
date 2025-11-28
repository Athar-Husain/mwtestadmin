import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CloseTicketModal from './CloseTicketModal';
// import ReassignDrawer from './ReassignDrawer';
import TicketDetails from './TicketDetails';
import AssignmentHistory from './AssignmentHistory';
import PublicComments from './PublicComments';
import PrivateComments from './PrivateComments';

const Index = ({ ticket }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isReassignDrawerOpen, setIsReassignDrawerOpen] = useState(false);

  const isClosedOrResolved = ['closed', 'resolved'].includes(ticket?.status?.toLowerCase());

  return (
    <div className="flex flex-col gap-4">
      {/* Sticky Header */}
      <Card className="sticky top-0 z-30 bg-background border-b border-muted shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
          <div className="flex flex-col">
            <CardTitle className="text-lg font-semibold">
              Ticket #{ticket?._id} — {ticket?.subject}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={ticket?.status === 'open' ? 'success' : ticket?.status === 'pending' ? 'warning' : 'secondary'}>
                {ticket?.status?.toUpperCase()}
              </Badge>
              <span className="text-sm text-muted-foreground">{ticket?.createdAt ? new Date(ticket.createdAt).toLocaleString() : ''}</span>
            </div>
          </div>

          <div className="flex gap-2">
            {!isClosedOrResolved && (
              <>
                <Button variant="outline" size="sm" onClick={() => setIsReassignDrawerOpen(true)}>
                  Reassign
                </Button>
                <Button variant="destructive" size="sm" onClick={() => setIsCloseModalOpen(true)}>
                  Close Ticket
                </Button>
              </>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Ticket Details + Assignment History Tabs */}
      <Card className="shadow-sm">
        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full flex justify-start border-b">
            <TabsTrigger value="details">Ticket Details</TabsTrigger>
            <TabsTrigger value="assignments">Assignment History</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="p-4">
            <TicketDetails ticket={ticket} />
          </TabsContent>

          <TabsContent value="assignments" className="p-4">
            <AssignmentHistory assignments={ticket?.assignmentHistory || []} />
          </TabsContent>
        </Tabs>
      </Card>

      {/* Public + Private Comments */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Public Comments</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[60vh] overflow-y-auto">
            <PublicComments ticketId={ticket?._id} disabled={isClosedOrResolved} />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Private Comments</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[60vh] overflow-y-auto">
            <PrivateComments ticketId={ticket?._id} disabled={isClosedOrResolved} />
          </CardContent>
        </Card>
      </div>

      {/* Modals / Drawers */}
      <CloseTicketModal open={isCloseModalOpen} onOpenChange={setIsCloseModalOpen} ticket={ticket} />
      {/* <ReassignDrawer open={isReassignDrawerOpen} onOpenChange={setIsReassignDrawerOpen} ticket={ticket} /> */}
    </div>
  );
};

export default Index;
