# Plano de Reestruturação do Projeto

Este documento descreve o plano detalhado para reorganizar a estrutura do projeto seguindo as melhores práticas definidas no `GUIA_DESENVOLVIMENTO.md` e o `plano_de_reestruturação_-_agenda_inteligente_36174712.plan.md`.

## 📊 Análise da Estrutura Atual vs Proposta

### Estrutura Atual (Legado)

```
src/
├── app/
│   ├── agendamento/          # ❌ Deve ir para (public)
│   ├── assets/               # ❌ Assets devem ir para public/
│   ├── cadastro/             # ❌ Deve ir para (auth)
│   ├── login/                # ❌ Deve ir para (auth)
│   ├── recuperar-senha/      # ❌ Deve ir para (auth)
│   ├── page.tsx              # ✅ Manter (será landing page)
│   └── layout.tsx            # ✅ Manter (root layout)
├── components/
│   ├── dumb/                 # ❌ Nomenclatura não ideal
│   ├── smart/                # ❌ Vazio, remover
│   └── themeRegistry.tsx     # ✅ Manter (mover para lib/)
├── context/
│   └── auth/                 # ✅ Manter estrutura
├── lib/
│   └── firebase/             # ⚠️ Será migrado para Supabase
├── models/                   # ⚠️ Deve ir para types/
└── utils/                    # ✅ Manter
```

### Estrutura Proposta (Novo Padrão)

```
src/
├── app/
│   ├── (auth)/               # 🆕 Route group: Autenticação
│   │   ├── login/
│   │   ├── cadastro/
│   │   └── recuperar-senha/
│   ├── (dashboard)/          # 🆕 Route group: CMS do salão
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   ├── profissionais/
│   │   ├── servicos/
│   │   ├── agendamentos/
│   │   └── configuracoes/
│   ├── (public)/             # 🆕 Route group: Área pública
│   │   ├── layout.tsx
│   │   ├── page.tsx          # Landing page
│   │   ├── agendamento/
│   │   └── meus-agendamentos/
│   ├── api/                  # 🆕 API Routes
│   │   ├── appointments/
│   │   └── webhooks/
│   ├── globals.scss          # ✅ Manter
│   └── layout.tsx            # ✅ Root layout
├── components/
│   ├── ui/                   # 🆕 Componentes UI reutilizáveis
│   ├── features/             # 🆕 Componentes específicos de features
│   └── layout/               # 🆕 Componentes de layout
├── lib/
│   ├── supabase/             # 🆕 Cliente Supabase (substitui firebase)
│   ├── whatsapp/             # 🆕 Integração WhatsApp
│   └── utils/                # ✅ Utilitários
├── hooks/                    # ✅ Custom hooks
├── types/                    # 🆕 Types TypeScript (substitui models)
└── utils/                    # ✅ Utilitários gerais
public/                       # 🆕 Assets estáticos (move de app/assets)
├── images/
├── icons/
└── fonts/
```

---

## 📋 Plano de Execução - Passo a Passo

### Fase 1: Preparação e Backup (Antes de Começar)

#### 1.1 Backup e Commit

- [ ] **Fazer commit do estado atual**
  ```bash
  git add .
  git commit -m "chore: backup antes de reestruturação"
  ```

- [ ] **Criar branch para reestruturação**
  ```bash
  git checkout -b refactor/restructure-project
  ```

#### 1.2 Verificar Dependências

- [ ] Verificar se todas as dependências estão instaladas
- [ ] Testar se projeto compila: `npm run build`
- [ ] Documentar imports que precisarão ser atualizados

---

### Fase 2: Criar Nova Estrutura de Pastas (Sem Modificar Código)

#### 2.1 Criar Route Groups

- [ ] **Criar `app/(auth)/`**
  ```
  app/(auth)/
  ├── login/
  │   └── page.tsx (será movido)
  ├── cadastro/
  │   └── page.tsx (será movido)
  └── recuperar-senha/
      └── page.tsx (será movido)
  ```

- [ ] **Criar `app/(public)/`**
  ```
  app/(public)/
  ├── layout.tsx (novo - layout público)
  ├── page.tsx (será movido de app/page.tsx)
  └── agendamento/ (será movido)
  ```

- [ ] **Criar `app/(dashboard)/`**
  ```
  app/(dashboard)/
  ├── layout.tsx (novo - layout do CMS)
  └── dashboard/ (novo - será criado depois)
  ```

