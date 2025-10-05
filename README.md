# 🍷 Cellar - App de Produtos

Um aplicativo React Native desenvolvido com Expo para listagem de produtos com sistema de favoritos e notificações push***.

## 📋 Menu

- [🚀 Como Rodar a Aplicação](#-como-rodar-a-aplicação)
- [⚙️ Configuração do Firebase](#️-configuração-do-firebase)
- [🔧 Variáveis de Ambiente](#-variáveis-de-ambiente)
- [📱 Testando no Dispositivo](#-testando-no-dispositivo)
- [🔔 Testando Notificações Push](#-testando-notificações-push)
- [🧪 Testes Unitários](#-testes-unitários)
- [🏗️ Decisões Técnicas](#️-decisões-técnicas)
- [📚 Tecnologias Utilizadas](#-tecnologias-utilizadas)

---

## 📱 Dica Importante - Notificações Push

> 💡 **Para testar notificações push**, você precisará de um **dispositivo físico** (celular ou tablet Android/iOS).
> 
> **Por que?** O Expo Go não suporta mais notificações push, e as notificações requerem serviços nativos que não estão disponíveis em:
> - 📱 Emuladores Android
> - 📱 Simuladores iOS  
> - 📱 Expo Go

---

## 🚀 Como Rodar a Aplicação

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Expo CLI: `npm install -g @expo/cli`
- Dispositivo físico ou emulador Android/iOS

### Instalação

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd cellar
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   ```bash
   cp env.example .env
   ```
   Edite o arquivo `.env` com suas configurações do Firebase (veja seção [Variáveis de Ambiente](#-variáveis-de-ambiente))

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npx expo start
   ```

### Opções de Execução

- **Expo Go (Desenvolvimento):**
  ```bash
   npx expo start
   ```
  - Escaneie o QR code com o app Expo Go
  - ⚠️ **Limitação:** Notificações push não funcionam no Expo Go

- **Dispositivo Android:**
  ```bash
   npx expo run:android
   ```

- **Dispositivo iOS:**
  ```bash
   npx expo run:ios
   ```

- **Web:**
  ```bash
   npx expo start --web
   ```

## ⚙️ Configuração do Firebase

### 1. Criar Projeto no Firebase Console

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Digite o nome do projeto (ex: "cellar-app")
4. Configure o Google Analytics (opcional)
5. Clique em "Criar projeto"

### 2. Configurar Authentication

1. No painel do Firebase, vá em **Authentication**
2. Clique em **Começar**
3. Na aba **Sign-in method**, habilite:
   - **Email/Password**
   - **Google** (opcional)

### 3. Configurar Firestore Database

1. Vá em **Firestore Database**
2. Clique em **Criar banco de dados**
3. Escolha **Começar no modo de teste**
4. Selecione uma localização (ex: us-central1)

### 4. Configurar Cloud Messaging (FCM)

1. Vá em **Cloud Messaging**
2. Clique em **Começar**
3. Anote o **Server Key** (será usado para enviar notificações)

### 5. Obter Configurações do Projeto

1. Vá em **Configurações do projeto** (ícone de engrenagem)
2. Na aba **Geral**, role até "Seus apps"
3. Clique em **Adicionar app** → **Web** (ícone `</>`)
4. Digite um nome para o app
5. Copie as configurações do Firebase

## 🔧 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# API Configuration
API_BASE_URL=https://fakestoreapi.com

# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=sua_api_key_aqui
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### Como obter cada variável:

- **API_BASE_URL:** URL da API externa (FakeStore API para este projeto)
- **API Key:** Configurações do projeto → Geral → Configuração do SDK
- **Auth Domain:** `seu-projeto-id.firebaseapp.com`
- **Project ID:** Nome do seu projeto no Firebase
- **Storage Bucket:** `seu-projeto-id.appspot.com`
- **Messaging Sender ID:** Configurações do projeto → Cloud Messaging
- **App ID:** Configurações do projeto → Geral → Configuração do SDK

## 📱 Testando no Dispositivo

> ⚠️ **IMPORTANTE:** Para testar **notificações push**, você **DEVE** usar um dispositivo físico. Emuladores, simuladores e Expo Go não suportam notificações push.

### Opção 1: EAS Build (Recomendado)

1. **Instale o EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```

2. **Faça login:**
   ```bash
   eas login
   ```

3. **Configure o projeto:**
   ```bash
   eas build:configure
   ```

4. **Gere APK para Android:**
   ```bash
   eas build --platform android --profile preview
   ```

5. **Baixe e instale o APK:**
   - O comando acima gerará um link para download
   - Instale o APK no seu dispositivo Android
   - ⚠️ **Importante:** Habilite "Fontes desconhecidas" nas configurações do Android

### Opção 2: Build Local

1. **Para Android:**
   ```bash
   npx expo run:android
   ```

2. **Para iOS:**
   ```bash
   npx expo run:ios
   ```

### Opção 3: Expo Development Build

1. **Instale o Expo Go no dispositivo**
2. **Execute o servidor:**
   ```bash
   npx expo start
   ```
3. **Escaneie o QR code**
4. ⚠️ **Limitação:** Notificações não funcionam no Expo Go

## 🔔 Testando Notificações Push

> ⚠️ **IMPORTANTE:** As notificações push **SÓ FUNCIONAM em dispositivos físicos**. Não funcionam em emuladores, simuladores ou no Expo Go.

### 1. Configurar Expo Push Notifications

1. **Instale o Expo CLI:**
   ```bash
   npm install -g @expo/cli
   ```

2. **Faça login:**
   ```bash
   expo login
   ```

3. **Configure o projeto:**
   ```bash
   npx expo install expo-notifications
   ```

### 2. Obter Token de Push

> 📱 **OBRIGATÓRIO:** Execute o app **APENAS em dispositivo físico** (Android ou iOS)

1. **Execute o app no dispositivo físico:**
   ```bash
   npx expo run:android  # Para Android
   # ou
   npx expo run:ios      # Para iOS
   ```

2. **Verifique os logs do console** para o token:
   ```
   [Notifications] Token: ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]
   ```

3. **⚠️ Se não aparecer o token:**
   - Verifique se está em dispositivo físico (não emulador)
   - Verifique se as permissões foram concedidas
   - Reinicie o app

### 3. Enviar Notificação de Teste

#### Método 1: Expo Push Tool

1. Acesse [Expo Push Tool](https://expo.dev/notifications)
2. Cole o token obtido
3. Digite título e mensagem
4. Clique em "Send Push Notification"

#### Método 2: cURL

```bash
curl -H "Content-Type: application/json" \
     -H "Accept: application/json" \
     -X POST \
     -d '{
       "to": "ExponentPushToken[SEU_TOKEN_AQUI]",
       "title": "Teste de Notificação",
       "body": "Esta é uma notificação de teste do Cellar!",
       "data": {"test": "data"}
     }' \
     https://exp.host/--/api/v2/push/send
```

#### Método 3: Script Node.js

Crie um arquivo `send-notification.js`:

```javascript
const { Expo } = require('expo-server-sdk');

const expo = new Expo();

async function sendPushNotification() {
  const messages = [{
    to: 'ExponentPushToken[SEU_TOKEN_AQUI]',
    sound: 'default',
    title: 'Teste do Cellar',
    body: 'Notificação de teste enviada com sucesso!',
    data: { test: 'data' },
  }];

  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];

  for (const chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
    }
  }

  console.log('Tickets:', tickets);
}

sendPushNotification();
```

Execute:
```bash
node send-notification.js
```

### 4. Verificar Recebimento

> 📱 **Lembre-se:** As notificações só funcionam em **dispositivos físicos**!

- **App em primeiro plano:** Notificação aparece como banner
- **App em segundo plano:** Notificação aparece na barra de status
- **App fechado:** Notificação aparece no centro de notificações

### 5. Troubleshooting - Notificações Não Funcionam

**❌ Não funciona em:**
- Emuladores Android
- Simuladores iOS
- Expo Go

**✅ Funciona apenas em:**
- Dispositivos Android físicos
- Dispositivos iOS físicos
- Development builds instalados no dispositivo

**🔧 Se ainda não funcionar:**
1. Verifique se o dispositivo tem conexão com internet
2. Confirme se as permissões de notificação foram concedidas
3. Reinicie o app completamente
4. Verifique se o token foi gerado corretamente
5. Teste com uma notificação simples primeiro

---

## 🧪 Testes Unitários

### Como Executar os Testes

1. **Executar todos os testes:**
   ```bash
   npm test
   ```

2. **Executar testes com cobertura:**
   ```bash
   npm test -- --coverage
   ```

3. **Executar testes em modo watch:**
   ```bash
   npm test -- --watch
   ```

4. **Executar testes específicos:**
   ```bash
   npm test -- --testPathPattern="nome-do-arquivo"
   ```
---

## 🏗️ Decisões Técnicas

### Arquitetura

O projeto segue a **Clean Architecture** com separação clara de responsabilidades:

```
src/
├── core/           # Regras de negócio
│   ├── domain/     # Entidades e interfaces
│   └── usecases/   # Casos de uso
├── data/           # Implementação dos repositórios
│   ├── datasources/ # Fontes de dados (local/remote)
│   └── repositories/ # Implementação dos repositórios
├── infrastructure/ # Configurações externas
│   ├── firebase/   # Configuração do Firebase
│   └── http/       # Cliente HTTP
└── presentation/   # Interface do usuário
    ├── components/ # Componentes reutilizáveis
    ├── contexts/   # Contextos React
    ├── hooks/      # Hooks customizados
    ├── navigation/ # Navegação
    └── screens/    # Telas da aplicação
```

### Padrões Utilizados

- **Repository Pattern:** Abstração da camada de dados
- **Dependency Injection:** Inversão de controle
- **Observer Pattern:** Para notificações push
- **Factory Pattern:** Para criação de datasources

### Gerenciamento de Estado

- **React Query:** Para cache e sincronização de dados
- **React Context:** Para estado global (AuthContext)
- **React Hook Form:** Para formulários
- **Zod:** Para validação de schemas

### Navegação

- **React Navigation v7:** Navegação nativa
- **Stack Navigator:** Para fluxos de autenticação
- **Bottom Tabs:** Para navegação principal

### Autenticação

- **Firebase Auth:** Autenticação segura
- **AsyncStorage:** Persistência local
- **AuthGuard:** Proteção de rotas

### Notificações Push

- **Expo Notifications:** Sistema escolhido para push notifications
- **Firebase Cloud Messaging:** Configurado no código mas comentado
- **Decisão:** Priorizou simplicidade e facilidade de teste sobre configuração nativa

**Por que Expo Notifications?**
- ✅ Zero configuração nativa necessária
- ✅ Funciona no managed workflow do Expo
- ✅ Cross-platform com mesmo código
- ✅ Ideal para prototipagem e testes rápidos
- ✅ FCM está configurado e pode ser ativado se necessário

**FCM Configurado:**
- ✅ `FCMDataSource.ts` - Implementação completa
- ✅ `firebase/config.ts` - Configuração do messaging
- ✅ Comentários explicativos para ativação
- ⚠️ Requer eject do Expo para funcionar

## 📚 Tecnologias Utilizadas

### Core
- **React Native 0.81.4:** Framework mobile
- **Expo ~54.0.12:** Plataforma de desenvolvimento
- **TypeScript ~5.9.2:** Tipagem estática

### UI/UX
- **React Navigation:** Navegação
- **Expo Vector Icons:** Ícones
- **Expo Linear Gradient:** Gradientes
- **Expo Blur:** Efeitos de blur

### Estado e Dados
- **TanStack Query:** Cache e sincronização
- **React Hook Form:** Formulários
- **Zod:** Validação

### Backend e Serviços
- **Firebase:** Backend as a Service
  - Authentication
  - Firestore Database
  - Cloud Messaging
- **Axios:** Cliente HTTP

### Notificações
- **Expo Notifications:** Push notifications
- **Expo Device:** Informações do dispositivo
- **Expo Constants:** Configurações do app

> 💡 **Decisão Técnica - Notificações:** O projeto usa **Expo Notifications** em vez de Firebase Cloud Messaging (FCM) para facilitar o desenvolvimento e testes. O FCM está **configurado no código** mas comentado - para usar seria necessário configurar partes nativas (eject do Expo). Expo Notifications oferece funcionalidade completa sem complexidade adicional.

### Utilitários
- **AsyncStorage:** Armazenamento local
- **Debounce:** Otimização de performance
- **Logger:** Sistema de logs

### Desenvolvimento
- **ESLint:** Linting
- **Prettier:** Formatação de código
- **TypeScript:** Tipagem estática

## 🎯 Por que Expo?

O Expo foi escolhido para este projeto pelos seguintes motivos:

### Vantagens para Desenvolvimento
- **Rapidez:** Setup inicial em minutos
- **Simplicidade:** Sem necessidade de configurar Android Studio/Xcode
- **Hot Reload:** Desenvolvimento ágil
- **Over-the-Air Updates:** Atualizações sem lojas

### Vantagens para Desafios Técnicos
- **Foco no Negócio:** Menos tempo com configuração, mais tempo com features
- **Prototipagem Rápida:** Ideal para MVPs e testes de conceito
- **Ecosystem Rico:** Bibliotecas prontas para uso
- **Documentação Excelente:** Facilita aprendizado e implementação

### Limitações Conhecidas
- **Expo Go:** Notificações push não funcionam
- **Bibliotecas Nativas:** Algumas podem não estar disponíveis
- **Customização:** Limitações em modificações nativas profundas

### Soluções Implementadas
- **EAS Build:** Para builds customizados quando necessário
- **Development Build:** Para testar notificações em desenvolvimento
- **Expo Modules:** Para funcionalidades nativas específicas
