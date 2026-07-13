---
title: "Prompt Injection: quando o texto vira vetor de ataque"
summary: >
  Notas técnicas sobre como instruções maliciosas embutidas em conteúdo
  externo podem sequestrar o comportamento de sistemas baseados em LLM, e
  quais camadas de defesa realmente ajudam.
date: 2026-06-09
tags: ["ia", "secops", "llm", "prompt-injection"]
difficulty: "Intermediate"
readTime: "7 min"
---

## O problema

Sistemas que combinam modelos de linguagem com acesso a ferramentas
(navegação, e-mail, arquivos) tratam qualquer texto que processam como
potencial fonte de instruções — inclusive conteúdo vindo de terceiros. Isso
abre espaço para *prompt injection*: instruções maliciosas escondidas em
uma página web, um documento ou um e-mail que tentam redirecionar o
comportamento do agente.

## Por que é diferente de uma vulnerabilidade tradicional

Em uma aplicação clássica, dados e código são domínios separados. Em um
sistema baseado em LLM, o "código" (a instrução) e o "dado" (o conteúdo
processado) competem pelo mesmo canal: o texto. Isso torna a defesa
estrutural mais difícil do que um simples filtro de entrada.

## Camadas de mitigação que fazem diferença

- **Separação de privilégios**: ferramentas com efeitos colaterais (enviar,
  deletar, publicar) exigem confirmação explícita do usuário, nunca execução
  automática a partir de conteúdo externo.
- **Sanitização de contexto**: tratar conteúdo de terceiros como dado
  não-confiável, nunca como instrução do usuário.
- **Observabilidade**: registrar decisões do agente para permitir auditoria
  quando um comportamento inesperado ocorrer.

## Conclusão

Não existe uma solução única que elimina o risco por completo — a defesa
eficaz combina arquitetura (separação de canais), políticas de execução
(confirmação humana para ações sensíveis) e monitoramento contínuo.
