"use client";

import { useState, useRef, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload } from 'lucide-react'
import Image from "next/image"
import { BrandWithItemCount } from '@/hooks/useBrands'

interface EditBrandDialogProps {
  brand: BrandWithItemCount;
  setEditingBrand: (brand: BrandWithItemCount | null) => void;
  onUpdate: (id: string, name: string, logoFile?: File) => Promise<BrandWithItemCount>;
}

export default function EditBrandDialog({ brand, setEditingBrand, onUpdate }: EditBrandDialogProps) {
  const [editedName, setEditedName] = useState(brand.name)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setEditedName(brand.name)
    setPreviewUrl(null)
    setLogoFile(null)
  }, [brand])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setPreviewUrl(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleUpdate = async () => {
    if (editedName.trim() === '') return;
    
    try {
      setIsSubmitting(true)
      await onUpdate(brand.id, editedName, logoFile || undefined)
      setEditingBrand(null)
    } catch (error) {
      console.error('Error updating brand:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={!!brand} onOpenChange={(open) => !open && setEditingBrand(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Marke bearbeiten</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="editBrandName" className="text-right">
              Name
            </Label>
            <Input
              id="editBrandName"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="editBrandLogo" className="text-right">
              Logo
            </Label>
            <div className="col-span-3">
              <Input
                id="editBrandLogo"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
              />
              <Button 
                onClick={() => fileInputRef.current?.click()} 
                className="w-full"
                type="button"
              >
                <Upload className="mr-2 h-4 w-4" /> Neues Logo hochladen
              </Button>
            </div>
          </div>
          <div className="mt-2 flex justify-center">
            {(previewUrl || brand.logo_url) && (
              <Image
                src={previewUrl || brand.logo_url || '/placeholder-logo.png'}
                alt="Vorschau"
                width={100}
                height={100}
                className="object-contain"
              />
            )}
          </div>
        </div>
        <Button 
          onClick={handleUpdate} 
          disabled={isSubmitting || editedName.trim() === ''}
        >
          {isSubmitting ? 'Wird gespeichert...' : 'Änderungen speichern'}
        </Button>
      </DialogContent>
    </Dialog>
  )
}

