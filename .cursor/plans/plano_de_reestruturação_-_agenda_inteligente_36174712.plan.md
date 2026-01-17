---
name: Plano de Reestruturação - Agenda Inteligente
overview: ""
todos: []
---

# Plano de Reestruturação - Agenda Inteligente

## Análise do Estado Atual

### Situação Atual

- ✅ Projeto já usa **Next.js 14** com App Router
- ✅ Firebase Authentication configurado (apenas auth, sem Firestore)
- ✅ Material-UI como biblioteca de componentes
- ✅ TypeScript configurado
- ✅ Estrutura básica de autenticação (login, cadastro, recuperação)
- ⚠️ Fluxo de agendamento parcialmente implementado (UI apenas)
- ❌ Sem backend/database para persistência
- ❌ Sem CMS para dono do salão
- ❌ Sem integração WhatsApp
- ❌ Sem sistema de serviços/profissionais

### Pontos de Atenção

- Firebase configurado mas apenas para auth (custos do Firestore escalam rápido)
- Código precisa de melhor organização (componentes "dumb/smart" podem ser simplificados)
- Falta estrutura de dados/modelos bem definidos
- Ausência de validação server-side
- Sem sistema de roles/permissões (cliente vs salão)

---

## Arquitetura Recomendada

### Stack Tecnológica Proposta

#### Backend: **Supabase** (Recomendado)

**Por que Supabase?**

- ✅ **Gratuito até 500MB database + 2GB bandwidth/mês** (plano Free generoso)
- ✅ **Fácil para front-end dev**: Dashboard visual, SQL GUI, não precisa configurar servidor
- ✅ **PostgreSQL**: Banco relacional robusto e escalável (migra facilmente se crescer)
- ✅ **Auth integrado**: Migração fácil do Firebase Auth
- ✅ **Real-time**: Subscriptions para atualizações em tempo real de agendamentos
- ✅ **Storage**: Para fotos de profissionais/serviços
- ✅ **Edge Functions**: Para lógica serverless (webhooks WhatsApp, validações)
- ✅ **APIs auto-geradas**: REST e GraphQL a partir do schema
- ✅ **TypeScript types**: Auto-gerados do schema

**Custo estimado inicial**: $0 (free tier)

**Custo quando escalar**: ~$25/mês (Pro plan) para até 8GB database

#### Frontend: **Next.js 14 App Router** (Manter)

- Já está configurado
- Otimizações de performance nativas
- SSR/SSG para SEO
- API Routes para endpoints customizados

#### CMS: **PWA (Progressive Web App)**

**Por que PWA?**

- ✅ **Uma codebase**: Funciona desktop e mobile Android
- ✅ **Instalável**: Pode ser instalado como app no Android
- ✅ **Offline**: Service Workers para funcionar sem internet
- ✅ **Responsivo**: Material-UI já é mobile-first
- ✅ **Sem custos de loja**: Não precisa publicar na Play Store inicialmente
- ✅ **Atualizações instantâneas**: Sem aprovação de lojas

#### Integração Cliente: **WhatsApp Business API (MVP)**

**Estratégia Faseada:**

1. **Fase 1 (MVP)**: Webhook simples + templates aprovados (confirmar agendamento)
2. **Fase 2**: Chatbot básico com regras (sem IA complexa)
3. **Fase 3**: Integração com IA (OpenAI API) apenas se necessário e permitido

**Custo WhatsApp**: ~$0.005-0.015 por mensagem (conversation-based pricing)

**Provedores recomendados**: Evolution API, Twilio, ou WhatsApp Business API direto

---

## Estrutura de Dados (Schema Supabase)

### Tabelas Principais

```sql
-- Perfis de usuário (extensão do auth.users)
profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  role TEXT NOT NULL, -- 'salon_owner' | 'client' | 'employee'
  name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
)

-- Salões
salons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES profiles(id),
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  whatsapp_number TEXT,
  operating_hours JSONB, -- {monday: {open: "09:00", close: "18:00"}, ...}
  created_at TIMESTAMPTZ DEFAULT NOW()
)

-- Profissionais/Colaboradores
employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  salon_id UUID REFERENCES salons(id),
  profile_id UUID REFERENCES profiles(id),
  name TEXT NOT NULL,
  photo_url TEXT,
  specialties TEXT[], -- ['corte', 'barba', 'bigode']
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
)

-- Serviços
services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  salon_id UUID REFERENCES salons(id),
  name TEXT NOT NULL, -- 'Corte Masculino', 'Barba', etc
  description TEXT,
  duration_minutes INTEGER NOT NULL, -- 30, 45, 60
  price DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
)

-- Relacionamento Serviços x Profissionais
service_employees (
  service_id UUID REFERENCES services(id),
  employee_id UUID REFERENCES employees(id),
  PRIMARY KEY (service_id, employee_id)
)

-- Agendamentos
appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  salon_id UUID REFERENCES salons(id),
  client_id UUID REFERENCES profiles(id),
  employee_id UUID REFERENCES employees(id),
  service_id UUID REFERENCES services(id),
  scheduled_at TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending' | 'confirmed' | 'completed' | 'cancelled'
  client_name TEXT, -- Para agendamentos via WhatsApp sem cadastro
  client_phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)

-- Configurações de WhatsApp
whatsapp_config (
  salon_id UUID PRIMARY KEY REFERENCES salons(id),
  api_key TEXT,
  webhook_url TEXT,
  phone_number_id TEXT,
  business_account_id TEXT,
  enabled BOOLEAN DEFAULT false
)
```

---

## Estrutura de Pastas Proposta

```
src/
├── app/
│   ├── (auth)/                    # Route group para autenticação
│   │   ├── login/
│   │   ├── cadastro/
│   │   └── recuperar-senha/
│   │
│   ├── (dashboard)/               # Route group para CMS dono do salão
│   │   ├── layout.tsx            # Layout com sidebar/nav do CMS
│   │   ├── dashboard/
│   │   │   ├── page.tsx          # Dashboard principal
│   │   ├── profissionais/
│   │   │   ├── page.tsx          # Listar/Cadastrar profissionais
│   │   │   └── [id]/
│   │   ├── servicos/
│   │   │   ├── page.tsx          # Listar/Cadastrar serviços
│   │   │   └── [id]/
│   │   ├── agendamentos/
│   │   │   ├── page.tsx          # Calendário de agendamentos
│   │   │   └── [id]/
│   │   └── configuracoes/
│   │       └── page.tsx          # Configurar WhatsApp, horários, etc
│   │
│   ├── (public)/                  # Route group para cliente público
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Landing page / Home
│   │   ├── agendamento/
│   │   │   ├── page.tsx          # Fluxo de agendamento
│   │   │   ├── select-professional/
│   │   │   ├── select-service/
│   │   │   ├── select-time/
│   │   │   └── confirm/
│   │   └── meus-agendamentos/
│   │
│   ├── api/                       # API Routes do Next.js
│   │   ├── webhooks/
│   │   │   └── whatsapp/
│   │   │       └── route.ts      # Webhook receber mensagens WhatsApp
│   │   └── appointments/
│   │       └── route.ts
│   │
│   ├── globals.scss
│   └── layout.tsx                 # Root layout
│
├── components/
│   ├── ui/                        # Componentes UI reutilizáveis (botões, inputs, etc)
│   │   ├── button/
│   │   ├── input/
│   │   └── calendar/
│   │
│   ├── features/                  # Componentes específicos de features
│   │   ├── appointment/
│   │   │   ├── AppointmentCard.tsx
│   │   │   ├── AppointmentForm.tsx
│   │   │   └── TimeSlotPicker.tsx
│   │   ├── employee/
│   │   └── service/
│   │
│   └── layout/                    # Componentes de layout
│       ├── Header/
│       ├── Sidebar/
│       └── Footer/
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Cliente Supabase browser
│   │   ├── server.ts             # Cliente Supabase server
│   │   └── middleware.ts         # Middleware para auth
│   │
│   ├── whatsapp/
│   │   ├── client.ts             # Cliente WhatsApp API
│   │   ├── templates.ts          # Templates de mensagens
│   │   └── webhook.ts            # Lógica de webhook
│   │
│   └── utils/
│       ├── date.ts
│       └── validation.ts
│
├── hooks/
│   ├── useAuth.ts
│   ├── useAppointments.ts
│   ├── useEmployees.ts
│   └── useServices.ts
│
├── types/
│   ├── database.ts               # Types auto-gerados do Supabase
│   ├── appointment.ts
│   ├── employee.ts
│   └── service.ts
│
└── utils/
    ├── constants.ts
    └── routes.ts
```

