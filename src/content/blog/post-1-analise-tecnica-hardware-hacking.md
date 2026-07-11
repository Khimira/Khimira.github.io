---
title: "A Anatomia do Bolso: Como o Hardware Hacking Virou Portátil"
summary: >
  Notas sobre como dispositivos como o Flipper Zero foram criados.
date: 2026-06-11
tags: ["pentest", "flipperzero", "security"]
difficulty: "Beginner"
readTime: "10 min"
---


Há uma diferença enorme entre "quebrar um sistema" e "carregar a ferramenta que quebra o sistema no bolso da calça". A primeira sempre existiu — testes de intrusão remontam aos anos 1960, quando o MIT viu seu recém-criado sistema de tempo compartilhado (CTSS) ser subvertido por um pesquisador que queria mais tempo de processamento. A segunda é recente, e é sobre ela que este texto trata: a jornada do hacking de hardware, do laboratório trancado à fio até dispositivo do tamanho de um controle remoto.

## Das "Tiger Teams" ao software de auditoria

A formalização da segurança ofensiva aconteceu em 1967, numa conferência em Atlantic City que resultou no Relatório Ware — o documento que convenceu governo e grandes corporações americanas a montar as primeiras "tiger teams", equipes autorizadas a atacar suas próprias redes antes que alguém o fizesse sem permissão. O resultado foi didático: praticamente todo sistema de grande porte caía diante de um ataque simulado.

Décadas depois, esse trabalho manual de laboratório migrou para o software. O SATAN, lançado em 1995, foi o primeiro scanner de rede com interface gráfica acessível — o avô direto do Nmap, do Nessus e do Metasploit que hoje rodam em qualquer instalação Kali Linux. Mas software resolve rede lógica. Ele não abre uma fechadura, não clona um cartão de proximidade e não engana um transceptor de rádio. Para isso, alguém precisava trazer o hacking de volta para o mundo físico — e miniaturizá-lo.

## Hak5, Proxmark3 e o nascimento do "tático de bolso"

A Hak5, fundada em 2005, tratou hacking de hardware como um problema de design de produto, não só de engenharia. O WiFi Pineapple (2008) escondia um kit de ataques man-in-the-middle dentro da carcaça de um roteador comum, explorando o fato de que celulares emitem *probe requests* constantes atrás de redes já conhecidas — e respondendo "sim, sou eu" a todas elas. O USB Rubber Ducky foi na mesma direção pelo lado do USB: um pendrive que o computador não trata como armazenamento, mas como teclado, e que por isso pode digitar comandos a velocidades impossíveis para um humano.

Em paralelo, no mundo acadêmico, Jonathan Westhues desenvolvia o Proxmark3 (2007) como projeto de mestrado. A escolha de arquitetura foi decisiva: em vez de um microcontrolador genérico, o Proxmark3 usa uma FPGA (Field-Programmable Gate Array), porque decodificar rádio em tempo real exige processamento paralelo que um chip sequencial simplesmente não entrega na velocidade necessária. Essa capacidade foi o que permitiu, pouco depois, a pesquisadores como Karsten Nohl e Henryk Plotz desmontarem publicamente a criptografia proprietária CRYPTO1 do Mifare Classic — um dos primeiros grandes exemplos de "segurança por obscuridade" sendo destruída por hardware acessível.

## O Pwnagotchi e a virada estética

Se Hak5 e Proxmark3 provaram que hardware ofensivo podia ser compacto, faltava provar que ele podia ser *querido*. Essa foi a contribuição do Pwnagotchi, lançado em 2019 pelo pesquisador "evilsocket": um Raspberry Pi Zero com tela e-ink rodando um algoritmo de aprendizado por reforço para capturar handshakes WPA, apresentado como um bichinho virtual que fica feliz quando captura pacotes e entediado quando o ambiente está silencioso.

Foi essa gamificação — mais do que qualquer avanço técnico — que preparou o terreno cultural para o Flipper Zero. A equipe do Flipper somou a mecânica do Pwnagotchi à estética retrô dos telefones Siemens antigos e ao golfinho cibernético do romance *Johnny Mnemonic*, e lançou a ideia no Kickstarter em agosto de 2020. O resultado surpreendeu até os criadores: US$ 1 milhão no primeiro dia, quase US$ 4,9 milhões ao final da campanha — dinheiro que financiou, literalmente em tempo real, o redesenho do hardware para incluir Bluetooth e NFC.

## O que o Flipper Zero realmente é (e não é)

Por trás do golfinho simpático há um conjunto de decisões de engenharia bem mais modesto do que a fama do produto sugere. O processador central é um STM32WB55RG: um núcleo Cortex-M4 a 64 MHz, com meros 256 KB de RAM e 1 MB de Flash — por isso a dependência de cartão microSD é obrigatória, não opcional. Um segundo núcleo (Cortex-M0) cuida só do Bluetooth Low Energy.

