import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import PromoterList from './PromoterList'
import PromoterItemList from './PromoterItemList'
import AddPromoterDialog from './AddPromoterDialog'
import { usePromoters } from '@/hooks/usePromoters'
import { getPromoterInventory } from '@/lib/api/promoters'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from 'lucide-react'
import PromoterHistoryDialog from './PromoterHistoryDialog'
import { useRouter } from 'next/navigation'

export default function PromoterView({
  promoterItems, setPromoterItems,
  selectedPromoter, setSelectedPromoter, selectedItem, setSelectedItem,
  items, setItems
}) {
  const [showAddPromoterDialog, setShowAddPromoterDialog] = useState(false)
  const [showHistoryDialog, setShowHistoryDialog] = useState(false)
  const [promoterInventory, setPromoterInventory] = useState([])
  const [inventoryLoading, setInventoryLoading] = useState(false)
  const { promoters, loading, toggleActive, removePromoter, updatePromoterDetails } = usePromoters();
  const router = useRouter();

  // Find the selected promoter object from its name
  const selectedPromoterObj = selectedPromoter ? promoters.find(p => p.name === selectedPromoter) : null;

  // Fetch promoter inventory when a promoter is selected
  useEffect(() => {
    const fetchInventory = async () => {
      if (selectedPromoterObj?.id) {
        try {
          setInventoryLoading(true);
          console.log('Fetching inventory for promoter:', selectedPromoterObj.id);
          const inventory = await getPromoterInventory(selectedPromoterObj.id);
          console.log('Received promoter inventory:', inventory);
          setPromoterInventory(inventory);
        } catch (error) {
          console.error('Error fetching promoter inventory:', error);
        } finally {
          setInventoryLoading(false);
        }
      }
    };

    if (selectedPromoterObj) {
      fetchInventory();
    } else {
      setPromoterInventory([]);
    }
  }, [selectedPromoterObj]);

  const handleShowHistory = () => {
    setShowHistoryDialog(true);
  };

  const handleBackToPromoters = () => {
    setSelectedPromoter(null);
    setSelectedItem(null);
    // Update URL to remove query parameters
    router.push('/inventory');
    // Ensure we're in promoters view mode
    if (typeof window !== 'undefined') {
      // Add a small delay to ensure the router has time to update
      setTimeout(() => {
        console.log('Navigating back to promoters list');
        // Force a page refresh to ensure all state is reset properly
        window.location.href = '/inventory';
      }, 100);
    }
  };

  return (
    <>
      {selectedPromoter ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <Button onClick={handleBackToPromoters}>Zurück zu Promotern</Button>
            <h2 className="text-xl font-semibold">{selectedPromoter}</h2>
            <Button variant="outline" onClick={handleShowHistory}>Verlauf anzeigen</Button>
          </div>

          {/* Display promoter details */}
          {selectedPromoterObj && (
            <div className="border rounded-lg p-4 mb-4 bg-card">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedPromoterObj.address && (
                  <div>
                    <h3 className="font-medium text-sm">Adresse:</h3>
                    <p className="text-sm text-muted-foreground">{selectedPromoterObj.address}</p>
                  </div>
                )}
                {selectedPromoterObj.clothing_size && (
                  <div>
                    <h3 className="font-medium text-sm">Kleidungsgröße:</h3>
                    <p className="text-sm text-muted-foreground">{selectedPromoterObj.clothing_size}</p>
                  </div>
                )}
                {selectedPromoterObj.phone_number && (
                  <div>
                    <h3 className="font-medium text-sm">Telefonnummer:</h3>
                    <p className="text-sm text-muted-foreground">{selectedPromoterObj.phone_number}</p>
                  </div>
                )}
              </div>
              {selectedPromoterObj.notes && (
                <div className="mt-4">
                  <h3 className="font-medium text-sm">Notizen:</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{selectedPromoterObj.notes}</p>
                </div>
              )}
            </div>
          )}

          <Tabs value="inventory" defaultValue="inventory" className="mb-4">
            <TabsList className="w-full">
              <TabsTrigger value="inventory" className="w-full">Aktuelles Inventar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="inventory">
              {inventoryLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : promoterInventory.length > 0 ? (
                <PromoterItemList
                  promoterItems={promoterInventory.map(item => ({
                    id: `${item.item.id}-${item.size.id}`,
                    name: item.item.name,
                    productId: item.item.product_id,
                    image: item.item.image_url || '/placeholder.svg',
                    quantity: item.quantity,
                    size: item.size.size,
                    brand: item.item.brands?.name || 'Unknown',
                    promoterId: selectedPromoterObj?.id
                  }))}
                  setPromoterItems={setPromoterItems}
                  selectedItem={selectedItem}
                  setSelectedItem={setSelectedItem}
                  items={items}
                  setItems={setItems}
                  promoters={promoters}
                />
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Dieser Promoter hat derzeit keine Artikel.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Promoter</h2>
            <Button onClick={() => setShowAddPromoterDialog(true)}>Neuen Promoter hinzufügen</Button>
          </div>
          <PromoterList
            promoters={promoters}
            loading={loading}
            setSelectedPromoter={setSelectedPromoter}
            promoterItems={promoterItems}
            setPromoterItems={setPromoterItems}
            items={items}
            onToggleActive={toggleActive}
            onDelete={removePromoter}
            onUpdate={updatePromoterDetails}
          />
        </>
      )}
      
      <AddPromoterDialog
        showDialog={showAddPromoterDialog}
        setShowDialog={setShowAddPromoterDialog}
      />
      
      {showHistoryDialog && selectedPromoterObj && (
        <PromoterHistoryDialog
          promoter={selectedPromoterObj}
          setShowHistoryDialog={setShowHistoryDialog}
        />
      )}
    </>
  )
}

