``src/contexts/communications/`` **(Lógica de Negócio)**

## Domain Layer (O Coração Puro)

``models:`` Perfeito. Suas entidades de negócio (Contact), agregados e value objects (PhoneNumber) vivem aqui. Zero dependências externas.

``repositories:`` Ótimo. Aqui você define as interfaces (contratos) que dizem o que o domínio precisa em termos de persistência (ex: AbstractContactRepository com um método save(contact)).

``exceptions:`` Excelente! Definir exceções customizadas do seu domínio (ex: InvalidContactError) torna seu código muito mais explícito e fácil de tratar.

## Application Layer (O Orquestrador)

``use_cases:`` Continua sendo o lugar para a lógica dos casos de uso (ex: CreateContactUseCase).

``dtos`` (Data Transfer Objects): Adição fantástica! Use DTOs para transferir dados entre as camadas. Por exemplo, a UI envia um CreateContactDTO para o CreateContactUseCase. Isso evita que suas entidades de domínio "vazem" para as camadas externas.

``ports:`` Outro conceito avançado e excelente. Em Arquitetura Hexagonal, "Ports" são as interfaces que a aplicação expõe. Seus repositories do domínio e as interfaces de quaisquer outros serviços externos (ex: um serviço de notificação) podem ser considerados "portas". Você pode optar por colocar todas as interfaces aqui ou manter as de repositório no domínio. Manter em ports é muito explícito.

## Infrastructure Layer (Os Detalhes Concretos)

``repositories:`` Perfeito. Aqui ficam as implementações concretas das interfaces definidas no domínio (ex: SqliteContactRepository).

``models:`` Ótimo! Se você usar um ORM como SQLAlchemy, aqui ficariam os modelos específicos do ORM. Isso separa seu modelo de domínio (domain/models) do modelo de persistência.

``mappers:`` Essencial para a separação acima. Um ContactMapper seria responsável por converter um domain.models.Contact em um infrastructure.models.ContactORM e vice-versa.

``services:`` Ótimo para implementações concretas de serviços externos (ex: uma classe que usa a biblioteca requests para se comunicar com uma API).

``migrations:`` Perfeito para gerenciar as versões do seu schema de banco de dados (ex: usando Alembic).

### serializers / views: Essas pastas são mais comuns em contextos de API web (Django/FastAPI). Em um app Kivy:

``serializers:`` Pode ser útil se você precisar consumir ou expor dados em JSON para uma API externa.

``views:`` É a única que pode gerar um pouco de dúvida. Num app Kivy, suas "views" são as telas em mobileApplication/core/screens. Você pode manter essa pasta para uma futura API ou simplesmente removê-la no contexto mobile.

## Fluxo de Exemplo: "Criar um Contato"

Para ilustrar como funciona, veja o fluxo de uma ação simples:

``UI (core/screens/home_screen.py):`` O usuário preenche um formulário e clica em "Salvar". A UI cria um DTO com os dados.

> contact_data = CreateContactDTO(name="Fulano", phone="1234-5678")

A UI chama o Caso de Uso ``application/use_cases/create_contact.py):``

> create_contact_use_case.execute(contact_data)

### O Caso de Uso:

Recebe o CreateContactDTO.

Valida os dados.

Usa uma Factory para criar uma entidade de domínio: ``new_contact = Contact.create(...).``

Chama o método da interface do repositório: ``self.contact_repository.save(new_contact).``

A Injeção de Dependência: Direciona a chamada para a implementação concreta em ``infrastructure/repositories/sqlite_contact_repository.py.``

### O Repositório Concreto:

Recebe a entidade de domínio new_contact.

Usa um Mapper ``(infrastructure/mappers/contact_mapper.py)`` para converter a entidade de domínio em um modelo de ORM ``(ex: ContactORM)``.

Salva o modelo ORM no banco de dados.