---

## Roadmap de Implementação

### Fase 1: Setup e Migração de Auth (Semana 1-2)

#### 1.1 Configuração Supabase

- [ ] Criar conta/projeto no Supabase
- [ ] Configurar variáveis de ambiente (`.env.local`)
- [ ] Criar cliente Supabase (`lib/supabase/client.ts`, `server.ts`)
- [ ] Executar migrations SQL para criar schema inicial
- [ ] Configurar RLS (Row Level Security) policies

#### 1.2 Migração Firebase Auth → Supabase Auth

- [ ] Substituir `lib/firebase/auth/*` por `lib/supabase/auth/*`
- [ ] Migrar `AuthContext` para usar Supabase
- [ ] Atualizar páginas de login/cadastro
- [ ] Implementar migração de usuários existentes (se houver)

#### 1.3 Reorganização de Estrutura

- [ ] Aplicar nova estrutura de pastas proposta
- [ ] Mover componentes para estrutura `ui/features/layout`
- [ ] Criar route groups `(auth)`, `(dashboard)`, `(public)`
- [ ] Configurar layouts aninhados

**Arquivos principais a modificar:**

- `src/lib/firebase/` → remover ou migrar para Supabase
- `src/context/auth/` → atualizar para Supabase
- `src/app/login/page.tsx` → atualizar
- `src/app/cadastro/page.tsx` → atualizar
- Criar `src/lib/supabase/` → novo
- Criar `src/app/(auth)/` → novo
- Criar `src/app/(dashboard)/` → novo

---

### Fase 2: CMS do Dono do Salão (Semana 3-4)

#### 2.1 Dashboard Base

- [ ] Criar layout do CMS (`app/(dashboard)/layout.tsx`)
- [ ] Sidebar/Navigation com menu
- [ ] Dashboard principal com estatísticas (agendamentos do dia, receita, etc)
- [ ] Proteção de rotas (middleware para verificar role `salon_owner`)

#### 2.2 CRUD de Serviços

- [ ] Página listar serviços (`app/(dashboard)/servicos/page.tsx`)
- [ ] Formulário criar/editar serviço
- [ ] Integração com Supabase (insert, update, delete)
- [ ] Validação client + server-side

#### 2.3 CRUD de Profissionais

- [ ] Página listar profissionais (`app/(dashboard)/profissionais/page.tsx`)
- [ ] Formulário criar/editar profissional
- [ ] Upload de foto (Supabase Storage)
- [ ] Vincular profissionais a serviços

#### 2.4 Calendário de Agendamentos

- [ ] Página de agendamentos (`app/(dashboard)/agendamentos/page.tsx`)
- [ ] Visualização calendário (usar biblioteca como `react-big-calendar` ou similar)
- [ ] Detalhes do agendamento (modal ou página)
- [ ] Ações: confirmar, cancelar, completar

**Arquivos principais a criar:**

- `src/app/(dashboard)/layout.tsx` → novo
- `src/app/(dashboard)/dashboard/page.tsx` → novo
- `src/app/(dashboard)/servicos/page.tsx` → novo
- `src/app/(dashboard)/profissionais/page.tsx` → novo
- `src/app/(dashboard)/agendamentos/page.tsx` → novo
- `src/components/features/appointment/Calendar.tsx` → novo
- `src/hooks/useServices.ts` → novo
- `src/hooks/useEmployees.ts` → novo
- `src/hooks/useAppointments.ts` → novo

---

### Fase 3: Fluxo de Agendamento Cliente (Semana 5-6)

#### 3.1 Melhorar Fluxo Existente

- [ ] Refatorar `app/agendamento/page.tsx` (mover para `app/(public)/agendamento/`)
- [ ] Implementar `SelectProfessional` com dados reais (buscar do Supabase)
- [ ] Implementar `SelectService` com dados reais
- [ ] Implementar `SelectTime` com lógica de horários disponíveis
- [ ] Calcular disponibilidade baseado em:
  - Horário de funcionamento do salão
  - Agendamentos existentes
  - Duração do serviço
- [ ] `ConfirmAppointment` com resumo e confirmação final

#### 3.2 Persistência de Agendamento

- [ ] Criar endpoint API (`app/api/appointments/route.ts`)
- [ ] Salvar agendamento no Supabase
- [ ] Enviar confirmação por email (usar Supabase Edge Function ou Resend)

#### 3.3 Página "Meus Agendamentos"

- [ ] Listar agendamentos do cliente logado
- [ ] Permitir cancelamento (com regras de tempo mínimo)
- [ ] Reagendamento

**Arquivos principais a modificar:**

- `src/app/agendamento/` → mover para `src/app/(public)/agendamento/`
- `src/app/agendamento/select-professional/select-professional.tsx` → atualizar
- `src/app/agendamento/select-service.tsx` → atualizar
- `src/app/agendamento/select-time.tsx` → atualizar
- `src/app/agendamento/confirm-appointment.tsx` → atualizar
- Criar `src/app/(public)/meus-agendamentos/page.tsx` → novo
- Criar `src/app/api/appointments/route.ts` → novo
- Criar `src/lib/utils/appointment.ts` → novo (lógica de disponibilidade)

---

### Fase 4: Integração WhatsApp (Semana 7-8)

#### 4.1 Setup WhatsApp Business API

- [ ] Escolher provedor (Evolution API, Twilio, ou direto Meta)
- [ ] Configurar conta/número
- [ ] Obter credenciais (API Key, Phone Number ID, etc)
- [ ] Criar tabela `whatsapp_config` no Supabase

#### 4.2 Webhook Básico

