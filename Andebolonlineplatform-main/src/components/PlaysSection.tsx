import { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Plus, MessageCircle, Trash2, Loader2, Video, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '../context/AppContext';
import { playsAPI } from '../services/api';
import { PlayDisplay, CommentDisplay } from '../types';

export function PlaysSection() {
  const { user, jogadas, jogadasCarregando, atualizarJogadas } = useApp();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedPlay, setSelectedPlay] = useState<string>('');
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [newPlayTitle, setNewPlayTitle] = useState('');
  const [newPlayDescription, setNewPlayDescription] = useState('');
  const [newPlayCategory, setNewPlayCategory] = useState('');
  const [newPlayVideoUrl, setNewPlayVideoUrl] = useState('');

  const convertUserType = (tipo: string): 'atleta' | 'treinador' => {
    return tipo === 'treinador' ? 'treinador' : 'atleta';
  };

  // Filtered plays based on search query
  const filteredPlays = useMemo(() => {
    if (!searchQuery.trim()) {
      return jogadas || [];
    }
    
    const query = searchQuery.toLowerCase();
    return (jogadas || []).filter((play: PlayDisplay) =>
      play.titulo.toLowerCase().includes(query) ||
      play.descricao.toLowerCase().includes(query) ||
      play.categoria.toLowerCase().includes(query) ||
      play.autorNome.toLowerCase().includes(query)
    );
  }, [jogadas, searchQuery]);

  if (!user) return null;

  const handleCreatePlay = async () => {
    if (!newPlayTitle || !newPlayDescription || !newPlayCategory) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setIsSubmitting(true);
    try {
      await playsAPI.create({
        titulo: newPlayTitle,
        descricao: newPlayDescription,
        urlVideo: newPlayVideoUrl || 'https://example.com/video.mp4',
        autorId: user.id,
        autorNome: user.nome,
        autorTipo: convertUserType(user.tipo),
        equipa: user.equipa!,
        categoria: newPlayCategory
      });

      await atualizarJogadas();
      setIsCreateDialogOpen(false);
      setNewPlayTitle('');
      setNewPlayDescription('');
      setNewPlayCategory('');
      setNewPlayVideoUrl('');
      toast.success('Jogada criada com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar jogada');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddComment = async (playId: string) => {
    if (!newComment.trim()) {
      toast.error('Por favor, escreva um comentário');
      return;
    }

    setIsSubmitting(true);
    try {
      await playsAPI.addComment(playId, {
        jogadaId: playId,
        autorId: user.id,
        autorNome: user.nome,
        autorTipo: convertUserType(user.tipo),
        conteudo: newComment
      });

      await atualizarJogadas();
      setNewComment('');
      toast.success('Comentário adicionado!');
    } catch (error) {
      toast.error('Erro ao adicionar comentário');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ FUNÇÃO CORRIGIDA - COM ACL
  const handleDeletePlay = async (playId: string) => {
    if (!confirm('Tem a certeza que deseja apagar esta jogada?')) {
      return;
    }

    setIsSubmitting(true);
    try {
      await playsAPI.delete(playId);
      await atualizarJogadas();
      setSelectedPlay('');
      toast.success('Jogada apagada com sucesso!');
    } catch (error: any) {
      if (error.response?.status === 403) {
        toast.error('Não tem permissão para apagar esta jogada');
      } else {
        toast.error('Erro ao apagar jogada');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const canModifyPlay = (play: PlayDisplay) => {
  return user.tipo === 'treinador' || play.autorId.toString() === user.id.toString();
};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2>Jogadas</h2>
          <p className="text-gray-600">
            Partilhe e comente jogadas com a comunidade
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Jogada
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Nova Jogada</DialogTitle>
              <DialogDescription>
                Partilhe uma jogada com a comunidade
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="play-title">Título *</Label>
                <Input
                  id="play-title"
                  placeholder="Ex: Contra-ataque rápido..."
                  value={newPlayTitle}
                  onChange={(e) => setNewPlayTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="play-description">Descrição *</Label>
                <Textarea
                  id="play-description"
                  placeholder="Descreva a jogada..."
                  value={newPlayDescription}
                  onChange={(e) => setNewPlayDescription(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="play-category">Categoria *</Label>
                <Select value={newPlayCategory} onValueChange={setNewPlayCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Contra-ataque">Contra-ataque</SelectItem>
                    <SelectItem value="Ataque posicional">Ataque posicional</SelectItem>
                    <SelectItem value="Técnica individual">Técnica individual</SelectItem>
                    <SelectItem value="Defesa">Defesa</SelectItem>
                    <SelectItem value="Transição">Transição</SelectItem>
                    <SelectItem value="Bola parada">Bola parada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="play-video">URL do Vídeo (opcional)</Label>
                <Input
                  id="play-video"
                  type="url"
                  placeholder="https://..."
                  value={newPlayVideoUrl}
                  onChange={(e) => setNewPlayVideoUrl(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button onClick={handleCreatePlay} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    A criar...
                  </>
                ) : (
                  'Criar Jogada'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Pesquisar jogadas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-9"
        />
      </div>

      {jogadasCarregando ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlays.map((play: PlayDisplay) => {
          
          // ✅ DEBUG ADICIONADO AQUI
          console.log('🔍 [DEBUG BOTÃO]', {
            user: {
              id: user.id,
              tipo: user.tipo,
              nome: user.nome
            },
            play: {
              id: play.id,
              autorId: play.autorId, 
              autorNome: play.autorNome
            },
            canModify: canModifyPlay(play),
            isTreinador: user.tipo === 'treinador',
            isOwner: play.autorId === user.id
          });

          return (
            <Card key={play.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="line-clamp-2">{play.titulo}</CardTitle>
                    <CardDescription className="mt-2">
                      por {play.autorNome} • {play.equipa}
                    </CardDescription>
                  </div>
                  {/* ✅ BOTÃO CORRIGIDO - COM ACL */}
                  {canModifyPlay(play) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePlay(play.id)}
                      disabled={isSubmitting}
                      title={user.tipo === 'treinador' ? 'Treinador pode apagar' : 'Apagar minha jogada'}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  )}
                </div>
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary">{play.categoria}</Badge>
                  <Badge variant="outline">
                    {play.autorTipo === 'atleta' ? 'Atleta' : 'Treinador'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                  <Video className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-600 line-clamp-3">{play.descricao}</p>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setSelectedPlay(play.id)}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Ver Detalhes ({play.comentarios.length})
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    {selectedPlay === play.id && (
                      <>
                        <DialogHeader>
                          <DialogTitle>{play.titulo}</DialogTitle>
                          <DialogDescription>
                            por {play.autorNome} • {play.equipa} • {play.criadoEm.toLocaleDateString()}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                            <Video className="w-16 h-16 text-gray-400" />
                          </div>
                          <div>
                            <h3 className="mb-2">Descrição</h3>
                            <p className="text-gray-600">{play.descricao}</p>
                          </div>
                          <Separator />
                          <div>
                            <h3 className="mb-4">
                              Comentários ({play.comentarios.length})
                            </h3>
                            <div className="space-y-4 mb-4">
                              {play.comentarios.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">
                                  Ainda não há comentários. Seja o primeiro!
                                </p>
                              ) : (
                                play.comentarios.map((comment: CommentDisplay) => (
                                  <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex justify-between items-start mb-2">
                                      <div>
                                        <span>{comment.autorNome}</span>
                                        <Badge variant="outline" className="ml-2">
                                          {comment.autorTipo === 'atleta' ? 'Atleta' : 'Treinador'}
                                        </Badge>
                                      </div>
                                      <span className="text-sm text-gray-500">
                                        {comment.criadoEm.toLocaleDateString()}
                                      </span>
                                    </div>
                                    <p className="text-gray-700">{comment.conteudo}</p>
                                  </div>
                                ))
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label>Adicionar Comentário</Label>
                              <Textarea
                                placeholder="Escreva o seu comentário..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                rows={3}
                              />
                              <Button
                                onClick={() => handleAddComment(play.id)}
                                className="w-full"
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    A publicar...
                                  </>
                                ) : (
                                  'Publicar Comentário'
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          );
        })}
        </div>
      )}

      {!jogadasCarregando && jogadas.length === 0 && (
        <div className="text-center py-12">
          <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-500 mb-2">Ainda não há jogadas</h3>
          <p className="text-gray-400 mb-4">
            Seja o primeiro a partilhar uma jogada!
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Criar Primeira Jogada
          </Button>
        </div>
      )}

      {!jogadasCarregando && jogadas.length > 0 && filteredPlays.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-500 mb-2">Nenhuma jogada encontrada</h3>
          <p className="text-gray-400 mb-4">
            Tente pesquisar com outros termos
          </p>
          <Button variant="outline" onClick={() => setSearchQuery('')}>
            Limpar Pesquisa
          </Button>
        </div>
      )}
    </div>
  );  
}