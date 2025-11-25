import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, BookOpen, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '../context/AppContext';
import { tipsAPI } from '../services/api';

export function TipsSection() {
  const { user, dicas, dicasCarregando, atualizarDicas } = useApp();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTip, setSelectedTip] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [newTipTitle, setNewTipTitle] = useState('');
  const [newTipDescription, setNewTipDescription] = useState('');
  const [newTipCategory, setNewTipCategory] = useState('');
  const [newTipContent, setNewTipContent] = useState('');

  if (!user) return null;

  const handleCreateTip = async () => {
  console.log('🔍 [DEBUG FRONTEND] User ANTES de criar:', user);
  
  if (!newTipTitle || !newTipDescription || !newTipCategory || !newTipContent) {
    toast.error('Por favor, preencha todos os campos');
    return;
  }

  // ✅ VALIDAR SE A CATEGORIA É VÁLIDA
  const categoriasValidas = ['finta', 'drible', 'remate', 'defesa', 'táctica'] as const;
  type CategoriaValida = typeof categoriasValidas[number];
  
  if (!categoriasValidas.includes(newTipCategory as CategoriaValida)) {
    toast.error('Categoria inválida');
    return;
  }

  const dadosParaAPI = {
    titulo: newTipTitle,
    descricao: newTipDescription,
    categoria: newTipCategory as CategoriaValida, // ✅ TIPO CORRETO
    conteudo: newTipContent,
    autorId: user?.id,
    autorNome: user?.nome,
    autorTipo: user?.tipo
  };

  console.log('📤 [DEBUG FRONTEND] Dados COMPLETOS para API:', dadosParaAPI);

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
    console.error('❌ [DEBUG FRONTEND] Erro ao criar dica:', error);
    toast.error('Erro ao criar dica');
  } finally {
    setIsSubmitting(false);
  }
};

  const filteredTips = selectedCategory === 'all' 
    ? dicas 
    : dicas.filter((tip: any) => tip.categoria === selectedCategory);

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
      <div className="flex justify-between items-center">
        <div>
          <h2>Dicas Técnicas</h2>
          <p className="text-gray-600">
            Aprenda e partilhe técnicas e conhecimentos
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Dica
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Nova Dica</DialogTitle>
              <DialogDescription>
                Partilhe o seu conhecimento com a comunidade
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tip-title">Título *</Label>
                <Input
                  id="tip-title"
                  placeholder="Ex: Finta 1:1 - Mudança de direção"
                  value={newTipTitle}
                  onChange={(e) => setNewTipTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tip-description">Descrição Curta *</Label>
                <Input
                  id="tip-description"
                  placeholder="Breve descrição da dica..."
                  value={newTipDescription}
                  onChange={(e) => setNewTipDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tip-category">Categoria *</Label>
                <Select value={newTipCategory} onValueChange={setNewTipCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="finta">Fintas</SelectItem>
                    <SelectItem value="drible">Dribles</SelectItem>
                    <SelectItem value="remate">Remates</SelectItem>
                    <SelectItem value="defesa">Defesa</SelectItem>
                    <SelectItem value="táctica">Tácticas</SelectItem>
                  </SelectContent>
                </Select>
                
                {/* ✅ DEBUG VISUAL */}
                <div className="p-2 bg-yellow-100 border border-yellow-300 rounded">
                  <p className="text-sm font-semibold">🔍 DEBUG:</p>
                  <p className="text-sm">Categoria selecionada: <strong>{newTipCategory || "NENHUMA"}</strong></p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tip-content">Conteúdo Detalhado *</Label>
                <Textarea
                  id="tip-content"
                  placeholder="Descreva em detalhe a técnica, passos, pontos importantes..."
                  value={newTipContent}
                  onChange={(e) => setNewTipContent(e.target.value)}
                  rows={10}
                />
                <p className="text-sm text-gray-500">
                  Pode usar **negrito** para destacar pontos importantes
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsCreateDialogOpen(false)} 
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleCreateTip} 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    A criar...
                  </>
                ) : (
                  'Criar Dica'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="finta">Fintas</TabsTrigger>
          <TabsTrigger value="drible">Dribles</TabsTrigger>
          <TabsTrigger value="remate">Remates</TabsTrigger>
          <TabsTrigger value="defesa">Defesa</TabsTrigger>
          <TabsTrigger value="táctica">Tácticas</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          {dicasCarregando ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTips.map((tip: any) => (
                <Card key={tip.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge>{categoryLabels[tip.categoria]}</Badge>
                      <Badge variant="outline">
                        {tip.autorTipo === 'atleta' ? 'Atleta' : 'Treinador'}
                      </Badge>
                    </div>
                    <CardTitle className="line-clamp-2">{tip.titulo}</CardTitle>
                    <CardDescription>
                      por {tip.autorNome}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 line-clamp-3 mb-4">
                      {tip.descricao}
                    </p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setSelectedTip(tip.id)}
                        >
                          <BookOpen className="w-4 h-4 mr-2" />
                          Ler Mais
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <div className="flex gap-2 mb-2">
                            <Badge>{categoryLabels[tip.categoria]}</Badge>
                            <Badge variant="outline">
                              {tip.autorTipo === 'atleta' ? 'Atleta' : 'Treinador'}
                            </Badge>
                          </div>
                          <DialogTitle>{tip.titulo}</DialogTitle>
                          <DialogDescription>
                            por {tip.autorNome} • {tip.criadoEm.toLocaleDateString()}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h3 className="mb-2">Descrição</h3>
                            <p className="text-gray-600">{tip.descricao}</p>
                          </div>
                          <div>
                            <h3 className="mb-4">Conteúdo</h3>
                            <div className="prose prose-sm max-w-none">
                              {tip.conteudo.split('\n').map((line: string, index: number) => {
                                const formattedLine = line.replace(
                                  /\*\*(.*?)\*\*/g,
                                  '<strong>$1</strong>'
                                );
                                return (
                                  <p
                                    key={index}
                                    dangerouslySetInnerHTML={{ __html: formattedLine }}
                                    className="mb-2"
                                  />
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!dicasCarregando && filteredTips.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-gray-500 mb-2">
                Ainda não há dicas nesta categoria
              </h3>
              <p className="text-gray-400 mb-4">
                Seja o primeiro a partilhar uma dica de {categoryLabels[selectedCategory]}!
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Dica
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}