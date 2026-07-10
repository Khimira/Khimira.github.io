---
title: "Rede Segura: Tailscale + Nginx Proxy Manager"
actionTitle: "Serviços internos com segurança via VPN Mesh e proxy reverso"
summary: >
  Camada de rede que conecta homelab, VPS e dispositivos pessoais em uma
  malha privada (Tailscale), com Nginx Proxy Manager cuidando de roteamento
  e certificados SSL automáticos para os serviços expostos.
protocol: "Redes / Intermediate"
difficulty: "Intermediate"
runtime: ["Tailscale", "Nginx Proxy Manager", "SSL/TLS"]
readTime: "5 min"
date: 2025-09-02
featured: true
tags: ["vpn", "redes", "ssl", "reverse-proxy", "secops"]
---

## Contexto

Serviços rodando em máquinas fisicamente distintas (homelab local + VPS na
nuvem) precisavam se comunicar de forma segura, sem expor portas
desnecessárias à internet pública.

## O que foi feito

- Configuração de uma *VPN Mesh* com Tailscale, unindo homelab, VPS e
  dispositivos pessoais em uma rede privada ponto-a-ponto.
- Implantação do Nginx Proxy Manager como proxy reverso central, com
  emissão e renovação automática de certificados SSL/TLS.
- Segmentação de acesso: apenas os serviços que realmente precisam de
  exposição pública passam pelo proxy; o restante fica isolado na malha
  privada.

## Resultado

Superfície de ataque reduzida, tráfego entre nós sempre criptografado, e
acesso remoto a qualquer serviço interno como se estivesse na mesma rede
local — sem portas abertas desnecessárias no firewall.
