# Guia de Desenvolvimento - Agenda Inteligente

## 📋 Sobre o Projeto

### Descrição

**Agenda Inteligente** é uma plataforma completa de agendamento para salões de corte masculino, focada em simplicidade e facilidade de uso. O sistema oferece duas interfaces principais:

1. **CMS para Dono do Salão**: Painel administrativo completo para gerenciar serviços, profissionais e agendamentos
2. **Interface para Cliente**: Agendamento rápido e simples via web ou WhatsApp

### O que o Projeto Entrega

#### Para o Dono do Salão

- ✅ **Dashboard Administrativo**: Visão geral de agendamentos, receita e estatísticas
- ✅ **Gestão de Serviços**: Cadastro e edição de serviços oferecidos (corte, barba, bigode, etc.)
- ✅ **Gestão de Profissionais**: Cadastro de colaboradores com fotos e especialidades
- ✅ **Calendário de Agendamentos**: Visualização mensal, semanal e diária com todas as marcações
- ✅ **Gestão de Horários**: Configuração de horários de funcionamento por dia da semana
- ✅ **Confirmação/Cancelamento**: Ações rápidas para gerenciar agendamentos
- ✅ **PWA Instalável**: Funciona como app nativo no desktop e Android, sem necessidade de lojas

#### Para o Cliente

- ✅ **Agendamento Online**: Fluxo simples em 4 passos (profissional → serviço → horário → confirmação)
- ✅ **Agendamento via WhatsApp**: Agendar diretamente pelo WhatsApp sem precisar baixar app
- ✅ **Meus Agendamentos**: Visualizar, cancelar ou reagendar agendamentos futuros
- ✅ **Notificações**: Lembretes automáticos via WhatsApp antes do agendamento
- ✅ **Interface Responsiva**: Funciona perfeitamente em desktop, tablet e mobile

#### Diferenciais Técnicos

- 🚀 **Performance**: Carregamento rápido, otimizações de imagens e code splitting
- 📱 **PWA**: Funciona offline e pode ser instalado como app
- 🔒 **Segurança**: Autenticação robusta, Row Level Security (RLS), validações server-side
- ♿ **Acessibilidade**: Interface acessível seguindo WCAG 2.1
- 🔍 **SEO**: Otimizado para motores de busca
- 📈 **Escalável**: Arquitetura preparada para crescimento

---

## 🏗️ Arquitetura e Stack

### Tecnologias

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **UI**: Material-UI (MUI) v6
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Real-time)
- **Integrações**: WhatsApp Business API (Meta)
- **Deploy**: Vercel
- **Estilização**: SCSS Modules + Styled Components (MUI)

### Princípios Arquiteturais

1. **Server-First**: Priorizar Server Components do Next.js quando possível
2. **Type Safety**: TypeScript strict mode, tipos auto-gerados do Supabase
3. **Component-Driven**: Componentes reutilizáveis, isolados e testáveis
4. **Progressive Enhancement**: Funciona sem JavaScript, depois melhora com JS
5. **Mobile-First**: Design e desenvolvimento começam pelo mobile

---

## 💻 Melhores Práticas de Desenvolvimento

### Estrutura de Pastas

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Route group: Autenticação
│   ├── (dashboard)/             # Route group: CMS do salão
│   ├── (public)/                # Route group: Área pública
│   └── api/                     # API Routes
├── components/
│   ├── ui/                      # Componentes UI reutilizáveis
│   ├── features/                # Componentes específicos de features
│   └── layout/                  # Componentes de layout
├── lib/
│   ├── supabase/                # Cliente Supabase
│   ├── whatsapp/                # Integração WhatsApp
│   └── utils/                   # Funções utilitárias
├── hooks/                       # Custom hooks
├── types/                       # TypeScript types
└── utils/                       # Utilitários gerais
```

### Convenções de Nomenclatura

#### Arquivos e Pastas

- **Componentes**: PascalCase (`Button.tsx`, `AppointmentCard.tsx`)
- **Hooks**: camelCase com prefixo `use` (`useAuth.ts`, `useAppointments.ts`)
- **Utils**: camelCase (`dateUtils.ts`, `validation.ts`)
- **Páginas**: `page.tsx`, `layout.tsx` (convenção Next.js)
- **Estilos**: SCSS Modules (`Button.module.scss`)

#### Variáveis e Funções

```typescript
// ✅ BOM
const appointmentList = [];
const handleSubmit = () => {};
const isUserAuthenticated = true;

