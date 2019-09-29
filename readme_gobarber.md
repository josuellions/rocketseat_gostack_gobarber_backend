### Aula 01 - Configurando Muller - Upload arquivo

|-> Instalar biblioteca
|-> yarn add multer
|-> criar pasta "tmp/uploads" fora da "src"
|-> criar arquivo multer.js no diretorio config
|-> Configurando upload de arquivo
|-> importar multer e config/multer para arquivo router.js
|-> criar a router no arquivo router.js

========================================================================================================================

### Aula 02 - Avatar Usuário - salvar no BD

|-> Criar no diretorio controllers
|-> Arquivo FileControlle.js
|-> importar no router o FileControlle
|-> extrair para FileControlle a função req, res -> add FileControlle.store
|-> Criar nova migration para salvar file - img Avatar
|-> yarn sequelize migration:create --name=create-files
|-> ajustar dados da tabela no arquivo gerado em database/migrations
|-> yarn sequelize db:migrate
|-> Criar model no diretorio model
|-> File.js
|-> importar file.js em diretorio database/index.js
|-> importar no FileControlle -> model/File
|-> criar nova migration para atualizar a tabela de user
|-> yarn sequelize migration:create --name=add-avatar-field-to-users
|-> ajustar dados da tabela no arquivo gerado em database/migrations
|-> yarn sequelize db:migrate
|-> Criar metodo de associação com avatar do usuário
|-> editar o arquivo model/user.js
|-> associação em database/index.js -> novo map

========================================================================================================================

### Aula 03 - Listagem de prestadores serviço

|-> Criar nova router
|-> get '/providers'
|-> importar ProviderController
|-> Criar nova controllers ProviderController
|-> importar model User
|-> importar model File -> para exibir dados avatar
|-> Criar apleido para coluna avatar_id
|-> model User -> associate => 'avatar_id', as: 'avatar'
|-> Criar retorno de URL para acesso imagem do avatar
|-> model File.js
|-> Criar campo virtualaula_13_notificacaolidas
|-> Permitir acesso a imagem avatar server (express.static)
|-> arquivo app.js -> middlewares
|-> importar Path

========================================================================================================================

### Aula 04 - Migration e model de agendamento

|-> Criar migration
|-> yarn sequelize migration:create --name=create-appointments
|-> config tabela arquivo da migration
|-> yarn sequelize db:migrate
|-> Criar arquivo model 'Appointment.js'
|-> Referenciar model/Appointment.js em database/index.js

========================================================================================================================

### Aula 05 - Agendamento Serviço

|-> Criar controllers - AppointmentController.js
|-> Criar router - router.js => AppointmentController

========================================================================================================================

#### Aula 06 - Validações e Agendamento

|-> Instalar biblioteca para tratar datas
|-> yarn add date-fns@next -> instala a versão atual
|-> importar no arquivo controllers/AppointmentController.js
|-> import { startOfHour, parseISO, isBefore } from 'date-fns';
|-> criar metodo depois da varificação "checkIsProvider"
|-> hourStart -> para transformar horas quebras em horas cheias

========================================================================================================================

### Aula 07 - Listando Agendamentos do usuario

|-> Criar metodo index na AppointmentController
|-> importar model/File.js
|-> Criar routa no arquivo router.js

========================================================================================================================

### Aula 08 - Paginação Listando Agendamentos do usuario

|-> Cria metodo na AppointmentController
|-> limit: 20, //limite de registro list da page
|-> offset: (page -1 ) \* 20, //calcula qtd registro por page e pula de 20->20

========================================================================================================================

### Aula 09 - Listando Agendamentos do prestadores

|-> Criar controllers -> ScheduleController.js
|-> importar model Appointment.js
|-> importar model User
|-> criar routa no arquivo router.js

========================================================================================================================

### Aula 10 - Configurando MongoDB -> BD não estruturada - não relacional

|-> Criar nova instancia do Docker - Terminal
|-> docker run --name mongobarber -p 27017:27017 -d -t mongo
|-> verificar se mongo está rodando
|-> pelo navegador -> localhost:27017
|-> se retornar a mensagem abaixo esta ok
|-> "It looks like you are trying to access MongoDB over HTTP on the native driver port."
|-> instalar o mongoose para acesso BD
|-> yarn add mongoose
|-> Criar novo metodo em database/index
|-> importar o moongose
|-> add na class Database -> constructor this.mongo();

========================================================================================================================

### Aula 11 - Notificando novos Agendamentos

|-> Criar pasta app/schemas -> salvar a estrutura de tabelas do MongoDB
|-> Cria arquivo Notification.js
|-> importar mongoose
|-> Na controllers AppointmentController
|-> Add novo metodo depois do metodo Appointment.create
|-> importa schemas -> '/schemas/Notification'
|-> importar { format } no 'date-fns' -> para formatar data
|-> importar 'date-fns/locale/pt' -> para formatar escrita mês
|-> acessar panel do MongoDB
|-> verificar se criou a Notification

========================================================================================================================

### Aula 12 - Listando Notificações do usuário

|-> Criar NotificationController
|-> Importar 'schemas/Notification'
|-> Importar '../models/User'
|-> Importar nas router -> NotificationController
|-> Criar routa get -> notifications

========================================================================================================================

### Aula 13 - Marcar Notificações como lidas

|-> criar router com recebimento de id
|-> criar metodo update na controllers NotificationController

