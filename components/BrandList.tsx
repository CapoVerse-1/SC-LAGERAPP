"use client";

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreVertical, Edit, Trash, EyeOff, Pin, Plus } from 'lucide-react'
import Image from "next/image"
import EditBrandDialog from './EditBrandDialog'
import AddBrandDialog from './AddBrandDialog'
import { useBrands, BrandWithItemCount } from '../hooks/useBrands'
import { Skeleton } from './ui/skeleton'

interface BrandListProps {
  onBrandClick: (brandId: string) => void;
  brands?: BrandWithItemCount[];
  loading?: boolean;
}

export default function BrandList({ onBrandClick, brands: propBrands, loading: propLoading }: BrandListProps) {
  const [editingBrand, setEditingBrand] = useState<BrandWithItemCount | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const { 
    brands: hookBrands, 
    loading: hookLoading, 
    toggleActive, 
    togglePinned, 
    removeBrand,
    updateBrandDetails,
    refreshBrands
  } = useBrands();

  // Use props if provided, otherwise use hook values
  const brands = propBrands || hookBrands;
  const loading = propLoading || hookLoading;

  // Log when brands change
  useEffect(() => {
    console.log('BrandList received updated brands:', brands);
  }, [brands]);

  // Refresh brands when the add dialog is closed
  useEffect(() => {
    if (!showAddDialog) {
      console.log('Add dialog closed, refreshing brands');
      refreshBrands();
    }
  }, [showAddDialog, refreshBrands]);

  const handleEdit = (brand: BrandWithItemCount) => {
    setEditingBrand(brand)
  }

  const handleDelete = async (id: string) => {
    await removeBrand(id);
  }

  const handleToggleInactive = async (id: string) => {
    await toggleActive(id);
  }

  const handleTogglePin = async (id: string) => {
    await togglePinned(id);
  }

  const handleAddDialogClose = (shouldRefresh: boolean) => {
    setShowAddDialog(false);
    if (shouldRefresh) {
      console.log('Refreshing brands after adding new brand');
      refreshBrands();
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="w-full h-48" />
            <CardContent className="p-4">
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {brands.length === 0 && !loading ? (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">Keine Marken gefunden. Fügen Sie eine neue Marke hinzu.</p>
          </div>
        ) : (
          brands.map((brand) => (
            <Card 
              key={`brand-${brand.id}`} 
              className={`overflow-hidden cursor-pointer ${!brand.is_active ? 'opacity-50' : ''}`} 
              onClick={() => onBrandClick(brand.id)}
            >
              <div className="relative">
                <Image
                  src={brand.logo_url || '/placeholder-logo.png'}
                  alt={brand.name}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                {brand.is_pinned && (
                  <Pin className="absolute top-2 left-2 h-6 w-6 text-primary" />
                )}
                <div className="absolute top-2 right-2" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => handleEdit(brand)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Bearbeiten</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => handleDelete(brand.id)}>
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Löschen</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => handleToggleInactive(brand.id)}>
                        <EyeOff className="mr-2 h-4 w-4" />
                        <span>{brand.is_active ? 'Inaktiv setzen' : 'Aktiv setzen'}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => handleTogglePin(brand.id)}>
                        <Pin className="mr-2 h-4 w-4" />
                        <span>{brand.is_pinned ? 'Entpinnen' : 'Pinnen'}</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg text-center">{brand.name}</h3>
                <p className="text-sm text-center text-gray-500">Artikel: {brand.itemCount}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      
      {editingBrand && (
        <EditBrandDialog
          brand={editingBrand}
          setEditingBrand={setEditingBrand}
          onUpdate={updateBrandDetails}
        />
      )}
      
      <AddBrandDialog 
        showDialog={showAddDialog} 
        setShowDialog={handleAddDialogClose} 
      />
    </>
  )
}