// ❌ RUIM
const appList = [];
const submit = () => {};
const flag = true;
```

#### Componentes

```typescript
// ✅ BOM - Nome descritivo, props tipadas
interface AppointmentCardProps {
  appointment: Appointment;
  onCancel: (id: string) => void;
}

export function AppointmentCard({ appointment, onCancel }: AppointmentCardProps) {
  // ...
}

// ❌ RUIM - Nome genérico, props não tipadas
export function Card(props: any) {
  // ...
}
```

### Organização de Componentes

#### Estrutura de um Componente

```typescript
// 1. Imports
import React from 'react';
import { Button } from '@/components/ui';

// 2. Types/Interfaces
interface MyComponentProps {
  title: string;
}

// 3. Componente
export function MyComponent({ title }: MyComponentProps) {
  // 4. Hooks
  const [state, setState] = useState();
  
  // 5. Handlers
  const handleClick = () => {};
  
  // 6. Effects
  useEffect(() => {}, []);
  
  // 7. Render
  return <div>{title}</div>;
}
```

#### Componentes vs Páginas

- **Componentes** (`components/`): Reutilizáveis, sem lógica de roteamento
- **Páginas** (`app/*/page.tsx`): Rotas únicas, podem ter lógica específica
- **Layouts** (`app/*/layout.tsx`): Estrutura compartilhada entre páginas

### Gerenciamento de Estado

#### Quando Usar Cada Solução

1. **Local State** (`useState`): Estado isolado de um componente
2. **Context API**: Estado compartilhado entre poucos componentes (ex: AuthContext)
3. **Server State**: Usar React Query/TanStack Query para dados do servidor
4. **URL State**: Para filtros, busca, paginação (useSearchParams)

#### Exemplo: React Query

```typescript
import { useQuery } from '@tanstack/react-query';

function useAppointments() {
  return useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const { data } = await supabase
        .from('appointments')
        .select('*');
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}
```

### Tratamento de Erros

#### Erros de API

```typescript
try {
  const { data, error } = await supabase
    .from('appointments')
    .insert(appointment);
  
  if (error) {
    throw new Error(error.message);
  }
  
  return { success: true, data };
} catch (error) {
  console.error('Erro ao criar agendamento:', error);
  return { 
    success: false, 
    error: error instanceof Error ? error.message : 'Erro desconhecido' 
  };
}
```

#### Error Boundaries

```typescript
'use client';

import { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps> {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Algo deu errado</div>;
    }
    return this.props.children;
  }
}
```

### Validação

#### Client-Side (Formulários)

```typescript
import { z } from 'zod';

const appointmentSchema = z.object({
  employeeId: z.string().uuid('ID inválido'),
  serviceId: z.string().uuid('ID inválido'),
  scheduledAt: z.string().datetime('Data inválida'),
});

type AppointmentForm = z.infer<typeof appointmentSchema>;
```

#### Server-Side (API Routes)

```typescript
// app/api/appointments/route.ts
export async function POST(request: Request) {
  const body = await request.json();
  
  // Validar
  const result = appointmentSchema.safeParse(body);
  if (!result.success) {
    return Response.json(
      { error: 'Dados inválidos', details: result.error.errors },
      { status: 400 }
    );
  }
  
  // Processar...
}
```

### TypeScript

#### Configuração

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

#### Tipos vs Interfaces

- **Interface**: Para objetos e contratos públicos (props, API responses)
- **Type**: Para unions, intersections, primitives, computed types

```typescript
// Interface para props
interface ButtonProps {
  label: string;
}

// Type para unions
type Status = 'pending' | 'confirmed' | 'cancelled';

// Type para computed
type AppointmentWithDetails = Appointment & {
  employee: Employee;
  service: Service;
};
```

### Git e Versionamento

#### Commits

Seguir [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: adiciona funcionalidade de reagendamento
fix: corrige validação de horário disponível
docs: atualiza README com instruções de setup
style: formata código com Prettier
refactor: reorganiza estrutura de componentes
test: adiciona testes para AppointmentForm
chore: atualiza dependências
```

#### Branches

- `main`: Produção
- `develop`: Desenvolvimento
- `feature/nome-da-feature`: Nova funcionalidade
- `fix/nome-do-fix`: Correção de bug
- `hotfix/nome-do-hotfix`: Correção urgente em produção

---

## ⚡ Performance

### Métricas Alvo

