import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormDialogProps<T> {
  title: string;
  fields: {
    key: keyof T;
    label: string;
    type: string;
  }[];
  onSubmit: (data: Partial<T>) => void;
  triggerButton: React.ReactNode;
  initialData?: Partial<T>;
}

interface FormDialogState<T> {
  formData: Partial<T>;
  open: boolean;
}

class FormDialog<T> extends React.Component<FormDialogProps<T>, FormDialogState<T>> {
  constructor(props: FormDialogProps<T>) {
    super(props);
    this.state = {
      formData: props.initialData || {},
      open: false
    };
  }

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    this.props.onSubmit(this.state.formData);
    this.setState({ formData: {}, open: false });
  }

  handleChange = (key: keyof T, value: string) => {
    this.setState(prevState => ({
      formData: { ...prevState.formData, [key]: value }
    }));
  }

  setOpen = (open: boolean) => {
    this.setState({ open });
  }

  render() {
    const { title, fields, triggerButton } = this.props;
    const { formData, open } = this.state;

    return (
      <Dialog open={open} onOpenChange={this.setOpen}>
        <DialogTrigger asChild>
          {triggerButton}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <form onSubmit={this.handleSubmit} className="space-y-4">
            {fields.map(field => (
              <div key={field.key as string}>
                <Label htmlFor={field.key as string}>{field.label}</Label>
                <Input
                  id={field.key as string}
                  type={field.type}
                  value={formData[field.key] as string || ''}
                  onChange={(e) => this.handleChange(field.key, e.target.value)}
                />
              </div>
            ))}
            <Button type="submit">Salvar</Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
}

export { FormDialog };