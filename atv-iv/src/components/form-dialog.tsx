import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FormDialogProps<T> {
  title: string
  fields: {
    key: keyof T
    label: string
    type: string
  }[]
  onSubmit: (data: Partial<T>) => void
  triggerButton: React.ReactNode
  initialData?: Partial<T>
}

export function FormDialog<T>({ title, fields, onSubmit, triggerButton, initialData = {} }: FormDialogProps<T>) {
  const [formData, setFormData] = useState<Partial<T>>(initialData)
  const [open, setOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({})
    setOpen(false)
  }

  const handleChange = (key: keyof T, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(field => (
            <div key={field.key as string}>
              <Label htmlFor={field.key as string}>{field.label}</Label>
              <Input
                id={field.key as string}
                type={field.type}
                value={formData[field.key] as string || ''}
                onChange={(e) => handleChange(field.key, e.target.value)}
              />
            </div>
          ))}
          <Button type="submit">Salvar</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}