- **Lighthouse Performance**: > 90
- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.8s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms

### Otimizações de Imagens

#### Next.js Image Component

```typescript
import Image from 'next/image';

// ✅ BOM
<Image
  src="/professional-photo.jpg"
  alt="Foto do profissional"
  width={300}
  height={400}
  quality={85}
  priority={false} // true apenas para above-the-fold
/>

// ❌ RUIM
<img src="/professional-photo.jpg" alt="Foto" />
```

#### Formatos

- **WebP** para fotos (melhor compressão)
- **SVG** para ícones e logos
- **PNG** apenas quando necessário (transparência)

### Code Splitting

#### Dynamic Imports

```typescript
// ✅ Componente pesado carregado apenas quando necessário
const Calendar = dynamic(() => import('@/components/Calendar'), {
  loading: () => <CalendarSkeleton />,
  ssr: false, // Se não precisa de SSR
});

// ❌ Import estático de componente pesado
import { Calendar } from '@/components/Calendar';
```

#### Route-based Splitting

Next.js faz automaticamente, mas evitar imports desnecessários:

```typescript
// ❌ RUIM - importa toda a biblioteca
import * as Icons from '@mui/icons-material';

// ✅ BOM - importa apenas o necessário
import { CalendarToday, Person } from '@mui/icons-material';
```

### Caching