A peça mais falada — o rádio Sub-GHz — é um transceptor Texas Instruments CC1101, um chip de 2007 originalmente pensado para brinquedos e eletrônicos de consumo, não um SDR (Software Defined Radio) de espectro contínuo. Isso importa: o CC1101 só entende modulações simples e pré-definidas (OOK, ASK, FSK), opera meio-duplex e transmite com míseros 0 dBm de potência. Essa limitação física — não uma escolha de marketing — é o que separa o Flipper de um verdadeiro SDR como o HackRF, e é a base de boa parte do debate regulatório que o cerca (mais sobre isso no segundo post desta série).

Com hardware tão restrito, o firmware virou o verdadeiro campo de batalha. O firmware oficial respeita bloqueios regionais de banda impostos por FCC e Anatel. A comunidade respondeu com forks: o *Unleashed* remove essas restrições de frequência para pesquisadores que querem acesso irrestrito; o *Momentum* foca em refinar BadUSB, Bluetooth e NFC; e o *RogueMaster*, o mais popular e o mais instável, empilha tantos jogos e extras não documentados que rotineiramente estoura os 256 KB de SRAM do aparelho.

## A resposta Espressif: Cardputer, CYD e o domínio do Wi-Fi

Enquanto o Flipper reinava no RFID e no Sub-GHz, um problema prático abriu espaço para concorrentes: escassez de estoque levou o preço de revenda do Flipper a ultrapassar US$ 200. A comunidade migrou em massa para microcontroladores ESP32, muito mais capazes em redes sem fio e muito mais baratos.

O M5Stack Cardputer é o exemplo mais bem-acabado dessa migração: um ESP32-S3 dual-core a 240 MHz — quatro vezes o clock do Flipper — com teclado ortolinear compacto num chassi de bolso. Sua evolução, o Cardputer-Adv, resolveu o maior problema prático da geração anterior (bateria de 120 mAh principal com uma extra de 1400 mAh para extensão de tempo de uso), subindo para 1750 mAh, além de adicionar áudio dedicado e um sensor de gestos.

No extremo oposto do espectro de custo está o CYD (Cheap Yellow Display): placas de prototipagem originalmente vendidas para automação residencial, com um módulo ESP-WROOM-32 puro e tela touch, que a comunidade "hackeou" com módulos de GPS e bateria impressos em 3D — transformando um item de menos de trinta euros em uma plataforma de auditoria de campo completa.

## Modularidade como próxima fronteira

Três projetos mostram para onde a filosofia de design está indo:

- **ClockworkPi Picocalc** — usa o silício da própria linha Raspberry Pi (RP2040/RP2350) dentro do corpo de uma calculadora científica retrô, priorizando programabilidade pura sobre transceptores exóticos de fábrica. O preço dessa flexibilidade é a ausência de um módulo de criptografia dedicado (TPM), o que deixa dados de rede em texto simples caso o aparelho seja apreendido fisicamente.
- **LilyGO T-Embed** — junta ESP32-S3 com CC1101 num formato ainda mais discreto, controlado por um único encoder rotativo em vez de teclado.
- **High Boy** — o projeto brasileiro que resolve o maior déficit histórico do Flipper Zero (ausência de Wi-Fi nativo) com uma arquitetura *dual-MCU*: um ESP32-P4 (aplicações) trabalhando junto com um ESP32-C5 (rede), suportando Wi-Fi 6 dual-band de 2,4 e 5 GHz, LoRa de longo alcance, além de manter CC1101 e NFC. Nascido diretamente da dificuldade de importar Flippers no Brasil, o projeto arrecadou mais de US$ 600 mil no Kickstarter em 2025-2026 partindo de uma meta de apenas US$ 7 mil — prova de que restrição regulatória tende a estimular engenharia local, não eliminá-la.

## A filosofia por trás do bolso

O fio condutor de toda essa história não é a criptografia quebrada nem o protocolo explorado — é a queda da barreira de entrada. Nenhuma dessas ferramentas inventou um ataque novo. O que elas fizeram foi pegar técnicas que antes exigiam laboratório, osciloscópio e anos de estudo em modulação de RF, e empacotá-las numa interface de menus e botões que qualquer curioso consegue navegar em uma tarde.

Essa é a fronteira real entre o hardware hacking de ontem e o de hoje: não é sobre o que é possível fazer, é sobre quem consegue fazer. E é exatamente aí que a conversa deixa de ser sobre engenharia e passa a ser sobre segurança prática — o assunto do próximo post desta série.
