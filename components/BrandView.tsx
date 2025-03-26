import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import BrandList from './BrandList'
import ItemList from './ItemList'
import AddBrandDialog from './AddBrandDialog'
import AddItemDialog from './AddItemDialog'
import { useBrands } from '@/hooks/useBrands'
import { useRouter } from 'next/navigation'

export default function BrandView({
  selectedBrand,
  setSelectedBrand,
  selectedItem,
  setSelectedItem,
  promoters, 
  setPromoters, 
  promoterItems,
  setPromoterItems
}) {
  const [showAddBrandDialog, setShowAddBrandDialog] = useState(false)
  const [showAddItemDialog, setShowAddItemDialog] = useState(false)
  const router = useRouter();
  
  const { brands, loading: brandsLoading } = useBrands();
  
  const handleBackToBrands = () => {
    setSelectedBrand(null);
    setSelectedItem(null);
    // Update URL to remove query parameters
    router.push('/inventory');
  };
  
  return (
    <>
      {selectedBrand ? (
        <>
          <div className="flex gap-4 mb-4">
            <Button onClick={handleBackToBrands}>Zurück zu Marken</Button>
            <Button onClick={() => setShowAddItemDialog(true)}>Neuer Artikel</Button>
          </div>
          <ItemList
            brandId={selectedBrand.id}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            promoters={promoters}
            setPromoters={setPromoters}
            promoterItems={promoterItems}
            setPromoterItems={setPromoterItems}
          />
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Marken</h2>
          </div>
          <BrandList
            brands={brands}
            loading={brandsLoading}
            onBrandClick={(brandId) => {
              const brand = brands.find(b => b.id === brandId);
              if (brand) {
                setSelectedBrand(brand);
              }
            }}
          />
        </>
      )}

      {showAddBrandDialog && (
        <AddBrandDialog
          setShowAddBrandDialog={setShowAddBrandDialog}
        />
      )}

      <AddItemDialog
        showDialog={showAddItemDialog && selectedBrand !== null}
        setShowDialog={setShowAddItemDialog}
        brandId={selectedBrand?.id || ''}
      />
    </>
  );
}

