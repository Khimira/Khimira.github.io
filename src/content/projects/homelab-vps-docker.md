---
title: "Homelab & VPS: Infraestrutura Containerizada"
actionTitle: "Orquestre uma infraestrutura híbrida Homelab + VPS com Docker"
summary: >
  Ambiente de produção pessoal rodando em uma VPS na Oracle Cloud e em
  hardware local (homelab), com serviços conteinerizados via Docker e CasaOS,
  monitoramento contínuo e automação de deploys e backups.
protocol: "Linux / Beginner"
difficulty: "Beginner"
runtime: ["Docker", "CasaOS", "Oracle Cloud", "Debian"]
readTime: "6 min"
date: 2025-08-10
featured: true
tags: ["docker", "linux", "infra", "cloud", "self-hosting"]
---

## Contexto

Eu precisava de um ambiente confiável para hospedar serviços pessoais e de
laboratório — desde ferramentas de automação até experimentos de segurança —
sem depender inteiramente de provedores gerenciados.

## O que foi feito

- Provisionamento e hardening de servidores Debian e Ubuntu através do Arch Linux e Windows tanto em VPS (Oracle Cloud) quanto em hardware local (homelab).
- Orquestração de todos os serviços via **Docker**, com **CasaOS** como camada de gerenciamento visual para containers e volumes.
- Rotinas de monitoramento e automação para manter os serviços saudáveis sem intervenção manual constante.

## Resultado

Um ambiente híbrido replicável, documentado e resiliente, usado como base
para testes de novas ferramentas de segurança e automação antes de qualquer
deploy em produção.