- [ ] **Criar `app/api/`**
  ```
  app/api/
  ├── appointments/ (novo)
  └── webhooks/ (novo)
  ```

#### 2.2 Criar Estrutura de Componentes

- [ ] **Criar `components/ui/`** (vazio por enquanto)
- [ ] **Criar `components/features/`** (vazio por enquanto)
- [ ] **Criar `components/layout/`** (vazio por enquanto)

#### 2.3 Criar Estrutura de Libs e Types

- [ ] **Criar `lib/supabase/`** (será criado depois na migração)
- [ ] **Criar `lib/whatsapp/`** (será criado depois)
- [ ] **Criar `lib/utils/`**
- [ ] **Criar `types/`** (substitui models/)

#### 2.4 Mover Assets para public/

- [ ] **Criar `public/images/`** e mover `app/assets/images/*`
- [ ] **Criar `public/fonts/`** e mover `app/assets/fonts/*`
- [ ] **Criar `public/icons/`** (para ícones futuros)
- [ ] **Remover `app/assets/`** após mover tudo

---

### Fase 3: Reorganizar Arquivos Existentes

#### 3.1 Mover Páginas de Autenticação

- [ ] **Mover `app/login/` → `app/(auth)/login/`**
  - Mover `page.tsx`
  - Mover `login.module.scss`
  - Atualizar imports em `page.tsx`

- [ ] **Mover `app/cadastro/` → `app/(auth)/cadastro/`**
  - Mover `page.tsx`
  - Atualizar imports

- [ ] **Mover `app/recuperar-senha/` → `app/(auth)/recuperar-senha/`**
  - Mover `page.tsx`
  - Atualizar imports

#### 3.2 Mover Páginas Públicas

- [ ] **Mover `app/page.tsx` → `app/(public)/page.tsx`**
  - Atualizar imports

- [ ] **Mover `app/agendamento/` → `app/(public)/agendamento/`**
  - Mover toda a pasta com subpastas
  - Atualizar imports em todos os arquivos

#### 3.3 Reorganizar Componentes

- [ ] **Mover `components/dumb/header/` → `components/layout/Header/`**
  - Renomear arquivos para PascalCase:
    - `header.tsx` → `Header.tsx`
    - `header.module.scss` → `Header.module.scss`
  - Atualizar imports em `app/layout.tsx`

- [ ] **Mover `components/dumb/icon-social/` → `components/ui/IconSocial/`**
  - Reorganizar:
    ```
    components/ui/IconSocial/
    ├── IconGoogle.tsx
    ├── IconFacebook.tsx
    └── index.ts
    ```
  - Atualizar imports

- [ ] **Remover `components/dumb/` e `components/smart/`**

#### 3.4 Reorganizar Models e Types

- [ ] **Mover `models/client.model.tsx` → `types/client.ts`**
  - Converter `.tsx` para `.ts`
  - Atualizar nome do arquivo (sem `.model`)

- [ ] **Mover `models/register.model.tsx` → `types/register.ts`**
  - Converter `.tsx` para `.ts`
  - Atualizar nome do arquivo

- [ ] **Remover pasta `models/`**

#### 3.5 Reorganizar Utils e Lib

- [ ] **Mover `components/themeRegistry.tsx` → `lib/utils/themeRegistry.tsx`**
  - Atualizar imports em `app/layout.tsx`

- [ ] **Mover `app/assets/theme/` → `lib/utils/theme/`**
  - Manter `colors.ts` e `theme.tsx`
  - Atualizar imports

- [ ] **Criar `lib/utils/` se necessário**
  - Para futuras funções utilitárias

---

### Fase 4: Atualizar Imports e Configurações

#### 4.1 Atualizar Imports de Assets

Buscar e substituir todos os imports de imagens/fonts:

```typescript
// ❌ ANTES
import logo from '@/app/assets/images/logoBarber.png'
import imgProfile from '@/app/assets/images/imgProfile.webp'

// ✅ DEPOIS
import logo from '/images/logoBarber.png'
import imgProfile from '/images/imgProfile.webp'
```

**Arquivos a atualizar:**
- [ ] `app/(public)/agendamento/select-professional/select-professional.tsx`
- [ ] Qualquer outro arquivo que importe de `app/assets/`

#### 4.2 Atualizar Imports de Componentes

