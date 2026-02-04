import { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Plus, MessageCircle, Trash2, Video, Search, ExternalLink, Loader2, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '../context/AppContext';
import { playsAPI } from '../services/api';
import { PlayDisplay, CommentDisplay } from '../types';
import { LoadingWave } from './ui/LoadingWave';

export function PlaysSection() {
  const { user, jogadas, jogadasCarregando, atualizarJogadas } = useApp();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [newPlayTitle, setNewPlayTitle] = useState('');
  const [newPlayDescription, setNewPlayDescription] = useState('');
  const [newPlayCategory, setNewPlayCategory] = useState('');
  const [newPlayVideoUrl, setNewPlayVideoUrl] = useState('');
  const [videoOption, setVideoOption] = useState<'url' | 'upload'>('url');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Edit states
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPlayId, setEditingPlayId] = useState<string | null>(null);
  const [editPlayTitle, setEditPlayTitle] = useState('');
  const [editPlayDescription, setEditPlayDescription] = useState('');
  const [editPlayCategory, setEditPlayCategory] = useState('');
  const [editPlayVideoUrl, setEditPlayVideoUrl] = useState('');
  const [editVideoOption, setEditVideoOption] = useState<'url' | 'upload'>('url');
  const [editSelectedFile, setEditSelectedFile] = useState<File | null>(null);

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
      let videoUrl = 'https://example.com/video.mp4';

      if (videoOption === 'url' && newPlayVideoUrl) {
        videoUrl = newPlayVideoUrl;
      }

      // ✅ ENVIAR FICHEIRO PARA API
      await playsAPI.create({
        titulo: newPlayTitle,
        descricao: newPlayDescription,
        urlVideo: videoUrl,
        autorId: user.id,
        autorNome: user.nome,
        autorTipo: convertUserType(user.tipo),
        equipa: user.equipa!,
        categoria: newPlayCategory
      }, selectedFile || undefined); // ← Passar ficheiro como segundo parâmetro

      await atualizarJogadas();
      setIsCreateDialogOpen(false);
      setNewPlayTitle('');
      setNewPlayDescription('');
      setNewPlayCategory('');
      setNewPlayVideoUrl('');
      setSelectedFile(null);
      setVideoOption('url');
      toast.success('Jogada criada com sucesso!');
    } catch (error) {
      console.error('Erro ao criar jogada:', error);
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

  const handleEditClick = (play: PlayDisplay) => {
    setEditingPlayId(play.id);
    setEditPlayTitle(play.titulo);
    setEditPlayDescription(play.descricao);
    setEditPlayCategory(play.categoria);
    setEditPlayVideoUrl(play.urlVideo || '');
    setEditVideoOption(play.urlVideo?.startsWith('http') ? 'url' : 'upload'); // Simple heuristic
    setIsEditDialogOpen(true);
  };

  const handleUpdatePlay = async () => {
    if (!editingPlayId || !editPlayTitle || !editPlayDescription || !editPlayCategory) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setIsSubmitting(true);
    try {
      let videoUrl = editPlayVideoUrl;

      // Se o utilizador escolheu URL mas não mudou, mantém o original (que já está no state)

      await playsAPI.update(editingPlayId, {
        titulo: editPlayTitle,
        descricao: editPlayDescription,
        categoria: editPlayCategory,
        urlVideo: videoUrl
      }, editSelectedFile || undefined);

      await atualizarJogadas();
      setIsEditDialogOpen(false);
      setEditingPlayId(null);
      setEditSelectedFile(null);
      toast.success('Jogada atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar jogada:', error);
      toast.error('Erro ao atualizar jogada');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canModifyPlay = (play: PlayDisplay) => {
    // Admin pode apagar qualquer jogada
    if (user.tipo === 'admin' || user.tipo === 'root') return true;

    // Dono da jogada pode apagar
    if (play.autorId.toString() === user.id.toString()) return true;

    // Treinador só pode apagar jogadas da sua equipa
    if (user.tipo === 'treinador' && play.equipa === user.equipa) return true;

    return false;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <br />
          <h2 className="text-2xl font-bold">Jogadas</h2>
          <p className="text-gray-600">
            Partilhe e comente jogadas com a comunidade
          </p>
        </div>
        {user.tipo !== 'admin' && user.tipo !== 'root' && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-create-play w-auto h-auto py-2 sm:py-2.5 px-4 sm:px-6 rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95 text-xs sm:text-base">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Nova Jogada</span>
                <span className="sm:hidden">Nova</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="jogada-btn">
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
                  <Label>Vídeo (opcional)</Label>
                  <div className="flex gap-2 mb-3">
                    <Button
                      type="button"
                      variant={videoOption === 'url' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setVideoOption('url')}
                    >
                      URL
                    </Button>
                    <Button
                      type="button"
                      variant={videoOption === 'upload' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setVideoOption('upload')}
                    >
                      Upload
                    </Button>
                  </div>
                  {videoOption === 'url' ? (
                    <Input
                      id="play-video"
                      type="url"
                      placeholder="https://..."
                      value={newPlayVideoUrl}
                      onChange={(e) => setNewPlayVideoUrl(e.target.value)}
                    />
                  ) : (
                    <div className="space-y-2">
                      <Input
                        id="play-file"
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setSelectedFile(file);
                        }}
                      />
                      {selectedFile && (
                        <p className="text-sm text-gray-600">
                          Ficheiro selecionado: {selectedFile.name}
                        </p>
                      )}
                    </div>
                  )}
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
        )}
      </div>

      {/* Search Bar */}
      {/* Search Bar - Custom Twitter Style */}
      <form className="twitter-search-form" onSubmit={(e) => e.preventDefault()}>
        <label className="twitter-search-label" htmlFor="search">
          <input
            className="twitter-search-input"
            type="text"
            required
            placeholder="Pesquisar jogadas..."
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="twitter-search-fancy-bg"></div>
          <div className="twitter-search-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <g>
                <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-3.365-7.5-7.5-7.5z"></path>
              </g>
            </svg>
          </div>
          <button
            className="twitter-search-close-btn"
            type="button"
            onClick={() => setSearchQuery('')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </button>
        </label>
      </form>

      {jogadasCarregando ? (
        <div className="flex justify-center items-center py-12">
          <LoadingWave />
        </div>
      ) : (
        <div
          className="grid w-full"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            columnGap: '2.5rem',
            rowGap: '3.5rem',
            justifyItems: 'start'
          }}
        >
          {filteredPlays.map((play: PlayDisplay) => {
            return (
              <div key={play.id} className="play-tip-card">
                <div className="play-tip-content">
                  <div className="flex justify-between items-start w-full">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold leading-tight line-clamp-2">{play.titulo}</h3>
                      <p className="text-sm text-blue-100 mt-1">
                        por {play.autorNome} • {play.equipa}
                      </p>
                    </div>
                    {canModifyPlay(play) && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(play)}
                          disabled={isSubmitting}
                          className="text-white hover:bg-white/20 h-8 w-8 p-0"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePlay(play.id)}
                          disabled={isSubmitting}
                          className="text-white hover:bg-white/20 h-8 w-8 p-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Badge className="bg-white/20 text-white hover:bg-white/30 border-none">{play.categoria}</Badge>
                    <Badge variant="outline" className="text-white border-white/40">
                      {play.autorTipo === 'atleta' ? 'Atleta' : 'Treinador'}
                    </Badge>
                  </div>

                  <div className="w-full mt-2">
                    <VideoPreview url={play.urlVideo} />
                  </div>

                  <p className="play-tip-para line-clamp-3 flex-1">{play.descricao}</p>

                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        className="btn-details w-full mt-2"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Ver Detalhes ({play.comentarios.length})
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-xl sm:text-2xl">{play.titulo}</DialogTitle>
                        <DialogDescription>
                          por {play.autorNome} • {play.equipa} • {play.criadoEm.toLocaleDateString()}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <VideoPlayer url={play.urlVideo} />
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
                              className="w-full sm:w-auto sm:px-8 mx-auto"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  A publicar...
                                </>
                              ) : (
                                'Publicar'
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
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
          {user.tipo !== 'admin' && user.tipo !== 'root' && (
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeira Jogada
            </Button>
          )}
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="jogada-btn">
          <DialogHeader>
            <DialogTitle>Editar Jogada</DialogTitle>
            <DialogDescription>
              Atualize as informações da sua jogada
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-play-title">Título *</Label>
              <Input
                id="edit-play-title"
                placeholder="Ex: Contra-ataque rápido..."
                value={editPlayTitle}
                onChange={(e) => setEditPlayTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-play-description">Descrição *</Label>
              <Textarea
                id="edit-play-description"
                placeholder="Descreva a jogada..."
                value={editPlayDescription}
                onChange={(e) => setEditPlayDescription(e.target.value)}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-play-category">Categoria *</Label>
              <Select value={editPlayCategory} onValueChange={setEditPlayCategory}>
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
              <Label>Vídeo (opcional)</Label>
              <div className="flex gap-2 mb-3">
                <Button
                  type="button"
                  variant={editVideoOption === 'url' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setEditVideoOption('url')}
                >
                  URL
                </Button>
                <Button
                  type="button"
                  variant={editVideoOption === 'upload' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setEditVideoOption('upload')}
                >
                  Upload
                </Button>
              </div>
              {editVideoOption === 'url' ? (
                <Input
                  id="edit-play-video"
                  type="url"
                  placeholder="https://..."
                  value={editPlayVideoUrl}
                  onChange={(e) => setEditPlayVideoUrl(e.target.value)}
                />
              ) : (
                <div className="space-y-2">
                  <Input
                    id="edit-play-file"
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setEditSelectedFile(file);
                    }}
                  />
                  {editSelectedFile && (
                    <p className="text-sm text-gray-600">
                      Ficheiro selecionado: {editSelectedFile.name}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button onClick={handleUpdatePlay} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  A guardar...
                </>
              ) : (
                'Guardar Alterações'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Componente para preview de vídeo no card
function VideoPreview({ url }: { url: string }) {
  const isYouTube = url?.includes('youtube.com') || url?.includes('youtu.be');
  const isLocalFile = url?.startsWith('local:');
  const isExampleUrl = url?.includes('example.com');
  const isValidUrl = url && url !== 'default.mp4' && (url.startsWith('http') || url.startsWith('/storage')) && !isExampleUrl;

  if (isYouTube) {
    const videoId = url.includes('youtube.com')
      ? url.split('v=')[1]?.split('&')[0] || url.split('/shorts/')[1]?.split('?')[0]
      : url.split('youtu.be/')[1]?.split('?')[0];

    return (
      <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-4">
        <img
          src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
          alt="YouTube thumbnail"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  if (isLocalFile) {
    return (
      <div className="aspect-video bg-green-50 rounded-lg flex items-center justify-center mb-4">
        <div className="text-center">
          <Video className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-xs text-green-600">Vídeo local</p>
        </div>
      </div>
    );
  }

  if (isExampleUrl) {
    return (
      <div className="aspect-video bg-blue-50 rounded-lg flex items-center justify-center mb-4">
        <div className="text-center">
          <Video className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="text-xs text-blue-600">Ficheiro carregado</p>
        </div>
      </div>
    );
  }

  if (isValidUrl) {
    return (
      <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4 relative group">
        <video
          className="w-full h-full object-cover"
          src={url}
          muted
          playsInline
          preload="metadata"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
          <Video className="w-10 h-10 text-white drop-shadow-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center mb-4">
      <Video className="w-12 h-12 text-gray-400" />
    </div>
  );
}

// Componente para player de vídeo completo
function VideoPlayer({ url }: { url: string }) {
  const isYouTube = url?.includes('youtube.com') || url?.includes('youtu.be');
  const isLocalFile = url?.startsWith('local:');
  const isExampleUrl = url?.includes('example.com');
  const isValidUrl = url && url !== 'default.mp4' && (url.startsWith('http') || url.startsWith('/storage')) && !isExampleUrl;

  if (isYouTube) {
    let embedUrl = '';
    if (url.includes('youtube.com/shorts/')) {
      const videoId = url.split('/shorts/')[1]?.split('?')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtube.com')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }

    return (
      <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
        <iframe
          src={embedUrl}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (isLocalFile) {
    const parts = url.split(':');
    const fileName = parts[1] || 'video.mp4';
    const blobUrl = parts.slice(2).join(':'); // Reconstroir URL completo

    console.log('🎥 [VIDEO DEBUG]', { url, parts, fileName, blobUrl });

    if (!blobUrl || blobUrl === '') {
      return (
        <div className="space-y-3 mb-4">
          <div className="aspect-video bg-red-50 rounded-lg flex items-center justify-center border-2 border-red-300">
            <div className="text-center p-6">
              <Video className="w-16 h-16 text-red-600 mx-auto mb-3" />
              <p className="text-lg font-medium text-red-800 mb-2">Erro no Vídeo</p>
              <p className="text-sm text-red-600">{fileName}</p>
              <p className="text-xs text-red-500 mt-2">URL blob inválido</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-3 mb-4">
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          <video
            controls
            className="w-full h-full"
            src={blobUrl}
            onError={(e) => console.error('❌ Vídeo erro:', e)}
            onLoadStart={() => console.log('🔄 Vídeo a carregar...')}
            onCanPlay={() => console.log('✅ Vídeo pronto!')}
          >
            O seu browser não suporta vídeo HTML5.
          </video>
        </div>
        <div className="text-center">
          <p className="text-sm text-green-600">
            🎥 {fileName}
          </p>
        </div>
      </div>
    );
  }

  if (isExampleUrl) {
    const fileName = url.split('/').pop() || 'ficheiro.mp4';
    return (
      <div className="space-y-3 mb-4">
        <div className="aspect-video bg-blue-50 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-300">
          <div className="text-center p-6">
            <Video className="w-16 h-16 text-blue-600 mx-auto mb-3" />
            <p className="text-lg font-medium text-blue-800 mb-2">Ficheiro Carregado</p>
            <p className="text-sm text-blue-600 mb-4">{fileName}</p>
            <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                ⚠️ Upload de ficheiros ainda não implementado.<br />
                Use URLs do YouTube por agora.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isValidUrl) {
    return (
      <div className="space-y-3 mb-4">
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          <video
            controls
            className="w-full h-full"
            src={url}
          >
            O seu browser não suporta vídeo HTML5.
          </video>
        </div>
        <div className="flex justify-center">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
          >
            <ExternalLink className="w-3 h-3" />
            Abrir em novo separador
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center mb-4">
      <div className="text-center text-gray-500">
        <Video className="w-16 h-16 mx-auto mb-2" />
        <p>Sem vídeo disponível</p>
      </div>
    </div>
  );
}