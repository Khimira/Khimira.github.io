---
title: "Extração e Engenharia Reversa de Firmware SoC"
actionTitle: "Extraia e modifique firmware de dispositivos SoC em bare metal"
summary: >
  Processo de extração de firmware diretamente do chip de dispositivos
  System-on-Chip usando um programador CH341A, seguido de engenharia reversa
  com Ghidra para entender e modificar o comportamento do sistema.
protocol: "Reverse Engineering / Advanced"
difficulty: "Advanced"
runtime: ["CH341A", "Ghidra", "Bare Metal"]
readTime: "8 min"
date: 2026-06-09
featured: true
tags: ["engenharia-reversa", "firmware", "ghidra", "hardware"]
---

## Contexto

Dispositivos com firmware corrompido ou travado em bootloop, sem suporte
oficial de recuperação, precisavam ser diagnosticados e restaurados a nível
de hardware.

## O que foi feito

- Leitura direta da memória flash do chip *SoC* utilizando um programador
  CH341A, contornando a necessidade de acesso via software ao sistema
  operacional do próprio dispositivo.
- Análise do binário extraído com Ghidra, identificando estruturas,
  rotinas de boot e pontos de falha em nível de assembly.
- Modificação controlada do firmware e regravação no chip, validando cada
  etapa antes de reconectar o dispositivo à sua placa original.

## Resultado

Recuperação de dispositivos considerados "sem conserto" por vias
convencionais, além de conhecimento prático aplicável a análise de malware
embarcado e auditoria de firmware.
