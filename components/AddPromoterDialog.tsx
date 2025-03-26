import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload } from 'lucide-react'
import Image from "next/image"
import { toast } from "@/components/ui/use-toast"
import { usePromoters } from '@/hooks/usePromoters'
import { Textarea } from "@/components/ui/textarea"

export default function AddPromoterDialog({ showDialog, setShowDialog }) {
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [clothingSize, setClothingSize] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [notes, setNotes] = useState("")
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef(null)
  const { addPromoter } = usePromoters()

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

  const handleAdd = async () => {
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
      await addPromoter(name, photoFile, address, clothingSize, phoneNumber, notes)
      
      // Reset form
      setName("")
      setAddress("")
      setClothingSize("")
      setPhoneNumber("")
      setNotes("")
      setPhotoFile(null)
      setPhotoPreview(null)
      setShowDialog(false)
    } catch (error) {
      console.error("Error adding promoter:", error)
      toast({
        title: "Error",
        description: error.message || "Fehler beim Hinzufügen des Promoters.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Neuen Promoter hinzufügen</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="promoterName" className="text-right">
              Name
            </Label>
            <Input
              id="promoterName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="promoterAddress" className="text-right">
              Adresse
            </Label>
            <Input
              id="promoterAddress"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={isSubmitting}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="promoterClothingSize" className="text-right">
              Kleidungsgröße
            </Label>
            <Input
              id="promoterClothingSize"
              value={clothingSize}
              onChange={(e) => setClothingSize(e.target.value)}
              disabled={isSubmitting}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="promoterPhoneNumber" className="text-right">
              Telefonnummer
            </Label>
            <Input
              id="promoterPhoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isSubmitting}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="promoterNotes" className="text-right">
              Notizen
            </Label>
            <Textarea
              id="promoterNotes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isSubmitting}
              className="col-span-3"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="promoterImage" className="text-right">
              Bild
            </Label>
            <div className="col-span-3">
              <Input
                id="promoterImage"
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
                <Upload className="mr-2 h-4 w-4" /> Bild hochladen
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
        <Button onClick={handleAdd} disabled={isSubmitting}>
          {isSubmitting ? "Wird hinzugefügt..." : "Promoter hinzufügen"}
        </Button>
      </DialogContent>
    </Dialog>
  )
}

