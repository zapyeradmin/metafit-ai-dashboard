
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type UserFormProps = {
  open: boolean,
  onOpenChange: (open: boolean) => void,
  initial?: Partial<{ id: string, full_name: string, email: string, is_active: boolean, phone?: string, address?: string, role?: string }>,
  onSave: (data: { id?: string, full_name: string, email: string, password?: string, is_active?: boolean, phone?: string, address?: string, role?: string }) => void
};

const UserForm: React.FC<UserFormProps> = ({ open, onOpenChange, initial, onSave }) => {
  const [form, setForm] = useState({
    full_name: initial?.full_name ?? "",
    email: initial?.email ?? "",
    is_active: initial?.is_active ?? true,
    password: "",
    phone: initial?.phone ?? "",
    address: initial?.address ?? "",
    role: initial?.role ?? "user"
  });

  React.useEffect(() => {
    if (initial) {
      setForm({
        full_name: initial.full_name ?? "",
        email: initial.email ?? "",
        is_active: initial.is_active ?? true,
        password: "",
        phone: initial.phone ?? "",
        address: initial.address ?? "",
        role: initial.role ?? "user"
      });
    } else {
      setForm({ full_name: "", email: "", is_active: true, password: "", phone: "", address: "", role: "user" });
    }
  }, [initial, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial && initial.id ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-3"
          onSubmit={e => {
            e.preventDefault();
            onSave({
              id: initial?.id,
              full_name: form.full_name,
              email: form.email,
              password: form.password.length > 3 ? form.password : undefined,
              is_active: form.is_active,
              phone: form.phone,
              address: form.address,
              role: form.role,
            });
          }}
        >
          <div>
            <Label>Nome</Label>
            <Input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} required />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required disabled={!!initial?.id} />
          </div>
          {!initial?.id && (
            <div>
              <Label>Senha (mínimo 4 caracteres)</Label>
              <Input type="password" value={form.password} minLength={4} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
            </div>
          )}
          <div>
            <Label>Telefone</Label>
            <Input type="text" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          </div>
          <div>
            <Label>Endereço</Label>
            <Input type="text" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
          </div>
          <div>
            <Label>Papel</Label>
            <Input type="text" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} id="active-box" />
            <Label htmlFor="active-box">Usuário Ativo</Label>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserForm;
