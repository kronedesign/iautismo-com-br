import React from 'react';
import { FaqItem } from '../components/FaqItem';
import { Search } from 'lucide-react';

export function Faq() {
  const faqItems = [
    {
      question: 'O que é o IAutismo.com.br?',
      answer: 'O IAutismo.com.br é uma plataforma online que utiliza inteligência artificial para oferecer suporte e orientação a pais e profissionais que lidam com o autismo. Nosso objetivo é fornecer informações centralizadas, acesso a terapeutas ocupacionais virtuais e Inteligência Autônoma humanizada, disponível 24 horas por dia.',
    },
    {
      question: 'Como funciona o suporte através de Inteligência Autônoma?',
      answer: 'Nossa Inteligência Autônoma é desenvolvida com inteligência artificial avançada e é programada para oferecer suporte personalizado, responder dúvidas comuns sobre autismo, e fornecer orientações básicas. Ela está disponível 24/7 e pode ajudar tanto pais quanto profissionais com informações relevantes e confiáveis.',
    },
    {
      question: 'Quem pode se cadastrar na plataforma?',
      answer: (
        <div className="space-y-4">
          <p>Nossa plataforma é aberta para dois tipos principais de usuários:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Pais e Responsáveis:</strong> Pessoas que cuidam de crianças ou adultos com autismo e buscam suporte, informações e conexão com profissionais.
            </li>
            <li>
              <strong>Profissionais:</strong> Terapeutas ocupacionais, psicólogos, fonoaudiólogos e outros profissionais especializados em autismo que desejam oferecer seus serviços e conhecimentos.
            </li>
          </ul>
        </div>
      ),
    },
    {
      question: 'Os serviços são gratuitos?',
      answer: 'Oferecemos uma combinação de serviços gratuitos e premium. A parte gratuita inclui acesso a informações básicas, fóruns de discussão e recursos educacionais. Os serviços premium incluem consultas com profissionais, Inteligência Autônoma personalizada e recursos avançados de suporte.',
    },
    {
      question: 'Como posso encontrar um profissional especializado?',
      answer: 'Nossa plataforma possui um diretório de profissionais verificados e especializados em autismo. Você pode filtrar por especialidade, localização e disponibilidade. Cada profissional possui um perfil detalhado com suas qualificações, experiência e avaliações de outros usuários.',
    },
    {
      question: 'Como é feita a verificação dos profissionais?',
      answer: 'Todos os profissionais passam por um processo rigoroso de verificação que inclui a validação do registro profissional, verificação das especializações declaradas e análise da experiência com autismo. Mantemos um alto padrão de qualidade para garantir o melhor suporte possível.',
    },
    {
      question: 'Posso acessar a plataforma pelo celular?',
      answer: 'Sim, nossa plataforma é totalmente responsiva e pode ser acessada de qualquer dispositivo com acesso à internet. Além disso, estamos desenvolvendo aplicativos nativos para iOS e Android para uma experiência ainda melhor.',
    },
    {
      question: 'Como posso contribuir com o projeto?',
      answer: (
        <div className="space-y-4">
          <p>Existem várias formas de contribuir com o IAutismo:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Compartilhando suas experiências nos fóruns de discussão</li>
            <li>Participando como profissional voluntário</li>
            <li>Sugerindo melhorias e novos recursos</li>
            <li>Divulgando a plataforma para quem precisa</li>
          </ul>
          <p>Entre em contato conosco através do email <a href="mailto:contato@iautismo.com.br" className="text-indigo-600 hover:text-indigo-800">contato@iautismo.com.br</a> para saber mais.</p>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Perguntas Frequentes
          </h1>
          <p className="text-lg text-gray-600">
            Encontre respostas para as dúvidas mais comuns sobre o IAutismo
          </p>
        </div>

        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Buscar pergunta..."
          />
        </div>

        <div className="bg-white rounded-xl shadow-lg">
          <div className="divide-y divide-gray-200">
            {faqItems.map((item, index) => (
              <FaqItem
                key={index}
                question={item.question}
                answer={item.answer}
              />
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Não encontrou o que procurava?{' '}
            <a href="mailto:suporte@iautismo.com.br" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Entre em contato com nosso suporte
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}