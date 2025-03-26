"use client";

import { useState, useRef, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload } from 'lucide-react'
import Image from "next/image"
import { toast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"

export default function EditPromoterDialog({ promoter, setEditingPromoter, onUpdate }) {
  const [name, setName] = useState(promoter?.name || '')
  const [address, setAddress] = useState(promoter?.address || '')
  const [clothingSize, setClothingSize] = useState(promoter?.clothing_size || '')
  const [phoneNumber, setPhoneNumber] = useState(promoter?.phone_number || '')
  const [notes, setNotes] = useState(promoter?.notes || '')
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(promoter?.photo_url || null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (promoter) {
      setName(promoter.name)
      setAddress(promoter.address || '')
      setClothingSize(promoter.clothing_size || '')
      setPhoneNumber(promoter.phone_number || '')
      setNotes(promoter.notes || '')
      setPhotoPreview(promoter.photo_url)
    }
  }, [promoter])

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setPhotoFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => setPhotoPreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleUpdate = async () => {
    if (!name) {
      toast({
        title: "Error",
        description: "Bitte geben Sie einen Namen ein.",
        variant: "destructive"
      })
      return
    }
    
    try {
      setIsSubmitting(true)
      await onUpdate(promoter.id, name, photoFile, address, clothingSize, phoneNumber, notes)
      setEditingPromoter(null)
    } catch (error) {
      console.error("Error updating promoter:", error)
      toast({
        title: "Error",
        description: error.message || "Fehler beim Aktualisieren des Promoters.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={!!promoter} onOpenChange={() => setEditingPromoter(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Promoter bearbeiten</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="editPromoterName" className="text-right">
              Name
            </Label>
            <Input
              id="editPromoterName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="editPromoterAddress" className="text-right">
              Adresse
            </Label>
            <Input
              id="editPromoterAddress"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={isSubmitting}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="editPromoterClothingSize" className="text-right">
              Kleidungsgröße
            </Label>
            <Input
              id="editPromoterClothingSize"
              value={clothingSize}
              onChange={(e) => setClothingSize(e.target.value)}
              disabled={isSubmitting}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="editPromoterPhoneNumber" className="text-right">
              Telefonnummer
            </Label>
            <Input
              id="editPromoterPhoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isSubmitting}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="editPromoterNotes" className="text-right">
              Notizen
            </Label>
            <Textarea
              id="editPromoterNotes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isSubmitting}
              className="col-span-3"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="editPromoterImage" className="text-right">
              Bild
            </Label>
            <div className="col-span-3">
              <Input
                id="editPromoterImage"
                type="file"
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
              />
              <Button 
                onClick={() => fileInputRef.current.click()} 
                className="w-full"
                disabled={isSubmitting}
              >
                <Upload className="mr-2 h-4 w-4" /> Neues Bild hochladen
              </Button>
            </div>
          </div>
          {photoPreview && (
            <div className="mt-2">
              <Image
                src={photoPreview}
                alt="Vorschau"
                width={100}
                height={100}
                className="object-contain"
              />
            </div>
          )}
        </div>
        <Button onClick={handleUpdate} disabled={isSubmitting}>
          {isSubmitting ? "Wird gespeichert..." : "Änderungen speichern"}
        </Button>
      </DialogContent>
    </Dialog>
  )
}