========================================================================================================================

### Aula 14 - Cancelamento de agendamento

|-> criar router com recebimento de id
|-> criar metodo delete na controllers AppointmentController
|-> importar subHours em 'date-fns' -> para subtrair horas

========================================================================================================================

### Aular 15 - Configurando envio de Email - Nodemailer

|-> Instalar biblioteca
|-> yarn add nodemailer
|-> Cria uma config
|-> mail.js
|-> obs: serviços de envio de emails
|-> Amazon SES / Mailgun / Sparkpost / Mandril(Mailchimp)
|-> GMAIL (possui limite de envio)
|-> Mailtrap(DEV) -> somente para ambiente desenvolvimento
|-> acessar -> https://mailtrap.io/
|-> login: gmail josuellions
|-> Configurar com as credenciais
|-> Cria diretorio "lib" na raiz "src"
|-> Criar arquivo Mail.js -> recebe as config adicionais emails
|-> Configurar Appointyarn add nodemailer-express-handlebarsmentController
|-> importa /lib/Mail.js
|-> criar o metodo de envio apos o cancelamento de agendamento

========================================================================================================================

### Aular 16 - Configurando Template de envio de Email

|-> Instalar bibliotecas
|-> yarn add express-handlebars
|-> yarn add nodemailer-express-handlebars
|-> Importar em /lib/Mail.js
|-> Importar 'path' -> import { resolve } from 'path';
|-> Criar diretorio src/app
|-> views (dir)
|-> emails (dir)
|-> cancellation.hbs (arq)
|-> layouts (dir)
|-> default.hbs (arq)
|-> partials (dir)
|-> footer.hbs (arq)
|-> Configurar no AppointmentController

========================================================================================================================

### Aula 17 - Configurando Filas com Redis(BD -> sem estrutura somete chave e valor)

|-> criar Docker
|-> docker run --name redisbarber -p 6379:6379 -d -t redis:alpine
|-> ver.linux base
|-> Instalar
|-> yarn add bee-queue
|-> Criar arquivo
|-> /lib/Queue.js (config fila - backgroud - jobs)
|-> Criar diretorio "app/jobs"
|-> CancellationMail.js
|-> Mover do AppointmentController -> função Mail.SendMail
|-> Criar /config
|-> redis.js
|-> Criar /src
|-> queue.js
|-> Premite executar as filas de jobs em outro server ou Terminal
Para não impactar na performace de nossa aplicação e melhorar a
performace de execução da jobs.
|-> Add no package.json
|-> "scripts": { "queue": "nodemon src/queue.js"
|-> para exec: -> yarn queue

========================================================================================================================

### Aula 18 - Monitorando falhas na Fila

|-> Editar /lib/Queue
|-> processQueue
|-> criar funcção => handleFailure()
|-> para teste altera nome da funcção sendMail em CancellationMail

========================================================================================================================

### Aula 19 - Listando horários disponíveis

|-> criar router providers/:providerId/avaliable
|-> Cria controllers -> AvaliableController.js

OBs: como pegar data timestap no Terminal chome
|-> new Date().getTime()
|-> retorno => 1567483422869

========================================================================================================================

### Aula 20 - Campos viruais no agendamento

|-> Editar models/Appointment.js
|-> Criar campo virtual -> past: {...}
|-> Criar campo virtual -> cancelable
|-> import { isBefore, subHours } from 'date-fns'
|-> Editar AppointmentController
|-> appointments de index -> list
|->add em -> atributes: ['past','cancelable']

========================================================================================================================

### Aula 21 - Tratamento de exceções

|-> Ferramentas de monitoramento
|-> bugsnag -> https://www.bugsnag.com/
|-> sentry.io -> https://sentry.io/welcome/
|-> login: github -> josuellions
|-> yarn add @sentry/node@5.6.2
|-> importar no app.js
|-> importar config do sentry.js
|-> criar um config -> sentry.js
|-> copiar url do site sentry.io do projeto
|-> app.js -> depois de instanciar o this.server = express();
|-> Sentry.init(sentryConfig);
|-> middlewares
|-> this.server.use(Sentry.Handlers.requestHandler());
|-> routes
|-> this.server.use(Sentry.Handlers.errorHandler());
|-> instala Ferramentas do express para capturar erros
|-> yarn add express-async-errors
|-> importar no app.js
|-> Para testar
|-> editar qualquer nome de metodo
|-> criar no construtor depois das this.router() em app.js
|-> this.exceptionHandler() -> instanciar
|-> criar a função depos de router
|-> instalar ferramenta para retornar mensagem para user quando tiver erro
|-> yarn youch
|-> importar app.js
Obs: atenção a order de import

========================================================================================================================

### Aula 22 - Variáveis ambiente

|-> São as variaveis que podem ser alterada dependendo do ambiente que estiver rodando
|-> exemplo: variável de conexão com banco dados
|-> Criar arquivo na raiz do projeto
|-> gobarber/.env
|-> add no .gitignore
|-> Instalar
|-> instalar plugin DocENV para formatar arq
|-> yarn add dotenv
|-> Importar no inicio de app.js
|-> carregar todas as variaveis definidas
|-> coloca dentro de process.env.
|-> importar para fila -> queue.js
|-> importar no database.js -> com require
|-> atualizar as variaveis nos arquivos

========================================================================================================================
END MODULO - 03