```typescript
// ❌ ANTES
import Header from '@/components/dumb/header/header'
import IconGoogle from '@/components/dumb/icon-social/icon-google/icon'

// ✅ DEPOIS
import { Header } from '@/components/layout/Header'
import { IconGoogle } from '@/components/ui/IconSocial'
```

**Arquivos a atualizar:**
- [ ] `app/layout.tsx`
- [ ] `app/(auth)/login/page.tsx`
- [ ] Qualquer outro arquivo que use componentes

#### 4.3 Atualizar Imports de Types

```typescript
// ❌ ANTES
import ClientModel from '@/models/client.model'
import RegisterClientModel from '@/models/register.model'

// ✅ DEPOIS
import type { Client } from '@/types/client'
import type { RegisterClient } from '@/types/register'
```

**Arquivos a atualizar:**
- [ ] `app/(auth)/login/page.tsx`
- [ ] `app/(auth)/cadastro/page.tsx`

#### 4.4 Atualizar Imports de Routes

```typescript
// ❌ ANTES (se existir)
import { LOGIN_ROUTES } from '@/utils/routes'
router.push(LOGIN_ROUTES)

// ✅ DEPOIS
import { LOGIN_ROUTES } from '@/utils/routes'
router.push(LOGIN_ROUTES) // Mantém, mas pode atualizar para '/login'
```

#### 4.5 Atualizar Imports de Theme

```typescript
// ❌ ANTES
import { Colors } from '@/app/assets/theme/colors'
import ThemeRegistry from '@/components/themeRegistry'

// ✅ DEPOIS
import { Colors } from '@/lib/utils/theme/colors'
import { ThemeRegistry } from '@/lib/utils/themeRegistry'
```

**Arquivos a atualizar:**
- [ ] `app/layout.tsx`
- [ ] Qualquer componente que use `Colors`

---

### Fase 5: Criar Layouts e Configurações

#### 5.1 Criar Layout Público

- [ ] **Criar `app/(public)/layout.tsx`**
  ```typescript
  export default function PublicLayout({ children }) {
    return (
      <>
        <Header />
        <main>{children}</main>
        <Footer /> {/* Criar depois */}
      </>
    );
  }
  ```

#### 5.2 Criar Layout do Dashboard (Esqueleto)

- [ ] **Criar `app/(dashboard)/layout.tsx`**
  ```typescript
  export default function DashboardLayout({ children }) {
    return (
      <div>
        <Sidebar /> {/* Criar depois */}
        <main>{children}</main>
      </div>
    );
  }
  ```

#### 5.3 Atualizar Root Layout

- [ ] **Atualizar `app/layout.tsx`**
  - Remover `Header` daqui (vai para layouts específicos)
  - Manter `ThemeRegistry` e `AuthProvider`
  - Manter estrutura básica

---

### Fase 6: Criar Arquivos de Configuração

#### 6.1 Atualizar tsconfig.json

- [ ] **Adicionar paths específicos (se necessário)**
  ```json
  {
    "compilerOptions": {
      "paths": {
        "@/*": ["./src/*"],
        "@/components/*": ["./src/components/*"],
        "@/lib/*": ["./src/lib/*"],
        "@/types/*": ["./src/types/*"]
      }
    }
  }
  ```

#### 6.2 Criar .env.example

- [ ] **Criar arquivo `.env.example`**
  ```
  # Supabase
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_ANON_KEY=
  
  # WhatsApp (Meta Business API)
  WHATSAPP_API_KEY=
  WHATSAPP_PHONE_NUMBER_ID=
  WHATSAPP_BUSINESS_ACCOUNT_ID=
  WHATSAPP_WEBHOOK_VERIFY_TOKEN=
  ```

#### 6.3 Atualizar .gitignore

- [ ] **Verificar se `.env.local` está no `.gitignore`**
- [ ] **Adicionar pastas temporárias se necessário**

---

### Fase 7: Testes e Validação

#### 7.1 Testes de Compilação

- [ ] **Testar build**
  ```bash
  npm run build
  ```
  - Resolver erros de compilação
  - Atualizar imports faltantes

- [ ] **Testar dev server**
  ```bash
  npm run dev
  ```
  - Verificar se todas as páginas carregam
  - Verificar se não há erros no console

#### 7.2 Testes de Navegação

- [ ] **Testar rotas de autenticação**
  - `/login` → deve funcionar
  - `/cadastro` → deve funcionar
  - `/recuperar-senha` → deve funcionar

