
import React, { useEffect, useState } from "react";
import { useAIUserContexts, AIUserContext } from "@/hooks/useAIUserContexts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function AIUserContextsSection() {
  // Recupera o usuário autenticado
  const { user } = useAuth();
  const userId = user?.id;

  // Usa os métodos corretos do hook
  const { fetchContexts, addContext, updateContext, removeContext } = useAIUserContexts(userId);
  const { toast } = useToast();
  const [contexts, setContexts] = useState<AIUserContext[]>([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [titleDraft, setTitleDraft] = useState("");
  const [contentDraft, setContentDraft] = useState("");

  useEffect(() => {
    handleRefresh();
    // eslint-disable-next-line
  }, [userId]);

  async function handleRefresh() {
    setLoading(true);
    try {
      const data = await fetchContexts();
      setContexts(data);
    } catch (err: any) {
      toast({ title: "Erro ao carregar contextos", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  async function handleAddOrEdit() {
    setLoading(true);
    try {
      if (editingId) {
        // Atualiza contexto existente
        const ctx = contexts.find((c) => c.id === editingId);
        if (ctx) {
          await updateContext({
            ...ctx,
            title: titleDraft.trim(),
            content: contentDraft.trim(),
          });
          toast({ title: "Contexto atualizado!" });
        }
      } else {
        // Adiciona novo contexto
        await addContext({
          title: titleDraft.trim(),
          content: contentDraft.trim(),
        } as Omit<AIUserContext, "id" | "created_at" | "updated_at">);
        toast({ title: "Contexto adicionado!" });
      }
      await handleRefresh();
      setTitleDraft("");
      setContentDraft("");
      setEditingId(null);
    } catch (err: any) {
      toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(context: AIUserContext) {
    setEditingId(context.id);
    setTitleDraft(context.title);
    setContentDraft(context.content);
  }

  async function handleDelete(id: string) {
    setLoading(true);
    try {
      await removeContext(id);
      await handleRefresh();
      toast({ title: "Contexto removido!" });
    } catch (err: any) {
      toast({ title: "Erro ao remover", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    setEditingId(null);
    setTitleDraft("");
    setContentDraft("");
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Seus Documentos e Contextos para IA</h3>
      <div className="mb-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddOrEdit();
          }}
          className="flex flex-col md:flex-row items-stretch gap-2"
        >
          <div className="flex-1 flex flex-col gap-2">
            <Input
              placeholder="Título"
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              maxLength={60}
              required
            />
            <Textarea
              placeholder="Conteúdo (prompt, contexto, instruções, regras, exemplos...)"
              value={contentDraft}
              onChange={(e) => setContentDraft(e.target.value)}
              rows={2}
              required
              maxLength={2000}
            />
          </div>
          <div className="flex flex-col gap-2 min-w-[100px] justify-end">
            <Button type="submit" disabled={loading || !titleDraft.trim() || !contentDraft.trim()} className="w-full md:w-auto">
              {editingId ? "Salvar Edição" : "Adicionar"}
            </Button>
            {editingId && (
              <Button type="button" variant="ghost" onClick={handleCancel}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </div>
      <div>
        {contexts.length === 0 ? (
          <div className="text-sm text-gray-500">Nenhum contexto cadastrado ainda.</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {contexts.map((ctx) => (
              <li key={ctx.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex-1">
                  <span className="block font-medium text-gray-900">{ctx.title}</span>
                  <span className="block text-xs text-gray-700 mt-0.5 break-all">{ctx.content}</span>
                </div>
                <div className="flex md:flex-col gap-1 mt-2 md:mt-0 md:ml-6">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(ctx)} disabled={loading}>
                    Editar
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(ctx.id)} disabled={loading}>
                    Excluir
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="text-sm text-gray-600 mt-4">
        Estes textos/documentos serão usados pela IA como contexto adicional ao responder suas perguntas.
      </div>
    </div>
  );
}
