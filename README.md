# Guia de Instalação e Execução

Este documento descreve os passos necessários para configurar e executar o projeto SmartCall em um novo ambiente de desenvolvimento.

## Sobre o Projeto

O projeto é dividido em duas partes principais:
* **Backend:** Uma API RESTful construída com C# e ASP.NET Core.
* **Frontend:** Um site estático construído com HTML, CSS e JavaScript puro.

## 1. Pré-requisitos de Software

Antes de começar, garanta que você tenha as seguintes ferramentas instaladas na sua máquina:

* **.NET SDK (versão 8 ou superior):** [Link para download](https://dotnet.microsoft.com/download)
* **SQL Server Express:** A versão gratuita do banco de dados da Microsoft. [Link para download](https://www.microsoft.com/pt-br/sql-server/sql-server-downloads)
    * **Importante:** Durante a instalação, inclua o **SQL Server Management Studio (SSMS)** ou instale o **Azure Data Studio** para gerenciar o banco.
* **Git:** Para clonar o repositório. [Link para download](https://git-scm.com/downloads)
* **Visual Studio Code:** O editor de código que usaremos. [Link para download](https://code.visualstudio.com/)
* **Ferramentas do Entity Framework Core:** É uma ferramenta de linha de comando. Para instalar, abra um terminal e rode:
    ```bash
    dotnet tool install --global dotnet-ef
    ```
* **Extensão para o VS Code:**
    * Dentro do VS Code, vá na aba de Extensões (Ctrl+Shift+X) e instale o **Live Server**.

## 2. Configuração do Backend (API em C#)

Siga estes passos no seu terminal (PowerShell ou Git Bash).

1.  **Clonar o Repositório:**
    Navegue até a pasta onde deseja salvar o projeto e execute:
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO_GIT>
    cd nome-da-pasta-do-projeto/backend/
    ```

2.  **Restaurar as Dependências:**
    O .NET precisa baixar todos os pacotes que o projeto utiliza (Entity Framework, JWT, etc.).
    ```bash
    dotnet restore
    ```

3.  **Configurar a String de Conexão:**
    * Abra o arquivo `src/SmartCall.API/appsettings.json`.
    * Verifique se a `DefaultConnection` está correta para a sua instalação do SQL Server. A padrão (`Server=localhost\\SQLEXPRESS;...`) geralmente funciona para instalações padrão.

4.  **Criar o Banco de Dados e as Tabelas:**
    Este comando executa as "migrações" e cria a estrutura do banco de dados para você. **Execute este comando de dentro da pasta da API**.
    ```bash
    cd src/SmartCall.API
    dotnet ef database update
    ```

5.  **Executar a API:**
    Ainda na pasta `src/SmartCall.API`, inicie o servidor do backend.
    ```bash
    dotnet run
    ```
    > O terminal mostrará que o servidor está rodando (ex: `Now listening on: https://localhost:7123`). **Deixe este terminal aberto e rodando.**

## 3. Configuração do Frontend (HTML/CSS/JS)

1.  **Abra o Projeto no VS Code:**
    Abra uma **nova janela** do Visual Studio Code e vá em `Arquivo > Abrir Pasta...` para abrir a pasta do seu projeto frontend (a que contém o `index.html`).

2.  **Inicie o Live Server:**
    * No painel de arquivos à esquerda, encontre o arquivo `index.html`.
    * Clique com o botão direito sobre ele.
    * Selecione a opção **"Open with Live Server"**.

    Uma nova aba do seu navegador será aberta (geralmente no endereço `http://127.0.0.1:5500`) com a sua landing page.

## 4. Resumo da Execução

Para trabalhar no projeto, você sempre precisará de **dois processos rodando ao mesmo tempo**:

1.  **Um terminal rodando o backend