- [ ] Criar endpoint webhook (`app/api/webhooks/whatsapp/route.ts`)
- [ ] Receber mensagens recebidas
- [ ] Validar assinatura (segurança)
- [ ] Salvar mensagens no banco (opcional, para histórico)

#### 4.3 Templates de Mensagens

- [ ] Criar templates aprovados na Meta:
  - Confirmação de agendamento
  - Lembrete (24h antes)
  - Cancelamento
- [ ] Implementar envio de mensagens (`lib/whatsapp/client.ts`)

#### 4.4 Fluxo de Agendamento via WhatsApp (MVP Simples)

- [ ] Cliente envia mensagem inicial
- [ ] Bot responde com opções (menu simples: "1 - Agendar", "2 - Ver meus agendamentos")
- [ ] Se escolher "1", pedir dados: nome, telefone, serviço desejado
- [ [ ] Listar horários disponíveis
- [ ] Confirmar agendamento
- [ ] Enviar confirmação

**Nota**: Inicialmente sem IA/voice, apenas fluxo de regras simples. IA pode ser adicionada na Fase 5.

**Arquivos principais a criar:**

- `src/app/api/webhooks/whatsapp/route.ts` → novo
- `src/lib/whatsapp/client.ts` → novo
- `src/lib/whatsapp/templates.ts` → novo
- `src/lib/whatsapp/webhook.ts` → novo
- `src/app/(dashboard)/configuracoes/page.tsx` → adicionar seção WhatsApp → novo

---

### Fase 5: PWA e Otimizações (Semana 9-10)

#### 5.1 Configurar PWA

- [ ] Instalar `next-pwa`
- [ ] Criar `manifest.json`
- [ ] Configurar service worker
- [ ] Ícones para instalação
- [ ] Testar instalação no Android

#### 5.2 Performance

- [ ] Otimizar imagens (Next.js Image component)
- [ ] Lazy loading de componentes
- [ ] Code splitting
- [ ] Cache strategies (SW)

#### 5.3 Melhorias UX

- [ ] Loading states
- [ ] Error boundaries
- [ ] Notificações (Web Push API)
- [ ] Offline support básico

**Arquivos principais a modificar:**

- `next.config.mjs` → adicionar PWA config
- Criar `public/manifest.json` → novo
- Criar `public/icons/` → novo

---

## Segurança e Permissões

### Row Level Security (RLS) no Supabase

Configurar políticas RLS para garantir que usuários só acessem seus próprios dados:

```sql
-- Profiles: usuários só veem seu próprio perfil
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Salões: dono do salão vê apenas seus salões
ALTER TABLE salons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners can view own salons" ON salons FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Owners can manage own salons" ON salons FOR ALL USING (auth.uid() = owner_id);

-- Serviços: dono do salão gerencia serviços do seu salão
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Salon owners manage services" ON services FOR ALL 
  USING (salon_id IN (SELECT id FROM salons WHERE owner_id = auth.uid()));
CREATE POLICY "Public can view active services" ON services FOR SELECT 
  USING (is_active = true);

-- Agendamentos: clientes veem seus agendamentos, donos veem agendamentos do salão
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clients view own appointments" ON appointments FOR SELECT 
  USING (client_id = auth.uid());
CREATE POLICY "Salon owners view salon appointments" ON appointments FOR SELECT 
  USING (salon_id IN (SELECT id FROM salons WHERE owner_id = auth.uid()));
CREATE POLICY "Clients create own appointments" ON appointments FOR INSERT 
  WITH CHECK (client_id = auth.uid());
CREATE POLICY "Salon owners can update appointments" ON appointments FOR UPDATE 
  USING (salon_id IN (SELECT id FROM salons WHERE owner_id = auth.uid()));
```

### Middleware de Autenticação

Criar middleware Next.js para proteger rotas do dashboard:

```typescript
// middleware.ts na raiz do projeto
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  // Proteger rotas do dashboard
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    // Verificar role aqui se necessário
  }
  
  return res
}
```

---

## Análise de Competidores e Diferenciais

### Competidores Principais

1. **Agendou.com / Setmore / SimplyBook**

   - Dores: Interface complexa, muitas funcionalidades desnecessárias, custo mensal alto
   - Diferencial nosso: Foco em salões de corte masculino, interface simples, WhatsApp nativo

2. **Aplicativos locais**

   - Dores: Não integrados com WhatsApp (ferramenta principal do salão), complicados de usar
   - Diferencial nosso: Atendimento direto pelo WhatsApp, sem necessidade de app

3. **Planilhas/Agendas físicas**

   - Dores: Erros de anotação, não centralizadas, sem lembretes automáticos
   - Diferencial nosso: Automatização completa, notificações, histórico

### Nosso Diferencial Estratégico

1. **WhatsApp-First**: O cliente não precisa baixar nada, usa o que já tem
2. **Foco no nicho**: Especializado em corte masculino, não generalista
3. **Custo baixo**: Free tier generoso do Supabase, sem custos fixos altos
4. **Interface simples**: CMS intuitivo para dono do salão
5. **Voz personalizada (futuro)**: Atendimento com voz do próprio barbeiro (quando viável)

---

## Resumo de Custos Estimados

### Desenvolvimento Inicial

- **Tempo estimado**: 8-10 semanas (1 desenvolvedor)
- **Custo desenvolvimento**: $0 (desenvolvedor front-end senior próprio)

### Infraestrutura Mensal

| Serviço | Plano Inicial (MVP) | Quando Escalar |

|---------|---------------------|----------------|

| **Supabase** | $0 (Free) | $25/mês (Pro) - até 8GB DB |

| **Vercel/Netlify** (Hosting) | $0 (Hobby) | $20/mês (Pro) - produção |

| **WhatsApp API** | ~$0.01/mensagem | Cresce com uso (1000 msgs = ~$10-15) |

| **Domínio** | ~$12/ano | - |

| **Email (Resend/SendGrid)** | $0 (Free tier) | $15-20/mês se precisar |

| **TOTAL MVP** | **~$1-5/mês** | **~$60-80/mês** (escala) |

**Observação**: Custo do WhatsApp varia muito com volume. 100 agendamentos/mês ≈ 400-500 mensagens ≈ $5-7.50/mês

### Quando Considerar Upgrade

- **Supabase**: Quando passar de 500MB de database ou 2GB bandwidth/mês
- **Hosting**: Quando precisar de features Pro (melhor analytics, mais builds)
- **WhatsApp**: Custos são proporcionais ao uso, escala automaticamente

---

## Decisões Tomadas

### Decisões Definidas

1. **Provedor WhatsApp**:

   - [x] **Meta Business API direto** (escolhido - mais barato, processo mais burocrático)

2. **Domínio e Branding**:

   - [ ] Escolher nome do produto (PENDENTE)
   - [ ] Registrar domínio (PENDENTE)
   - [ ] Logo/branding básico (PENDENTE)

3. **Modelo de Negócio**:

   - [x] **Gratuito inicialmente (freemium)** (escolhido)

4. **Recursos de Desenvolvimento**:

   - [x] **Desenvolvedor Front-end Senior (próprio dono)** - Custo zero

### Decisões Pendentes

1. **Domínio e Branding**:

   - [ ] Escolher nome do produto
   - [ ] Registrar domínio
   - [ ] Logo/branding básico

### Próximos Passos Imediatos

1. **Setup Inicial (Semana 1)**:

   - Criar conta Supabase
   - Configurar projeto
   - Executar migrations SQL
   - Setup básico do ambiente de desenvolvimento

2. **Validação MVP**:

   - Testar com 1-2 salões reais
   - Coletar feedback
   - Ajustar baseado no uso real

3. **Roadmap Pós-MVP**:

   - Funcionalidades avançadas (relatórios, analytics)
   - Integração com pagamentos
   - App mobile nativo (se houver demanda)
   - IA para atendimento via voz (se WhatsApp permitir)

---

## Considerações Técnicas Importantes

### Migração do Firebase Auth

- **Estratégia**: Criar script de migração para transferir usuários existentes
- **Autenticação Social**: Supabase também suporta Google/Facebook OAuth (similar ao Firebase)
- **Tempo estimado**: 2-3 dias para migração completa

### Performance e Escalabilidade

- **Cache**: Usar React Query ou SWR para cache de dados no frontend
- **Real-time**: Supabase Realtime para atualizações em tempo real no calendário
- **Edge Functions**: Usar para processar webhooks WhatsApp (melhor latência)

### Monitoramento e Logs

- **Erros**: Integrar Sentry (free tier disponível)
- **Analytics**: Vercel Analytics (incluído) ou Google Analytics
- **Logs**: Supabase tem logs integrados no dashboard

---

## Referências e Documentação

### Links Úteis

- [Supabase Docs](https://supabase.com/docs)
- [Next.js 14 App Router](https://nextjs.org/docs/app)
- [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)
- [Material-UI](https://mui.com/)
- [PWA Guide](https://web.dev/progressive-web-apps/)

### Bibliotecas Recomendadas

- `@supabase/supabase-js` - Cliente Supabase
- `@supabase/auth-helpers-nextjs` - Helpers de auth para Next.js
- `react-hook-form` - Formulários (mais leve que Formik)
- `zod` - Validação de schemas (TypeScript-first)
- `date-fns` - Manipulação de datas
- `react-big-calendar` - Calendário para agendamentos
- `next-pwa` - Configuração PWA

---

## Checklist Final de Preparação

Antes de começar a implementação, garantir:

- [ ] Conta Supabase criada e projeto configurado
- [ ] Variáveis de ambiente documentadas (`.env.example`)
- [ ] Repositório Git configurado
- [ ] Ambiente de desenvolvimento configurado (Node.js, etc)
- [ ] Decisões sobre provedor WhatsApp tomadas
- [ ] Domínio registrado (se aplicável)
- [ ] Plano de deploy definido (Vercel recomendado)

---

**Plano criado em**: Dezembro 2024

**Status**: Pronto para implementação

**Tempo estimado total**: 8-10 semanas

**Complexidade**: Média (facilitada pelo Supabase)

---

## Lista Detalhada de Tarefas - Execução Completa

Esta seção lista TODAS as tarefas desde o início (design, branding, desenvolvimento) até o lançamento, organizadas para evitar retrabalho e garantir progresso claro.

**📋 Total estimado**: ~200+ tarefas detalhadas organizadas em 7 fases principais**

### Fase 0: Preparação e Planejamento (Semana 0)

#### 0.1 Branding e Identidade Visual

- [ ] **Pesquisa de mercado de nomes**
  - [ ] Brainstorm de nomes relacionados a barbearia/agendamento
  - [ ] Verificar disponibilidade de domínio (.com.br, .com)
  - [ ] Verificar disponibilidade de marca/patente básica
  - [ ] Testar com 2-3 pessoas (nome é fácil de pronunciar/lembrar?)

- [ ] **Escolher nome final do produto**
  - [ ] Documentar nome escolhido
  - [ ] Registrar variantes de domínio (se necessário)

- [ ] **Registrar domínio**
  - [ ] Escolher provedor (Registro.br, GoDaddy, etc)
  - [ ] Registrar domínio principal
  - [ ] Configurar DNS básico (guardar credenciais)

- [ ] **Design de Logo**
  - [ ] Definir conceito visual (paleta de cores, estilo)
  - [ ] Criar logo principal (SVG + PNG)
  - [ ] Criar variações (ícone, horizontal, vertical)
  - [ ] Versões: claro, escuro, favicon (16x16, 32x32, 192x192, 512x512)

- [ ] **Guia de Estilo Básico**
  - [ ] Definir paleta de cores primária/secundária
  - [ ] Escolher fontes principais (web-safe ou Google Fonts)
  - [ ] Definir espaçamentos base (8px grid recomendado)
  - [ ] Documentar em arquivo (Figma, PDF, ou markdown)

#### 0.2 Pesquisa e Definição de UX

- [ ] **Benchmark de concorrentes**
  - [ ] Listar 3-5 principais concorrentes
  - [ ] Anotar pontos fortes/fracos de cada um
  - [ ] Identificar oportunidades de melhoria

- [ ] **Definir Personas**
  - [ ] Persona 1: Dono do salão (idade, experiência, necessidades)
  - [ ] Persona 2: Cliente final (idade, comportamento, preferências)
  - [ ] Documentar jornadas de uso básicas

- [ ] **Definir Fluxos Principais**
  - [ ] Fluxo 1: Cadastro do salão (primeira vez)
  - [ ] Fluxo 2: Cliente agendando pelo site
  - [ ] Fluxo 3: Cliente agendando pelo WhatsApp
  - [ ] Fluxo 4: Dono do salão gerenciando agenda
  - [ ] Desenhar wireframes simples (papel ou Figma)

#### 0.3 Definições Técnicas

- [ ] **Setup de Ferramentas**
  - [ ] Criar conta Supabase (free tier)
  - [ ] Criar conta Vercel (para deploy)
  - [ ] Criar conta Meta Business (para WhatsApp API)
  - [ ] Instalar Node.js (versão LTS)
  - [ ] Instalar Git e configurar
  - [ ] Escolher editor/IDE (VS Code recomendado)
  - [ ] Instalar extensões essenciais (ESLint, Prettier, etc)

- [ ] **Configurar Repositório**
  - [ ] Criar repositório Git (GitHub/GitLab)
  - [ ] Configurar .gitignore
  - [ ] Criar branch `main` e `develop`
  - [ ] Criar README.md inicial

- [ ] **Documentar Decisões**
  - [ ] Criar arquivo `DECISIONS.md` (arquitetura, bibliotecas escolhidas)
  - [ ] Documentar variáveis de ambiente necessárias
  - [ ] Criar `.env.example` template

---

### Fase 1: Design e Prototipação (Semana 1)

#### 1.1 Design System

- [ ] **Configurar Projeto de Design (Figma/Sketch)**
  - [ ] Criar arquivo de design system
  - [ ] Configurar cores do guia de estilo
  - [ ] Configurar tipografia
  - [ ] Criar componentes base (botões, inputs, cards)

- [ ] **Componentes UI Base**
  - [ ] Design de botões (primary, secondary, outline)
  - [ ] Design de inputs (text, email, password, select)
  - [ ] Design de cards
  - [ ] Design de modais/dialogs
  - [ ] Design de loading states
  - [ ] Design de empty states
  - [ ] Design de error states

#### 1.2 Telas - Área Pública (Cliente)

- [ ] **Landing Page / Home**
  - [ ] Layout desktop (hero, features, CTA)
  - [ ] Layout mobile (responsivo)
  - [ ] Definir copy/textos principais
  - [ ] Escolher imagens/fotos (stock ou custom)

- [ ] **Página de Agendamento (Fluxo Completo)**
  - [ ] Tela 1: Selecionar Profissional
  - [ ] Tela 2: Selecionar Serviço
  - [ ] Tela 3: Selecionar Data/Horário
  - [ ] Tela 4: Confirmar Agendamento
  - [ ] Tela 5: Confirmação Final
  - [ ] Design mobile-first (funciona bem no celular)

- [ ] **Página de Login/Cadastro**
  - [ ] Tela de Login
  - [ ] Tela de Cadastro
  - [ ] Tela de Recuperação de Senha
  - [ ] Integração com Google (design do botão)

- [ ] **Página "Meus Agendamentos"**
  - [ ] Lista de agendamentos futuros
  - [ ] Lista de agendamentos passados
  - [ ] Detalhes do agendamento
  - [ ] Botão de cancelar/reagendar

#### 1.3 Telas - CMS (Dono do Salão)

- [ ] **Layout Base do Dashboard**
  - [ ] Sidebar com navegação
  - [ ] Header com perfil/logout
  - [ ] Área de conteúdo principal
  - [ ] Design responsivo (mobile também)

- [ ] **Dashboard Principal**
  - [ ] Cards com estatísticas (agendamentos hoje, receita, etc)
  - [ ] Lista de próximos agendamentos
  - [ ] Gráfico simples (agendamentos por dia da semana)

- [ ] **Página de Serviços**
  - [ ] Lista de serviços (cards ou tabela)
  - [ ] Modal/formulário criar serviço
  - [ ] Modal/formulário editar serviço
  - [ ] Botão deletar/ativar-desativar

- [ ] **Página de Profissionais**
  - [ ] Lista de profissionais (cards com foto)
  - [ ] Modal/formulário criar profissional
  - [ ] Upload de foto
  - [ ] Vincular serviços ao profissional

- [ ] **Página de Agendamentos (Calendário)**
  - [ ] Visualização mensal (calendário)
  - [ ] Visualização semanal
  - [ ] Visualização diária
  - [ ] Modal com detalhes do agendamento
  - [ ] Ações: confirmar, cancelar, completar

- [ ] **Página de Configurações**
  - [ ] Configurações do salão (nome, endereço, telefone)
  - [ ] Horários de funcionamento
  - [ ] Configurações WhatsApp (API key, webhook)
  - [ ] Alterar senha

#### 1.4 Revisão e Aprovação

- [ ] **Revisar todos os designs**
  - [ ] Verificar consistência visual
  - [ ] Testar fluxos completos no design
  - [ ] Validar responsividade (mobile, tablet, desktop)
  - [ ] Revisar acessibilidade básica (contraste, tamanho de fonte)

- [ ] **Exportar Assets**
  - [ ] Exportar ícones como SVG
  - [ ] Exportar imagens em formatos otimizados
  - [ ] Criar pasta organizada de assets
  - [ ] Documentar onde cada asset será usado

---

### Fase 2: Setup Técnico e Estrutura Base (Semana 2)

#### 2.1 Configuração Inicial do Projeto

- [ ] **Clone e Setup Local**
  - [ ] Clonar repositório
  - [ ] Instalar dependências (`npm install`)
  - [ ] Verificar se projeto compila (`npm run dev`)
  - [ ] Testar build de produção (`npm run build`)

- [ ] **Configurar Ambiente**
  - [ ] Criar `.env.local` (baseado no `.env.example`)
  - [ ] Configurar variáveis Supabase
  - [ ] Configurar variáveis Next.js
  - [ ] Testar conexão com Supabase

- [ ] **Estrutura de Pastas**
  - [ ] Aplicar nova estrutura proposta (route groups)
  - [ ] Mover arquivos existentes para novas pastas
  - [ ] Criar pastas faltantes (vazias por enquanto)
  - [ ] Configurar path aliases no `tsconfig.json` (`@/components`, etc)

#### 2.2 Supabase Setup

- [ ] **Criar Schema no Banco**
  - [ ] Criar migration inicial (`profiles`, `salons`, `employees`, `services`, etc)
  - [ ] Executar migration no Supabase
  - [ ] Verificar tabelas criadas no dashboard
  - [ ] Criar índices necessários (performance)

- [ ] **Configurar RLS (Row Level Security)**
  - [ ] Habilitar RLS em todas as tabelas
  - [ ] Criar policies para `profiles`
  - [ ] Criar policies para `salons`
  - [ ] Criar policies para `services`
  - [ ] Criar policies para `employees`
  - [ ] Criar policies para `appointments`
  - [ ] Testar policies (verificar acesso correto)

- [ ] **Configurar Storage**
  - [ ] Criar bucket `professionals-photos`
  - [ ] Configurar policies de acesso
  - [ ] Testar upload de arquivo

- [ ] **Gerar Types do Supabase**
  - [ ] Instalar Supabase CLI
  - [ ] Executar `supabase gen types typescript`
  - [ ] Salvar types em `types/database.ts`
  - [ ] Verificar types estão corretos

#### 2.3 Migração Firebase → Supabase Auth

- [ ] **Instalar Dependências Supabase**
  - [ ] `@supabase/supabase-js`
  - [ ] `@supabase/auth-helpers-nextjs`
  - [ ] Verificar versões compatíveis

- [ ] **Criar Clientes Supabase**
  - [ ] Criar `lib/supabase/client.ts` (browser)
  - [ ] Criar `lib/supabase/server.ts` (server-side)
  - [ ] Criar `lib/supabase/middleware.ts`
  - [ ] Testar conexão de cada cliente

- [ ] **Migrar Autenticação**
  - [ ] Atualizar `AuthContext` para usar Supabase
  - [ ] Atualizar `AuthProvider` 
  - [ ] Atualizar função de login
  - [ ] Atualizar função de cadastro
  - [ ] Atualizar função de logout
  - [ ] Atualizar função de login social (Google)
  - [ ] Testar cada fluxo de auth

- [ ] **Atualizar Páginas de Auth**
  - [ ] Mover para `app/(auth)/login/page.tsx`
  - [ ] Mover para `app/(auth)/cadastro/page.tsx`
  - [ ] Mover para `app/(auth)/recuperar-senha/page.tsx`
  - [ ] Atualizar imports e lógica
  - [ ] Testar cada página

- [ ] **Criar Middleware de Auth**
  - [ ] Criar `middleware.ts` na raiz
  - [ ] Proteger rotas `/dashboard/*`
  - [ ] Redirecionar não autenticados para `/login`
  - [ ] Testar proteção de rotas

#### 2.4 Configurar Design System no Código

- [ ] **Configurar Tema Material-UI**
  - [ ] Criar tema customizado (`theme/theme.ts`)
  - [ ] Aplicar paleta de cores do design
  - [ ] Configurar tipografia
  - [ ] Configurar breakpoints (mobile-first)
  - [ ] Testar tema aplicado

- [ ] **Criar Componentes UI Base**
  - [ ] Criar `components/ui/Button/Button.tsx`
  - [ ] Criar `components/ui/Input/Input.tsx`
  - [ ] Criar `components/ui/Card/Card.tsx`
  - [ ] Criar `components/ui/Modal/Modal.tsx`
  - [ ] Documentar props de cada componente

- [ ] **Configurar Assets**
  - [ ] Adicionar logo em `public/logo.svg`
  - [ ] Adicionar favicon
  - [ ] Adicionar imagens do design system
  - [ ] Configurar Next.js Image optimization

---

### Fase 3: CMS - Dashboard e Gestão (Semana 3-4)

#### 3.1 Layout do Dashboard

- [ ] **Criar Layout Base**
  - [ ] Criar `app/(dashboard)/layout.tsx`
  - [ ] Criar componente `Sidebar`
  - [ ] Criar componente `DashboardHeader`
  - [ ] Layout responsivo (sidebar colapsa no mobile)
  - [ ] Testar navegação

- [ ] **Página Dashboard Principal**
  - [ ] Criar `app/(dashboard)/dashboard/page.tsx`
  - [ ] Buscar estatísticas do Supabase
  - [ ] Criar cards de estatísticas
  - [ ] Lista de próximos agendamentos
  - [ ] Gráfico simples (usar biblioteca ou CSS)

#### 3.2 CRUD de Serviços

- [ ] **Página Listar Serviços**
  - [ ] Criar `app/(dashboard)/servicos/page.tsx`
  - [ ] Buscar serviços do Supabase
  - [ ] Lista de cards ou tabela
  - [ ] Botão criar novo serviço
  - [ ] Filtros (ativos/inativos)

- [ ] **Formulário Criar/Editar Serviço**
  - [ ] Criar componente `ServiceForm`
  - [ ] Campos: nome, descrição, duração, preço
  - [ ] Validação client-side (Zod ou Yup)
  - [ ] Integração com Supabase (insert/update)
  - [ ] Feedback de sucesso/erro
  - [ ] Testar criar serviço
  - [ ] Testar editar serviço

- [ ] **Ações de Serviço**
  - [ ] Botão editar (abre modal com form)
  - [ ] Botão deletar (com confirmação)
  - [ ] Toggle ativar/desativar
  - [ ] Testar cada ação

#### 3.3 CRUD de Profissionais

- [ ] **Página Listar Profissionais**
  - [ ] Criar `app/(dashboard)/profissionais/page.tsx`
  - [ ] Buscar profissionais do Supabase
  - [ ] Cards com foto, nome, especialidades
  - [ ] Botão criar novo profissional
  - [ ] Filtros (ativos/inativos)

- [ ] **Formulário Criar/Editar Profissional**
  - [ ] Criar componente `EmployeeForm`
  - [ ] Campos: nome, foto, especialidades
  - [ ] Upload de foto (Supabase Storage)
  - [ ] Preview da foto após upload
  - [ ] Validação client-side
  - [ ] Integração com Supabase (insert/update)
  - [ ] Testar criar profissional
  - [ ] Testar editar profissional

- [ ] **Vincular Profissionais a Serviços**
  - [ ] Adicionar campo de serviços no form
  - [ ] Seleção múltipla de serviços
  - [ ] Salvar relacionamento `service_employees`
  - [ ] Testar vínculo

- [ ] **Ações de Profissional**
  - [ ] Botão editar
  - [ ] Botão deletar (com confirmação)
  - [ ] Toggle ativar/desativar
  - [ ] Testar cada ação

#### 3.4 Calendário de Agendamentos

- [ ] **Instalar Biblioteca de Calendário**
  - [ ] Escolher biblioteca (`react-big-calendar` ou similar)
  - [ ] Instalar dependência
  - [ ] Configurar localização (pt-BR)

- [ ] **Página de Agendamentos**
  - [ ] Criar `app/(dashboard)/agendamentos/page.tsx`
  - [ ] Visualização mensal
  - [ ] Visualização semanal
  - [ ] Visualização diária
  - [ ] Botões de navegação (anterior/próximo)
  - [ ] Buscar agendamentos do Supabase

- [ ] **Eventos no Calendário**
  - [ ] Renderizar agendamentos como eventos
  - [ ] Cores diferentes por status
  - [ ] Mostrar nome do cliente, serviço, horário
  - [ ] Click no evento abre modal de detalhes

- [ ] **Modal de Detalhes do Agendamento**
  - [ ] Mostrar informações completas
  - [ ] Botão confirmar (muda status)
  - [ ] Botão cancelar (muda status)
  - [ ] Botão completar (muda status)
  - [ ] Testar cada ação

#### 3.5 Página de Configurações

- [ ] **Página de Configurações**
  - [ ] Criar `app/(dashboard)/configuracoes/page.tsx`
  - [ ] Seção: Dados do Salão
  - [ ] Seção: Horários de Funcionamento
  - [ ] Seção: WhatsApp
  - [ ] Seção: Segurança (alterar senha)

- [ ] **Configurar Dados do Salão**
  - [ ] Formulário: nome, endereço, telefone, WhatsApp
  - [ ] Buscar dados existentes
  - [ ] Salvar no Supabase
  - [ ] Testar atualização

- [ ] **Configurar Horários**
  - [ ] Formulário para cada dia da semana
  - [ ] Campos: horário abertura, fechamento
  - [ ] Checkbox "fechado" para dias sem funcionamento
  - [ ] Salvar como JSONB no Supabase
  - [ ] Testar salvamento

---

### Fase 4: Área Pública - Agendamento (Semana 5-6)

#### 4.1 Landing Page

- [ ] **Criar Landing Page**
  - [ ] Criar `app/(public)/page.tsx`
  - [ ] Hero section com CTA
  - [ ] Seção de features
  - [ ] Seção de como funciona
  - [ ] Footer
  - [ ] Design responsivo
  - [ ] Otimizar SEO básico (meta tags)

#### 4.2 Fluxo de Agendamento - Passo 1: Profissional

- [ ] **Refatorar Página de Agendamento**
  - [ ] Mover para `app/(public)/agendamento/page.tsx`
  - [ ] Manter stepper (4 passos)
  - [ ] Integrar com novo layout público

- [ ] **Componente SelectProfessional**
  - [ ] Atualizar `select-professional.tsx`
  - [ ] Buscar profissionais do Supabase (ativos)
  - [ ] Mostrar cards com foto e nome
  - [ ] Seleção única (radio ou click no card)
  - [ ] Salvar seleção em estado/context
  - [ ] Validação: deve selecionar antes de avançar
  - [ ] Testar seleção

#### 4.3 Fluxo de Agendamento - Passo 2: Serviço

- [ ] **Componente SelectService**
  - [ ] Atualizar `select-service.tsx`
  - [ ] Buscar serviços do Supabase (ativos)
  - [ ] Filtrar serviços do profissional selecionado (ou todos)
  - [ ] Cards com nome, descrição, duração, preço
  - [ ] Seleção única
  - [ ] Salvar seleção em estado
  - [ ] Validação: deve selecionar antes de avançar
  - [ ] Testar seleção

#### 4.4 Fluxo de Agendamento - Passo 3: Data/Horário

- [ ] **Criar Lógica de Disponibilidade**
  - [ ] Criar `lib/utils/appointment.ts`
  - [ ] Função: buscar horários disponíveis
  - [ ] Função: calcular disponibilidade baseado em:
    - Horários de funcionamento do salão
    - Agendamentos existentes
    - Duração do serviço
  - [ ] Função: gerar slots de horário (ex: 09:00, 09:30, 10:00...)
  - [ ] Testar lógica com dados mock

- [ ] **Componente SelectTime**
  - [ ] Atualizar `select-time.tsx`
  - [ ] Buscar agendamentos do Supabase
  - [ ] Calcular horários disponíveis
  - [ ] Seletor de data (date picker)
  - [ ] Lista de horários disponíveis
  - [ ] Desabilitar horários ocupados
  - [ ] Salvar data/horário selecionado
  - [ ] Validação: deve selecionar antes de avançar
  - [ ] Testar seleção

#### 4.5 Fluxo de Agendamento - Passo 4: Confirmação

- [ ] **Componente ConfirmAppointment**
  - [ ] Atualizar `confirm-appointment.tsx`
  - [ ] Mostrar resumo completo:
    - Profissional selecionado
    - Serviço selecionado
    - Data e horário
    - Duração e preço
  - [ ] Campos adicionais (notas, telefone se não logado)
  - [ ] Botão confirmar
  - [ ] Botão voltar

- [ ] **API de Criação de Agendamento**
  - [ ] Criar `app/api/appointments/route.ts`
  - [ ] Endpoint POST para criar agendamento
  - [ ] Validação server-side
  - [ ] Verificar disponibilidade antes de criar
  - [ ] Salvar no Supabase
  - [ ] Retornar sucesso/erro

- [ ] **Integrar Confirmação com API**
  - [ ] Chamar API ao clicar em confirmar
  - [ ] Mostrar loading durante criação
  - [ ] Feedback de sucesso (modal ou toast)
  - [ ] Redirecionar após sucesso
  - [ ] Tratar erros (horário ocupado, etc)
  - [ ] Testar criação completa

#### 4.6 Página "Meus Agendamentos"

- [ ] **Página Meus Agendamentos**
  - [ ] Criar `app/(public)/meus-agendamentos/page.tsx`
  - [ ] Verificar autenticação (redirecionar se não logado)
  - [ ] Buscar agendamentos do cliente logado
  - [ ] Separar futuros e passados
  - [ ] Cards com informações do agendamento

- [ ] **Detalhes do Agendamento**
  - [ ] Modal ou página com detalhes completos
  - [ ] Informações: data, horário, profissional, serviço, status
  - [ ] Botão cancelar (se status permitir)
  - [ ] Botão reagendar (se status permitir)

- [ ] **Cancelar Agendamento**
  - [ ] Validação: só pode cancelar até X horas antes
  - [ ] Confirmação antes de cancelar
  - [ ] Atualizar status no Supabase
  - [ ] Feedback ao usuário
  - [ ] Testar cancelamento

- [ ] **Reagendar**
  - [ ] Abrir fluxo de seleção de novo horário
  - [ ] Validar disponibilidade
  - [ ] Atualizar agendamento existente
  - [ ] Testar reagendamento

---

### Fase 5: Integração WhatsApp (Semana 7-8)

#### 5.1 Setup Meta Business API

- [ ] **Criar Conta Meta Business**
  - [ ] Criar conta Meta Business
  - [ ] Verificar número de telefone (pode demorar alguns dias)
  - [ ] Criar aplicativo no Meta for Developers
  - [ ] Configurar WhatsApp Business API
  - [ ] Obter credenciais:
    - API Key
    - Phone Number ID
    - Business Account ID
    - Webhook Verify Token
  - [ ] Salvar credenciais no `.env.local` (não commitar!)

- [ ] **Criar Tabela de Configuração**
  - [ ] Criar migration para `whatsapp_config`
  - [ ] Executar migration
  - [ ] Configurar RLS para tabela

#### 5.2 Webhook Básico

- [ ] **Criar Endpoint Webhook**
  - [ ] Criar `app/api/webhooks/whatsapp/route.ts`
  - [ ] Implementar verificação do webhook (GET)
  - [ ] Meta envia challenge para verificar
  - [ ] Implementar recebimento de mensagens (POST)
  - [ ] Validar assinatura do webhook (segurança)
  - [ ] Testar webhook localmente (usar ngrok ou similar)

- [ ] **Configurar Webhook no Meta**
  - [ ] Configurar URL do webhook no Meta Business
  - [ ] Configurar eventos a receber (messages)
  - [ ] Testar recebimento de mensagem
  - [ ] Salvar mensagem recebida no log (para debug)

#### 5.3 Cliente WhatsApp API

- [ ] **Criar Cliente WhatsApp**
  - [ ] Criar `lib/whatsapp/client.ts`
  - [ ] Função: enviar mensagem de texto
  - [ ] Função: enviar template aprovado
  - [ ] Função: validar número de telefone
  - [ ] Tratamento de erros
  - [ ] Testar envio de mensagem

- [ ] **Templates de Mensagens**
  - [ ] Criar `lib/whatsapp/templates.ts`
  - [ ] Template: confirmação de agendamento
  - [ ] Template: lembrete 24h antes
  - [ ] Template: cancelamento
  - [ ] Submeter templates no Meta (aprovação leva alguns dias)
  - [ ] Testar envio de template após aprovação

#### 5.4 Fluxo de Agendamento via WhatsApp (MVP Simples)

- [ ] **Lógica de Conversação Básica**
  - [ ] Criar `lib/whatsapp/webhook.ts`
  - [ ] Processar mensagem recebida
  - [ ] Extrair número do remetente
  - [ ] Identificar intenção (menu simples: "1", "2", etc)
  - [ ] Responder com menu inicial

- [ ] **Fluxo: Menu Inicial**
  - [ ] Cliente envia mensagem qualquer
  - [ ] Bot responde: "Olá! Escolha uma opção: 1 - Agendar, 2 - Ver meus agendamentos"
  - [ ] Salvar estado da conversa (em memória ou banco)
  - [ ] Testar fluxo

- [ ] **Fluxo: Agendar (Opção 1)**
  - [ ] Pedir: "Qual seu nome?"
  - [ ] Salvar nome
  - [ ] Pedir: "Qual seu telefone?"
  - [ ] Validar telefone
  - [ ] Listar serviços disponíveis
  - [ ] Cliente escolhe serviço
  - [ ] Listar profissionais disponíveis
  - [ ] Cliente escolhe profissional
  - [ ] Listar horários disponíveis
  - [ ] Cliente escolhe horário
  - [ ] Confirmar agendamento
  - [ ] Criar agendamento no banco
  - [ ] Enviar confirmação via WhatsApp
  - [ ] Testar fluxo completo

- [ ] **Fluxo: Ver Agendamentos (Opção 2)**
  - [ ] Pedir telefone
  - [ ] Buscar agendamentos do cliente
  - [ ] Listar agendamentos futuros
  - [ ] Testar fluxo

- [ ] **Melhorias Básicas**
  - [ ] Tratamento de erros (resposta inválida)
  - [ ] Timeout de conversa (reset após X minutos)
  - [ ] Mensagens de ajuda
  - [ ] Testar edge cases

#### 5.5 Integrar WhatsApp com Sistema

- [ ] **Notificações Automáticas**
  - [ ] Lembrete 24h antes do agendamento
  - [ ] Criar função que roda periodicamente (cron job ou Edge Function)
  - [ ] Buscar agendamentos do dia seguinte
  - [ ] Enviar mensagem para cada cliente
  - [ ] Testar envio de lembrete

- [ ] **Confirmação via WhatsApp**
  - [ ] Quando agendamento criado via site, enviar confirmação WhatsApp (se número fornecido)
  - [ ] Integrar no endpoint de criação
  - [ ] Testar integração

---

### Fase 6: PWA e Otimizações (Semana 9)

#### 6.1 Configurar PWA

- [ ] **Instalar next-pwa**
  - [ ] Instalar `next-pwa`
  - [ ] Configurar `next.config.mjs`
  - [ ] Testar se gera service worker

- [ ] **Criar Manifest**
  - [ ] Criar `public/manifest.json`
  - [ ] Configurar nome, descrição, ícones
  - [ ] Configurar cores do tema
  - [ ] Configurar modo de exibição
  - [ ] Testar manifest

- [ ] **Criar Ícones**
  - [ ] Criar ícone 192x192
  - [ ] Criar ícone 512x512
  - [ ] Criar favicon 16x16, 32x32
  - [ ] Salvar em `public/icons/`
  - [ ] Referenciar no manifest

- [ ] **Testar Instalação**
  - [ ] Testar instalação no Android (Chrome)
  - [ ] Testar instalação no desktop
  - [ ] Verificar ícone na home screen
  - [ ] Verificar splash screen

#### 6.2 Performance

- [ ] **Otimizar Imagens**
  - [ ] Usar componente `Image` do Next.js em todas as imagens
  - [ ] Configurar dimensões corretas
  - [ ] Lazy loading automático
  - [ ] Verificar Lighthouse score (imagens)

- [ ] **Code Splitting**
  - [ ] Verificar que rotas estão sendo code-split
  - [ ] Lazy load componentes pesados (calendário, gráficos)
  - [ ] Verificar bundle size

- [ ] **Cache**
  - [ ] Configurar cache headers (Next.js)
  - [ ] Service worker caching (next-pwa)
  - [ ] Cache de assets estáticos
  - [ ] Testar funcionamento offline básico

#### 6.3 Melhorias UX

- [ ] **Loading States**
  - [ ] Adicionar skeletons/loaders em todas as telas
  - [ ] Loading em botões durante ações
  - [ ] Verificar todas as telas têm feedback visual

- [ ] **Error Handling**
  - [ ] Criar componente ErrorBoundary
  - [ ] Tratar erros de API
  - [ ] Mensagens de erro amigáveis
  - [ ] Testar cenários de erro

- [ ] **Notificações Web Push**
  - [ ] Configurar Web Push (opcional, pode deixar para depois)
  - [ ] Solicitar permissão
  - [ ] Enviar notificação de teste

---

### Fase 7: Testes e Preparação para Launch (Semana 10)

#### 7.1 Testes Funcionais

- [ ] **Testar Fluxo Completo - Cliente**
  - [ ] Cadastro de cliente
  - [ ] Login
  - [ ] Agendamento completo (4 passos)
  - [ ] Ver meus agendamentos
  - [ ] Cancelar agendamento
  - [ ] Reagendar

- [ ] **Testar Fluxo Completo - Dono do Salão**
  - [ ] Cadastro de salão
  - [ ] Login
  - [ ] Criar serviços
  - [ ] Criar profissionais
  - [ ] Visualizar calendário
  - [ ] Confirmar agendamento
  - [ ] Configurar horários

- [ ] **Testar Fluxo WhatsApp**
  - [ ] Receber mensagem
  - [ ] Menu inicial
  - [ ] Agendamento via WhatsApp
  - [ ] Ver agendamentos via WhatsApp
  - [ ] Lembrete automático

- [ ] **Testes de Edge Cases**
  - [ ] Tentar agendar horário ocupado
  - [ ] Tentar cancelar agendamento muito próximo
  - [ ] Tentar acessar área protegida sem login
  - [ ] Testar com múltiplos salões

#### 7.2 Testes de Performance

- [ ] **Lighthouse Audit**
  - [ ] Performance score > 90
  - [ ] Accessibility score > 90
  - [ ] Best Practices score > 90
  - [ ] SEO score > 90
  - [ ] Corrigir issues encontrados

- [ ] **Testes de Carga Básicos**
  - [ ] Testar com múltiplos usuários simultâneos
  - [ ] Verificar tempo de resposta
  - [ ] Verificar uso de recursos (Supabase)

#### 7.3 Preparação de Deploy

- [ ] **Configurar Variáveis de Ambiente**
  - [ ] Configurar variáveis no Vercel
  - [ ] Configurar variáveis no Supabase (se necessário)
  - [ ] Documentar todas as variáveis necessárias

- [ ] **Deploy em Staging**
  - [ ] Fazer deploy em ambiente de staging
  - [ ] Testar todas as funcionalidades em staging
  - [ ] Corrigir bugs encontrados

- [ ] **Configurar Domínio**
  - [ ] Configurar DNS no provedor
  - [ ] Apontar para Vercel
  - [ ] Configurar SSL (automático no Vercel)
  - [ ] Testar acesso via domínio

- [ ] **Deploy em Produção**
  - [ ] Fazer deploy em produção
  - [ ] Verificar que tudo funciona
  - [ ] Testar URLs públicas
  - [ ] Configurar webhook WhatsApp com URL de produção

#### 7.4 Documentação e Finalização

- [ ] **Documentação**
  - [ ] Atualizar README.md com instruções de setup
  - [ ] Documentar variáveis de ambiente
  - [ ] Criar guia básico de uso (para donos de salão)
  - [ ] Documentar processo de deploy

- [ ] **Checklist Final**
  - [ ] Todas as funcionalidades implementadas
  - [ ] Testes passando
  - [ ] Performance ok
  - [ ] Sem erros no console
  - [ ] Responsivo em todos os dispositivos
  - [ ] Domínio configurado
  - [ ] WhatsApp funcionando
  - [ ] PWA instalável

---

### Pós-Launch (Ongoing)

- [ ] Monitorar erros (Sentry ou similar)
- [ ] Coletar feedback de usuários
- [ ] Planejar próximas features
- [ ] Melhorias baseadas em uso real

---

**✅ Total de tarefas detalhadas**: ~200+ tarefas organizadas em 7 fases

**⏱️ Tempo estimado**: 8-10 semanas (desenvolvimento em tempo parcial)

**📊 Metodologia**: Marcar tarefas como concluídas conforme progresso para ter visibilidade clara do avanço do projeto