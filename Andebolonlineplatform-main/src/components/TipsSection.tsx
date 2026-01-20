import { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent } from './ui/tabs';
import { Plus, BookOpen, Loader2, Trash2, Lightbulb, LayoutGrid, Flame, MoveHorizontal, Target, Shield, Map as MapIcon, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '../context/AppContext';
import { tipsAPI } from '../services/api';
import { LoadingWave } from './ui/LoadingWave';
import { TipDisplay } from '../types';

export function TipsSection() {
  const { user, dicas, dicasCarregando, atualizarDicas } = useApp();

  // Estados de UI
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados do Formulário de Criação
  const [newTipTitle, setNewTipTitle] = useState('');
  const [newTipDescription, setNewTipDescription] = useState('');
  const [newTipCategory, setNewTipCategory] = useState('');
  const [newTipContent, setNewTipContent] = useState('');

  // Estados de Edição
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTipId, setEditingTipId] = useState<string | null>(null);
  const [editTipTitle, setEditTipTitle] = useState('');
  const [editTipDescription, setEditTipDescription] = useState('');
  const [editTipCategory, setEditTipCategory] = useState('');
  const [editTipContent, setEditTipContent] = useState('');

  if (!user) return null;

  // ✅ 1. Lógica de Permissões (ACL)
  const canModifyTip = (tip: TipDisplay) => {
    if (user.tipo === 'admin' || user.tipo === 'root') return true;
    return tip.autorId.toString() === user.id.toString();
  };

  // ✅ 2. Criar Nova Dica
  const handleCreateTip = async () => {
    if (!newTipTitle || !newTipDescription || !newTipCategory || !newTipContent) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    const categoriasValidas = ['finta', 'drible', 'remate', 'defesa', 'táctica'] as const;
    if (!categoriasValidas.includes(newTipCategory as any)) {
      toast.error('Categoria inválida');
      return;
    }

    const dadosParaAPI = {
      titulo: newTipTitle,
      descricao: newTipDescription,
      categoria: newTipCategory as any,
      conteudo: newTipContent,
      autorId: user.id,
      autorNome: user.nome,
      autorTipo: user.tipo as 'atleta' | 'treinador',
      equipa: user.equipa || 'Sem Equipa'
    };

    setIsSubmitting(true);
    try {
      await tipsAPI.create(dadosParaAPI);
      await atualizarDicas();
      setIsCreateDialogOpen(false);

      // Limpar formulário
      setNewTipTitle('');
      setNewTipDescription('');
      setNewTipCategory('');
      setNewTipContent('');

      toast.success('Dica criada com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar dica');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ 3. Apagar Dica
  const handleDeleteTip = async (tipId: string) => {
    if (!confirm('Tem a certeza que deseja eliminar esta dica?')) return;

    setIsSubmitting(true);
    try {
      await tipsAPI.delete(tipId);
      await atualizarDicas();
      toast.success('Dica eliminada com sucesso');
    } catch (error) {
      toast.error('Erro ao eliminar a dica');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (tip: TipDisplay) => {
    setEditingTipId(tip.id);
    setEditTipTitle(tip.titulo);
    setEditTipDescription(tip.descricao);
    setEditTipCategory(tip.categoria);
    setEditTipContent(tip.conteudo);
    setIsEditDialogOpen(true);
  };

  const handleUpdateTip = async () => {
    if (!editingTipId || !editTipTitle || !editTipDescription || !editTipCategory || !editTipContent) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    setIsSubmitting(true);
    try {
      await tipsAPI.update(editingTipId, {
        titulo: editTipTitle,
        descricao: editTipDescription,
        categoria: editTipCategory as any,
        conteudo: editTipContent
      });
      await atualizarDicas();
      setIsEditDialogOpen(false);
      setEditingTipId(null);
      toast.success('Dica atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar dica:', error);
      toast.error('Erro ao atualizar dica');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ 4. Filtragem
  const filteredTips = useMemo(() => {
    if (selectedCategory === 'all') return dicas;
    return dicas.filter((tip: TipDisplay) => tip.categoria === selectedCategory);
  }, [dicas, selectedCategory]);

  const categoryLabels: Record<string, string> = {
    all: 'Todas',
    finta: 'Fintas',
    drible: 'Dribles',
    remate: 'Remates',
    defesa: 'Defesa',
    táctica: 'Tácticas'
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dicas Técnicas</h2>
          <p className="text-gray-600">Aprenda e partilhe técnicas e conhecimentos</p>
        </div>
        {user.tipo !== 'admin' && user.tipo !== 'root' && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-create-play w-full sm:w-auto h-auto">
                <Plus className="w-5 h-5 mr-3" />
                Nova Dica
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Criar Nova Dica</DialogTitle>
                <DialogDescription>Partilhe o seu conhecimento técnico</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Título *</Label>
                    <Input
                      placeholder="Ex: Mudança de direção"
                      value={newTipTitle}
                      onChange={(e) => setNewTipTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Categoria *</Label>
                    <Select value={newTipCategory} onValueChange={setNewTipCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="finta">Fintas</SelectItem>
                        <SelectItem value="drible">Dribles</SelectItem>
                        <SelectItem value="remate">Remates</SelectItem>
                        <SelectItem value="defesa">Defesa</SelectItem>
                        <SelectItem value="táctica">Tácticas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Descrição Curta *</Label>
                  <Input
                    placeholder="Resumo rápido da técnica..."
                    value={newTipDescription}
                    onChange={(e) => setNewTipDescription(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Conteúdo Detalhado *</Label>
                  <Textarea
                    placeholder="Explicação passo a passo..."
                    rows={8}
                    value={newTipContent}
                    onChange={(e) => setNewTipContent(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleCreateTip} disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Publicar Dica
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* TABS DE CATEGORIA - ESTILO CUSTOMIZADO */}
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="tips-filter-container">
          {[
            { id: 'all', label: 'Todas', icon: LayoutGrid },
            { id: 'finta', label: 'Fintas', icon: Flame },
            { id: 'drible', label: 'Dribles', icon: MoveHorizontal },
            { id: 'remate', label: 'Remates', icon: Target },
            { id: 'defesa', label: 'Defesa', icon: Shield },
            { id: 'táctica', label: 'Tácticas', icon: MapIcon },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className="tips-filter-button"
              data-state={selectedCategory === cat.id ? 'active' : 'inactive'}
            >
              <cat.icon className="tips-filter-icon" />
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        {/* Usamos a TabsList escondida para manter o funcionamento do componente Tabs do Shadcn se necessário, 
              ou simplesmente removemos e usamos apenas o selectedCategory para controlar os conteúdos */}

        <TabsContent value={selectedCategory} className="mt-6">
          {dicasCarregando ? (
            <div className="flex justify-center py-12"><LoadingWave /></div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {filteredTips.map((tip: TipDisplay) => (
                <div key={tip.id} className="play-tip-card">
                  <div className="play-tip-content">
                    <div className="flex justify-between items-start w-full">
                      <div className="flex gap-2">
                        <Badge className="bg-white/20 text-white hover:bg-white/30 border-none capitalize">{tip.categoria}</Badge>
                        <Badge variant="outline" className="text-[10px] text-white border-white/40">
                          {tip.autorTipo}
                        </Badge>
                      </div>

                      {canModifyTip(tip) && (
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClick(tip)}
                            disabled={isSubmitting}
                            className="text-white hover:bg-white/20 h-8 w-8 p-0"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTip(tip.id)}
                            className="h-8 w-8 p-0 text-white hover:bg-white/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    <h3 className="text-xl font-bold mt-3 line-clamp-1">{tip.titulo}</h3>
                    <p className="text-sm text-blue-100">por {tip.autorNome} • {tip.equipa}</p>

                    <p className="play-tip-para line-clamp-3 italic flex-1 py-2">
                      "{tip.descricao}"
                    </p>

                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="btn-details w-full group">
                          <BookOpen className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                          Ver Detalhes
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                        <DialogHeader>
                          <div className="flex gap-2 mb-2">
                            <Badge className="capitalize">{tip.categoria}</Badge>
                            <span className="text-xs text-gray-400">
                              {new Date(tip.criadoEm).toLocaleDateString()}
                            </span>
                          </div>
                          <DialogTitle className="text-2xl">{tip.titulo}</DialogTitle>
                          <DialogDescription className="text-gray-500">
                            Detalhes técnicos e instruções para {tip.titulo}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6 py-4">
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <h4 className="font-semibold text-blue-900 mb-1">Resumo</h4>
                            <p className="text-blue-800 text-sm">{tip.descricao}</p>
                          </div>
                          <div>
                            <h4 className="font-bold text-lg mb-3 flex items-center">
                              <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                              Explicação Técnica
                            </h4>
                            <div className="prose prose-blue max-w-none text-gray-700 whitespace-pre-wrap">
                              {tip.conteudo}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!dicasCarregando && filteredTips.length === 0 && (
            <div className="text-center py-20 border-2 border-dashed rounded-xl">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Sem dicas nesta categoria</h3>
              <p className="text-gray-500">Seja o primeiro a partilhar conhecimento de {categoryLabels[selectedCategory]}!</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Dica</DialogTitle>
            <DialogDescription>Atualize o seu conhecimento técnico</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Título *</Label>
                <Input
                  placeholder="Ex: Mudança de direção"
                  value={editTipTitle}
                  onChange={(e) => setEditTipTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Categoria *</Label>
                <Select value={editTipCategory} onValueChange={setEditTipCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="finta">Fintas</SelectItem>
                    <SelectItem value="drible">Dribles</SelectItem>
                    <SelectItem value="remate">Remates</SelectItem>
                    <SelectItem value="defesa">Defesa</SelectItem>
                    <SelectItem value="táctica">Tácticas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Descrição Curta *</Label>
              <Input
                placeholder="Resumo rápido da técnica..."
                value={editTipDescription}
                onChange={(e) => setEditTipDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Conteúdo Detalhado *</Label>
              <Textarea
                placeholder="Explicação passo a passo..."
                rows={8}
                value={editTipContent}
                onChange={(e) => setEditTipContent(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleUpdateTip} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Guardar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}