- [ ] **Testar rotas públicas**
  - `/` → landing page
  - `/agendamento` → fluxo de agendamento

- [ ] **Verificar se rotas antigas redirecionam** (opcional)
  - Criar redirects no `next.config.mjs` se necessário

#### 7.3 Validação de Imports

- [ ] **Buscar imports quebrados**
  ```bash
  # Usar grep ou buscar por padrões
  grep -r "@/app/assets" src/
  grep -r "@/components/dumb" src/
  grep -r "@/models" src/
  ```

- [ ] **Corrigir todos os imports encontrados**

---

### Fase 8: Limpeza e Finalização

#### 8.1 Remover Arquivos/Pastas Não Utilizados

- [ ] **Remover `app/assets/`** (após mover tudo)
- [ ] **Remover `components/dumb/` e `components/smart/`**
- [ ] **Remover `models/`**
- [ ] **Limpar imports não utilizados**

#### 8.2 Atualizar Documentação

- [ ] **Atualizar README.md** com nova estrutura
- [ ] **Documentar mudanças** (changelog ou commit message)

#### 8.3 Commit e Merge

- [ ] **Fazer commit final**
  ```bash
  git add .
  git commit -m "refactor: reorganiza estrutura do projeto seguindo melhores práticas"
  ```

- [ ] **Testar novamente**
  - Build deve passar
  - Dev server deve funcionar
  - Navegação deve funcionar

- [ ] **Merge para develop/main**
  ```bash
  git checkout develop
  git merge refactor/restructure-project
  ```

---

## 🔍 Checklist de Validação Final

Antes de considerar a reestruturação completa:

### Estrutura de Pastas

- [ ] Todos os route groups criados: `(auth)`, `(dashboard)`, `(public)`
- [ ] Assets movidos para `public/`
- [ ] Componentes reorganizados: `ui/`, `features/`, `layout/`
- [ ] Models convertidos para `types/`
- [ ] Libs organizadas: `supabase/`, `whatsapp/`, `utils/`

### Imports e Referências

- [ ] Nenhum import quebrado (projeto compila)
- [ ] Todos os paths relativos atualizados
- [ ] Imports usando aliases `@/*` quando apropriado

### Funcionalidade

- [ ] Todas as rotas funcionando
- [ ] Componentes renderizando corretamente
- [ ] Imagens/assets carregando
- [ ] Navegação funcionando

### Configuração

- [ ] `tsconfig.json` atualizado
- [ ] `.env.example` criado
- [ ] `.gitignore` verificado

---

## 📝 Notas Importantes

### Ordem de Execução

**IMPORTANTE**: Execute as fases na ordem apresentada para evitar quebrar o projeto:

1. **Fase 1**: Backup (sempre primeiro!)
2. **Fase 2**: Criar pastas (não move arquivos ainda)
3. **Fase 3**: Mover arquivos
4. **Fase 4**: Atualizar imports
5. **Fase 5**: Criar layouts
6. **Fase 6**: Configurações
7. **Fase 7**: Testes
8. **Fase 8**: Limpeza

### Estratégia de Migração

- **Incremental**: Mover arquivos em lotes pequenos
- **Testar frequentemente**: Após cada grupo de mudanças
- **Commitar regularmente**: Commits pequenos e frequentes
- **Rollback fácil**: Manter branch original até validação completa

### Arquivos que NÃO Devem Ser Movidos (Ainda)

- `app/layout.tsx` - Root layout, fica onde está
- `app/globals.scss` - Fica onde está
- `lib/firebase/` - Será migrado para Supabase depois (Fase 1 do plano geral)
- `context/auth/` - Fica onde está até migração para Supabase

### Próximos Passos Após Reestruturação

Após completar esta reestruturação:

1. Migração Firebase → Supabase (Fase 1 do plano geral)
2. Implementação do CMS (Fase 2 do plano geral)
3. Melhorias no fluxo de agendamento (Fase 3 do plano geral)

---

## 🚀 Como Executar

### Opção 1: Manual (Recomendado para Aprendizado)

Seguir cada fase passo a passo, validando após cada mudança.

### Opção 2: Script de Migração (Futuro)

Criar scripts Node.js para automatizar movimentação de arquivos (após validação manual).

---

**Criado em**: Dezembro 2024  
**Versão**: 1.0.0  
**Status**: Pronto para execução
