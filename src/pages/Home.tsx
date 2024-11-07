import React from 'react';
import { Brain, Users, MessageSquare, Shield, ArrowRight, Bot, Award } from 'lucide-react';

interface HomeProps {
  onNavigate?: (page: string) => void;
  currentUser?: any;
}

export function Home({ onNavigate, currentUser }: HomeProps) {
  const handleRegisterClick = () => {
    onNavigate?.('register');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl font-bold leading-tight">
                Suporte Inteligente para a Comunidade Autista
              </h1>
              <p className="text-xl text-indigo-100">
                Conectamos pais, responsáveis e profissionais através de uma plataforma inovadora com suporte 24/7 baseado em Inteligência Autônoma.
              </p>
              {!currentUser && (
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={handleRegisterClick}
                    className="btn bg-white text-indigo-600 hover:bg-indigo-50"
                  >
                    Começar Agora
                  </button>
                  <button className="btn border-2 border-white text-white hover:bg-white/10">
                    Saiba Mais
                  </button>
                </div>
              )}
            </div>
            <div className="hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1607453998774-d533f65dac99?auto=format&fit=crop&w=800&q=80"
                alt="Criança brincando com brinquedos educativos"
                className="w-full max-w-md mx-auto rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Por que escolher o IAutismo?
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Nossa plataforma oferece recursos únicos para apoiar sua jornada
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Bot className="w-8 h-8" />,
                title: "Suporte 24/7",
                description: "Inteligência Autônoma sempre disponível para ajudar com suas dúvidas"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Rede de Profissionais",
                description: "Acesso a especialistas verificados e qualificados em autismo"
              },
              {
                icon: <Brain className="w-8 h-8" />,
                title: "Recursos Educacionais",
                description: "Material atualizado e baseado em evidências científicas"
              },
              {
                icon: <MessageSquare className="w-8 h-8" />,
                title: "Comunidade Ativa",
                description: "Troque experiências com outros pais e profissionais"
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Privacidade Garantida",
                description: "Seus dados são protegidos com os mais altos padrões de segurança"
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: "Profissionais Verificados",
                description: "Todos os especialistas passam por um rigoroso processo de verificação"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!currentUser && (
        <section className="bg-indigo-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="grid lg:grid-cols-2">
                <div className="p-12 lg:p-16">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Comece sua jornada hoje
                  </h2>
                  <p className="text-lg text-gray-600 mb-8">
                    Junte-se a milhares de pais e profissionais que já fazem parte da nossa comunidade.
                  </p>
                  <button 
                    onClick={handleRegisterClick}
                    className="btn btn-primary"
                  >
                    Criar Conta Gratuita
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </button>
                </div>
                <div className="hidden lg:block relative">
                  <img
                    src="https://images.unsplash.com/photo-1607453998774-d533f65dac99?auto=format&fit=crop&w=800&q=80"
                    alt="Criança brincando com brinquedos educativos"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              O que dizem sobre nós
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Histórias reais de pessoas que transformaram suas vidas com o IAutismo
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Maria Silva",
                role: "Mãe",
                content: "O suporte 24/7 com Inteligência Autônoma mudou completamente nossa rotina. Sempre que preciso de ajuda, sei que posso contar com a plataforma."
              },
              {
                name: "Dr. João Santos",
                role: "Psicólogo",
                content: "Como profissional, encontrei uma forma eficiente de conectar-me com famílias que precisam de apoio especializado."
              },
              {
                name: "Ana Oliveira",
                role: "Terapeuta Ocupacional",
                content: "A plataforma facilita muito o acompanhamento dos pacientes e a troca de experiências com outros profissionais."
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl">
                <div className="space-y-4">
                  <p className="text-gray-600 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-indigo-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}