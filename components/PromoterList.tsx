import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreVertical, Edit, Trash, EyeOff, History, Pin } from 'lucide-react'
import Image from "next/image"
import EditPromoterDialog from './EditPromoterDialog'
import PromoterHistoryDialog from './PromoterHistoryDialog'
import InactiveConfirmDialog from './InactiveConfirmDialog'
import { usePinned } from '../hooks/usePinned'
import { Skeleton } from './ui/skeleton'

export default function PromoterList({ 
promoters, 
loading,
setSelectedPromoter, 
promoterItems, 
setPromoterItems, 
transactionHistory, 
setTransactionHistory,
items,
onToggleActive,
onDelete,
onUpdate
}) {
  const [editingPromoter, setEditingPromoter] = useState(null)
  const [showHistoryDialog, setShowHistoryDialog] = useState(false)
  const [selectedPromoterHistory, setSelectedPromoterHistory] = useState(null)
  const [showInactiveConfirmDialog, setShowInactiveConfirmDialog] = useState(false)
  const [inactivePromoter, setInactivePromoter] = useState(null)
  const { sortedItems: sortedPromoters, togglePin, isPinned } = usePinned(promoters, 'promoter');

  const handleEdit = (promoter) => {
    setEditingPromoter(promoter)
  }

  const handleDelete = async (id) => {
    try {
      await onDelete(id);
      // PromoterItems will be updated via the parent component
      setPromoterItems(promoterItems.filter(item => item.promoterId !== id))
    } catch (error) {
      console.error('Error deleting promoter:', error);
    }
  }

  const handleToggleInactive = (promoter) => {
    if (promoter.is_active && promoterItems.filter(item => item.promoterId === promoter.id).length > 0) {
      setInactivePromoter(promoter)
      setShowInactiveConfirmDialog(true)
    } else {
      togglePromoterStatus(promoter.id)
    }
  }

  const togglePromoterStatus = async (id) => {
    try {
      const promoter = promoters.find(p => p.id === id);
      if (promoter) {
        await onToggleActive(id);
      }
    } catch (error) {
      console.error('Error toggling promoter status:', error);
    }
  }

  const handleTogglePin = (id) => {
    togglePin(id);
  }

  const handleShowHistory = (promoter) => {
    setSelectedPromoterHistory(promoter)
    setShowHistoryDialog(true)
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
        {sortedPromoters.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">Keine Promoter gefunden. Fügen Sie einen neuen Promoter hinzu.</p>
          </div>
        ) : sortedPromoters.map((promoter) => (
          <Card key={promoter.id} className={`overflow-hidden cursor-pointer ${!promoter.is_active ? 'opacity-50' : ''}`} onClick={() => setSelectedPromoter(promoter.name)}>
            <div className="relative">
              <Image
                src={promoter.photo_url || '/placeholder.svg'}
                alt={promoter.name}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
              {isPinned(promoter.id) && (
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
                    <DropdownMenuItem onSelect={() => handleEdit(promoter)}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Bearbeiten</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleDelete(promoter.id)}>
                      <Trash className="mr-2 h-4 w-4" />
                      <span>Löschen</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleToggleInactive(promoter)}>
                      <EyeOff className="mr-2 h-4 w-4" />
                      <span>{promoter.is_active ? 'Inaktiv setzen' : 'Aktiv setzen'}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleShowHistory(promoter)}>
                      <History className="mr-2 h-4 w-4" />
                      <span>Verlauf</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleTogglePin(promoter.id)}>
                      <Pin className="mr-2 h-4 w-4" />
                      <span>{isPinned(promoter.id) ? 'Entpinnen' : 'Pinnen'}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg text-center">{promoter.name}</h3>
              <p className="text-sm text-center text-gray-500">
                Artikel: {promoterItems.filter(item => item.promoterId === promoter.id).length}
                {promoter.transactionCount > 0 && ` | Transaktionen: ${promoter.transactionCount}`}
              </p>
              {promoter.phone_number && (
                <p className="text-sm text-center text-gray-500 mt-1">
                  Tel: {promoter.phone_number}
                </p>
              )}
              {promoter.clothing_size && (
                <p className="text-sm text-center text-gray-500 mt-1">
                  Größe: {promoter.clothing_size}
                </p>
              )}
              <Button 
                variant="outline" 
                className="w-full mt-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleShowHistory(promoter);
                }}
              >
                <History className="mr-2 h-4 w-4" />
                Verlauf
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {editingPromoter && (
        <EditPromoterDialog
          promoter={editingPromoter}
          setEditingPromoter={setEditingPromoter}
          onUpdate={onUpdate}
        />
      )}
      {showHistoryDialog && (
        <PromoterHistoryDialog
          promoter={selectedPromoterHistory}
          transactionHistory={transactionHistory}
          setShowHistoryDialog={setShowHistoryDialog}
          items={items}
        />
      )}
      <InactiveConfirmDialog
        showDialog={showInactiveConfirmDialog}
        setShowDialog={setShowInactiveConfirmDialog}
        promoter={inactivePromoter}
        onConfirm={() => {
          if (inactivePromoter) {
            togglePromoterStatus(inactivePromoter.id)
            setInactivePromoter(null)
          }
        }}
      />
    </>
  )
}

