import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Book,
  Target,
  Calendar,
  PlusCircle,
  MoreVertical,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/DropdownMenu';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import DataTableColumnsVisibilityDemo from '../components/table-11';
import { fetchTopicos } from '@/services/topicosService';
import { fetchMateriaById, Materia } from '@/services/materiasService';
import { useOrganizacao } from '@/contexts/OrganizacaoContext';
import AuthContext from '@/contexts/AuthContext';

interface LearningState {
  summary?: string;
  video_lesson?: string;
  completed_at?: string | null;
}

interface ReviewState {
  last_review_date?: string | null;
  next_review_date?: string | null;
  review_count: number;
}

interface QuestionSession {
  date: string;
  attempted: number;
  correct: number;
}

interface QuestionState {
  total_attempted: number;
  correct_answers: number;
  sessions: QuestionSession[];
}

// Estendendo o tipo base do seu serviço para incluir os controles
interface BaseTopico {
  id: string;
  nome: string;
  // Adicione outros campos necessários do seu modelo base aqui
}

interface Topico extends BaseTopico {
  status: 'not_started' | 'in_progress' | 'completed';
  learning: LearningState;
  review: ReviewState;
  questions: QuestionState;
}

export default function MateriaDetails() {
  const { idMateria = 'materia-simulada-01' } = useParams<{ idMateria: string }>(); // Valor padrão para simulação
  const { userId } = useContext(AuthContext);
  const { activeOrganizacao } = useOrganizacao();

  const [materia, setMateria] = useState<Materia | null>(null);
  const [topicos, setTopicos] = useState<Topico[]>([]);
  const [loading, setLoading] = useState(true);

  const [isQuestionModalOpen, setQuestionModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topico | null>(null);
  const [questionFormData, setQuestionFormData] = useState({ attempted: '', correct: '' });
  const [customAlert, setCustomAlert] = useState<string | null>(null);


  useEffect(() => {
    const loadData = async () => {
      if (!idMateria || !userId || !activeOrganizacao) return;
debugger
      setLoading(true);
      const mat = await fetchMateriaById(activeOrganizacao.id, idMateria);
      setMateria(mat);

      if (mat) {
        const baseTopicos = await fetchTopicos(activeOrganizacao.id, mat.id);

        // Enriquecendo os tópicos com a estrutura de controle padrão
        const enrichedTopicos = baseTopicos.map(t => ({
          ...t,
          status: ((t as unknown) as Topico).status || 'not_started',
          learning: ((t as unknown) as Topico).learning || { completed_at: null },
          review: ((t as unknown) as Topico).review || { review_count: 0 },
          questions: ((t as unknown) as Topico).questions || { total_attempted: 0, correct_answers: 0, sessions: [] },
        }));
        setTopicos(enrichedTopicos);
      }
      setLoading(false);
    };

    loadData();
  }, [idMateria, userId, activeOrganizacao]);

  // --- FUNÇÕES DE LÓGICA E MANIPULAÇÃO DE DADOS ---

  const handleOpenQuestionModal = (topic: Topico) => {
    setSelectedTopic(topic);
    setQuestionFormData({ attempted: '', correct: '' });
    setQuestionModalOpen(true);
  };

  const handleSaveQuestionSession = () => {
    if (!selectedTopic) return;

    const attempted = parseInt(questionFormData.attempted, 10);
    const correct = parseInt(questionFormData.correct, 10);

    if (isNaN(attempted) || isNaN(correct) || attempted <= 0 || correct > attempted) {
      setCustomAlert('Por favor, insira valores válidos. O número de acertos não pode ser maior que o de questões feitas.');
      return;
    }

    const updatedTopicos = topicos.map(t => {
      if (t.id === selectedTopic.id) {
        const newSession: QuestionSession = {
          date: new Date().toISOString(),
          attempted,
          correct,
        };
        const updatedQuestions: QuestionState = {
          ...t.questions,
          total_attempted: t.questions.total_attempted + attempted,
          correct_answers: t.questions.correct_answers + correct,
          sessions: [...t.questions.sessions, newSession],
        };
        // Atualiza o status se for a primeira atividade
        const newStatus = t.status === 'not_started' ? 'in_progress' : t.status;
        return { ...t, questions: updatedQuestions, status: newStatus };
      }
      return t;
    });

    setTopicos(updatedTopicos);
    // TODO: Adicionar chamada para salvar no backend (Firestore)
    setQuestionModalOpen(false);
  };
  
  const handleMarkAsReviewed = (topicId: string) => {
      const reviewIntervals = [1, 7, 15, 30, 60]; // Dias para a próxima revisão
      
      const updatedTopicos = topicos.map(t => {
          if (t.id === topicId) {
              const today = new Date();
              const currentReviewCount = t.review.review_count || 0;
              const nextInterval = reviewIntervals[Math.min(currentReviewCount, reviewIntervals.length - 1)];
              
              const nextReviewDate = new Date(today);
              nextReviewDate.setDate(today.getDate() + nextInterval);

              const updatedReview: ReviewState = {
                  ...t.review,
                  last_review_date: today.toISOString().split('T')[0],
                  next_review_date: nextReviewDate.toISOString().split('T')[0],
                  review_count: currentReviewCount + 1,
              };
               const newStatus = t.status === 'not_started' ? 'in_progress' : t.status;
              return { ...t, review: updatedReview, status: newStatus };
          }
          return t;
      });
      setTopicos(updatedTopicos);
      // TODO: Salvar no backend
  }


  // --- CÁLCULOS PARA OS INDICADORES GERAIS ---

  const stats = topicos.reduce(
    (acc, topic) => {
      acc.totalQuestions += topic.questions.total_attempted;
      acc.correctQuestions += topic.questions.correct_answers;
      if (topic.status === 'completed') {
        acc.completedTopics += 1;
      }
      return acc;
    },
    { totalQuestions: 0, correctQuestions: 0, completedTopics: 0 }
  );

  const overallAccuracy = stats.totalQuestions > 0
    ? Math.round((stats.correctQuestions / stats.totalQuestions) * 100)
    : 0;
  
  const overallProgress = topicos.length > 0
    ? Math.round((stats.completedTopics / topicos.length) * 100)
    : 0;

  if (loading) {
    return <p>Carregando detalhes da matéria...</p>;
  }

  if (!materia) {
    return <p>Matéria não encontrada.</p>;
  }

  // --- RENDERIZAÇÃO DO COMPONENTE ---

  return (
    <div className="space-y-6 p-4 md:p-6 bg-gray-50 min-h-screen font-sans">
       {customAlert && (
        <div className="fixed top-5 right-5 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center">
          <AlertCircle className="h-5 w-5 mr-3" />
          <span>{customAlert}</span>
          <button onClick={() => setCustomAlert(null)} className="ml-4 font-bold">X</button>
        </div>
      )}

      <header className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-800">{materia.nome}</h1>
            <p className="text-gray-500">Gerencie o progresso dos seus estudos nesta matéria.</p>
        </div>
        <div className="flex gap-2">
            <Button className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-600"><PlusCircle className="h-4 w-4" /> Adicionar Tópico</Button>
        </div>
      </header>

      {/* Indicadores Gerais */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white p-4 rounded-lg shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Progresso Geral</CardTitle>
            <Book className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallProgress}%</div>
            <p className="text-xs text-gray-500">{stats.completedTopics} de {topicos.length} tópicos concluídos</p>
            <Progress value={overallProgress} className="mt-2 h-2 rounded-full bg-gray-200" style={{backgroundColor: '#e5e7eb'}}/>
          </CardContent>
        </Card>
        <Card className="bg-white p-4 rounded-lg shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Questões Feitas</CardTitle>
            <Target className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQuestions}</div>
            <p className="text-xs text-gray-500">Total de questões respondidas</p>
          </CardContent>
        </Card>
        <Card className="bg-white p-4 rounded-lg shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Acertos</CardTitle>
            <Target className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallAccuracy}%</div>
            <p className="text-xs text-gray-500">{stats.correctQuestions} respostas corretas</p>
             <Progress value={overallAccuracy} className="mt-2 h-2 rounded-full bg-gray-200" style={{backgroundColor: '#e5e7eb'}} />
          </CardContent>
        </Card>
        <Card className="bg-white p-4 rounded-lg shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Próxima Revisão</CardTitle>
            <Calendar className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Em 3 dias</div>
            <p className="text-xs text-gray-500">Tópico: Direitos Fundamentais</p>
          </CardContent>
        </Card>
      </section>

      

      {/* Tabela de Tópicos */}
      <Card className="bg-white rounded-lg shadow">
        <CardHeader>
            <CardTitle className="text-lg">Plano de Estudo</CardTitle>
            <CardDescription className="text-sm text-gray-500">Acompanhe o status de cada tópico do edital.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTableColumnsVisibilityDemo topicos={topicos} />
        </CardContent>
      </Card>

      {/* Modal para Adicionar Sessão de Questões */}
      {isQuestionModalOpen && (
          <Dialog>
            <DialogContent className="bg-white rounded-lg shadow-xl p-6 sm:max-w-[425px] w-full">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold">Adicionar Sessão de Questões</DialogTitle>
                <DialogDescription className="text-sm text-gray-500 mt-1">
                  Registre seu desempenho para o tópico: <span className="font-semibold">{selectedTopic?.nome}</span>
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="attempted" className="text-right">
                    Questões Feitas
                  </Label>
                  <Input
                    id="attempted"
                    type="number"
                    value={questionFormData.attempted}
                    onChange={(e) => setQuestionFormData({...questionFormData, attempted: e.target.value})}
                    className="col-span-3 border-gray-300 rounded-md p-2"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="correct" className="text-right">
                    Acertos
                  </Label>
                  <Input
                    id="correct"
                    type="number"
                    value={questionFormData.correct}
                    onChange={(e) => setQuestionFormData({...questionFormData, correct: e.target.value})}
                    className="col-span-3 border-gray-300 rounded-md p-2"
                  />
                </div>
              </div>
              <DialogFooter className="flex justify-end gap-2 mt-4">
                <Button onClick={() => setQuestionModalOpen(false)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancelar</Button>
                <Button onClick={handleSaveQuestionSession} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Salvar Sessão</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
      )}
    </div>
  );
}