#### Cache de Dados (React Query)

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
      refetchOnWindowFocus: false,
    },
  },
});
```

#### Cache de Assets (Next.js)

```typescript
// next.config.mjs
export default {
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

### Lazy Loading

#### Componentes

```typescript
// Carregar apenas quando visível
import { lazy, Suspense } from 'react';

const AppointmentModal = lazy(() => import('./AppointmentModal'));

function AppointmentsList() {
  return (
    <Suspense fallback={<ModalSkeleton />}>
      <AppointmentModal />
    </Suspense>
  );
}
```

#### Dados (Pagination)

```typescript
// Carregar dados conforme scroll
function useInfiniteAppointments() {
  return useInfiniteQuery({
    queryKey: ['appointments'],
    queryFn: ({ pageParam = 0 }) => fetchAppointments(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
}
```

### Bundle Size

#### Monitoramento

```bash
# Analisar bundle
npm run build
npx @next/bundle-analyzer
```

#### Otimizações

- Usar tree-shaking (imports específicos)
- Evitar dependências pesadas quando possível
- Usar alternativas leves (ex: `date-fns` ao invés de `moment.js`)

---

## 🔍 SEO (Search Engine Optimization)

### Meta Tags

#### Configuração por Página

```typescript
// app/(public)/agendamento/page.tsx
export const metadata: Metadata = {
  title: 'Agendar Corte | Agenda Inteligente',
  description: 'Agende seu corte de cabelo de forma rápida e simples',
  keywords: ['agendamento', 'corte', 'barbearia', 'salão'],
  openGraph: {
    title: 'Agendar Corte',
    description: 'Agende seu corte de cabelo',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agendar Corte',
    description: 'Agende seu corte de cabelo',
  },
};
```

#### Meta Tags Dinâmicas

```typescript
// app/(public)/agendamento/[id]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const appointment = await getAppointment(params.id);
  
  return {
    title: `Agendamento ${appointment.id} | Agenda Inteligente`,
    description: `Detalhes do agendamento para ${appointment.date}`,
  };
}
```

### Structured Data (Schema.org)

```typescript
// Componente para adicionar JSON-LD
function AppointmentStructuredData({ appointment }: Props) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `Corte de Cabelo - ${appointment.employee.name}`,
    startDate: appointment.scheduledAt,
    location: {
      '@type': 'Place',
      name: appointment.salon.name,
      address: appointment.salon.address,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
```

### URLs Semânticas

```typescript
// ✅ BOM
/agendamento/profissional/ronierison-silva
/agendamento/servico/corte-masculino
/meus-agendamentos

// ❌ RUIM
/appointment?id=123
/app?page=schedule&type=employee
```

### Sitemap

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://agendainteligente.com.br';
  
  // Páginas estáticas
  const staticPages = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/agendamento`, lastModified: new Date() },
  ];
  
  // Páginas dinâmicas (ex: serviços)
  const services = await getServices();
  const servicePages = services.map((service) => ({
    url: `${baseUrl}/servicos/${service.slug}`,
    lastModified: service.updatedAt,
  }));
  
  return [...staticPages, ...servicePages];
}
```

### Robots.txt

```typescript
// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/api/'],
      },
    ],
    sitemap: 'https://agendainteligente.com.br/sitemap.xml',
  };
}
```

### Open Graph e Twitter Cards

```typescript
// Imagens OG devem ser:
// - Tamanho mínimo: 1200x630px
// - Formato: PNG ou JPEG
// - Nome descritivo: og-image-agendamento.jpg
```

---

## ♿ Acessibilidade (WCAG 2.1)

### Meta

Seguir **WCAG 2.1 Nível AA** como mínimo.

### Semântica HTML

```typescript
// ✅ BOM - HTML semântico
<main>
  <h1>Título Principal</h1>
  <section aria-labelledby="services-heading">
    <h2 id="services-heading">Serviços</h2>
    <article>
      <h3>Nome do Serviço</h3>
    </article>
  </section>
</main>

// ❌ RUIM - Divs genéricas
<div>
  <div>Título</div>
  <div>
    <div>Serviços</div>
  </div>
</div>
```

### ARIA Labels

```typescript
// ✅ BOM
<button
  aria-label="Fechar modal de agendamento"
  onClick={handleClose}
>
  <CloseIcon />
</button>

<nav aria-label="Navegação principal">
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>

// ❌ RUIM
<button onClick={handleClose}>
  <CloseIcon />
</button>
```

### Contraste de Cores

#### Mínimos

- **Texto normal**: Contraste mínimo 4.5:1
- **Texto grande** (18pt+): Contraste mínimo 3:1
- **Elementos interativos**: Contraste mínimo 3:1

#### Ferramentas

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Lighthouse Accessibility audit
- Extensão Chrome: WAVE

### Navegação por Teclado

```typescript
// ✅ BOM - Foco visível
.button:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

// ✅ BOM - Trap de foco em modais
function Modal({ children, onClose }) {
  useEffect(() => {
    const trap = createFocusTrap(modalRef.current);
    trap.activate();
    return () => trap.deactivate();
  }, []);
}

// ❌ RUIM - Remover outline
*:focus {
  outline: none; // NUNCA fazer isso
}
```

### Formulários Acessíveis

```typescript
// ✅ BOM
<label htmlFor="email">E-mail</label>
<input
  id="email"
  type="email"
  aria-describedby="email-error"
  aria-invalid={!!error}
/>
{error && (
  <span id="email-error" role="alert">
    {error.message}
  </span>
)}

// ❌ RUIM
<input placeholder="E-mail" />
```

### Imagens

```typescript
// ✅ BOM - Alt descritivo
<Image
  src="/professional-photo.jpg"
  alt="Foto de Ronierson da Silva, barbeiro especializado em cortes masculinos"
/>

// ✅ BOM - Imagens decorativas
<Image
  src="/decorative-pattern.jpg"
  alt=""
  role="presentation"
/>

// ❌ RUIM - Alt genérico ou vazio em imagem informativa
<Image src="/professional-photo.jpg" alt="Foto" />
```

### Screen Readers

```typescript
// ✅ BOM - Live regions para updates dinâmicos
<div role="status" aria-live="polite" aria-atomic="true">
  {notification}
</div>

// ✅ BOM - Skip links
<a href="#main-content" className="skip-link">
  Pular para conteúdo principal
</a>
```

### Testes de Acessibilidade

#### Ferramentas

1. **Automáticas**:
   - Lighthouse (Chrome DevTools)
   - axe DevTools
   - WAVE Extension

2. **Manuais**:
   - Navegação apenas por teclado (Tab, Enter, Esc)
   - Screen reader (NVDA, JAWS, VoiceOver)
   - Zoom 200% (deve funcionar bem)

---

## 📈 Escalabilidade

### Banco de Dados

#### Índices

```sql
-- Índices para queries frequentes
CREATE INDEX idx_appointments_salon_date ON appointments(salon_id, scheduled_at);
CREATE INDEX idx_appointments_client ON appointments(client_id);
CREATE INDEX idx_employees_salon_active ON employees(salon_id, is_active);
```

#### Paginação

```typescript
// ✅ BOM - Paginação eficiente
async function getAppointments(page: number, pageSize: number = 20) {
  const from = page * pageSize;
  const to = from + pageSize - 1;
  
  return supabase
    .from('appointments')
    .select('*')
    .range(from, to)
    .order('scheduled_at', { ascending: true });
}

// ❌ RUIM - Carregar tudo
async function getAllAppointments() {
  return supabase
    .from('appointments')
    .select('*'); // Pode retornar milhares de registros!
}
```

#### Queries Eficientes

```typescript
// ✅ BOM - Select apenas campos necessários
const { data } = await supabase
  .from('appointments')
  .select('id, scheduled_at, status') // Apenas o necessário
  .eq('salon_id', salonId);

// ❌ RUIM - Select tudo
const { data } = await supabase
  .from('appointments')
  .select('*'); // Retorna tudo, mesmo campos não usados
```

### Arquitetura de Código

#### Separação de Responsabilidades

```typescript
// ✅ BOM - Separar lógica de negócio
// lib/services/appointmentService.ts
export async function createAppointment(data: AppointmentData) {
  // Lógica de validação
  // Lógica de negócio
  // Chamada ao banco
}

// app/(public)/agendamento/page.tsx
const result = await createAppointment(formData);
```

#### Componentes Pequenos e Reutilizáveis

```typescript
// ✅ BOM - Componente focado
function TimeSlot({ time, available, onSelect }) {
  return (
    <button
      disabled={!available}
      onClick={() => onSelect(time)}
    >
      {time}
    </button>
  );
}

// ❌ RUIM - Componente grande com múltiplas responsabilidades
function AppointmentPage() {
  // 500 linhas de código misturando UI, lógica, API calls...
}
```

### Cache Strategy

#### CDN e Static Assets

- Imagens servidas via CDN (Vercel/Next.js faz automaticamente)
- Assets estáticos com cache longo (1 ano)
- HTML com cache curto ou sem cache

#### API Cache

```typescript
// Cache em camadas
// 1. React Query (client-side) - 5 minutos
// 2. Next.js API Routes (edge cache) - 1 minuto
// 3. Supabase (banco com índices otimizados)

export async function GET(request: Request) {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}
```

### Monitoramento

#### Métricas Importantes

- **Latência de API**: Tempo de resposta das queries
- **Taxa de Erro**: % de requests que falham
- **Throughput**: Requests por segundo
- **Uso de Banco**: Queries lentas, uso de conexões

#### Ferramentas

- **Vercel Analytics**: Métricas de performance do Next.js
- **Supabase Dashboard**: Métricas de banco e API
- **Sentry**: Monitoramento de erros

---

## 🎯 Recomendações Finais

### Checklist Antes de Deploy

- [ ] Todas as rotas protegidas têm autenticação
- [ ] Validações client-side e server-side implementadas
- [ ] Erros tratados e mensagens amigáveis
- [ ] Loading states em todas as ações assíncronas
- [ ] Imagens otimizadas (WebP, lazy loading)
- [ ] Meta tags configuradas em todas as páginas
- [ ] Acessibilidade testada (keyboard navigation, screen reader)
- [ ] Performance Lighthouse > 90
- [ ] Testes em mobile, tablet e desktop
- [ ] Variáveis de ambiente configuradas
- [ ] RLS policies testadas no Supabase

### Code Review

#### Checklist de Revisão

- [ ] Código segue padrões do projeto
- [ ] TypeScript sem erros (`strict: true`)
- [ ] Componentes são reutilizáveis e pequenos
- [ ] Performance não degradada (lazy loading, code splitting)
- [ ] Acessibilidade respeitada (semântica, ARIA)
- [ ] Tratamento de erros implementado
- [ ] Validações implementadas
- [ ] Sem console.logs ou código comentado

### Documentação

#### Comentários no Código

```typescript
// ✅ BOM - Explicar "por que", não "o que"
// Usamos UTC para evitar problemas com timezone do cliente
const scheduledAt = new Date(dateString).toISOString();

// ❌ RUIM - Comentário óbvio
// Converte string para Date
const scheduledAt = new Date(dateString);
```

#### README

- Instruções de setup
- Variáveis de ambiente necessárias
- Como rodar em desenvolvimento
- Como fazer deploy
- Estrutura do projeto

### Manutenção Contínua

- **Dependências**: Atualizar regularmente (Dependabot/Renovate)
- **Performance**: Monitorar métricas mensalmente
- **Segurança**: Verificar vulnerabilidades (`npm audit`)
- **Acessibilidade**: Testar periodicamente
- **SEO**: Verificar rankings e ajustar conforme necessário

---

**Última atualização**: Dezembro 2024  
**Versão**: 1.0.0
