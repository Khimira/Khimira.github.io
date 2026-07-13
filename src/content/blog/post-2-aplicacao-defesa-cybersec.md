---
title: "A Lógica do Ataque: O Que Dispositivos Como Flipper Zero Realmente Quebram (e Como se Defender)
"
summary: >
  Notas sobre como dispositivos como o Flipper Zero são usados para hardware hacking.
date: 2026-06-13
tags: ["pentest", "flipperzero", "security"]
difficulty: "Beginner"
readTime: "10 min"
---


No post anterior, vimos de onde vieram o Flipper Zero, o Cardputer, o CYD e o High Boy, e como a filosofia de design migrou de laboratórios trancados para dispositivos de bolso. Agora vem a pergunta que interessa a quem trabalha com segurança de verdade: o que esses aparelhos exploram tecnicamente, por que funcionam, e — principalmente — o que fazer a respeito.

A conclusão central deste post pode ser adiantada: **nenhum desses dispositivos inventou uma vulnerabilidade nova**. Todos exploram falhas de protocolo que já existiam, documentadas, há anos ou décadas. O que mudou foi o custo de explorá-las — de "precisa de laboratório e know-how" para "precisa de R$ 200 e um tutorial no YouTube". Isso muda completamente o cálculo de risco de qualquer organização.

---

## 1. Wi-Fi (802.11): o vetor mais automatizado

Firmwares como **Marauder** e **Bruce**, rodando em ESP32 (Cardputer, CYD) ou em devboards acopladas ao Flipper, concentram três táticas centrais:

### Wardriving (passivo)
Com um módulo GPS acoplado, o dispositivo varre continuamente o espectro de 2,4 GHz (e, no caso do High Boy, também 5 GHz), registrando BSSIDs e coordenadas geográficas. O resultado é um mapa de calor de redes vulneráveis numa região inteira — sem nunca transmitir um pacote malicioso. É reconhecimento puro.

### Desautenticação (ativa)
Este é o ataque mais conhecido e o mais simples de entender: a maioria das redes Wi-Fi ainda não força o **802.11w (Management Frame Protection)**, um recurso nativo apenas do WPA3. Sem essa proteção, qualquer dispositivo pode forjar pacotes de desassociação em nome do roteador legítimo, derrubando clientes conectados. Quando a vítima tenta se reconectar automaticamente, o atacante intercepta o *4-way handshake* WPA/WPA2 (ou o PMKID transmitido em aberto) e leva esse hash para quebrar offline, depois, com Hashcat em uma GPU.

### Evil Portal
Depois de desconectar a vítima, o atacante sobe um ponto de acesso clonando o SSID da rede legítima. O sistema operacional da vítima, programado para preferir o sinal mais forte, conecta automaticamente. Uma página de captive portal falsa — simulando "atualização de firmware do roteador" ou "revalidação de rede corporativa" — coleta a senha real digitada pelo usuário cansado da queda de conexão.

#### Defesa prática:
- Ative **WPA3 com 802.11w obrigatório** em toda infraestrutura que suportar — isso torna a desautenticação forjada tecnicamente inviável, não apenas mais difícil.
- Treine usuários para desconfiar de qualquer portal cativo pedindo senha de Wi-Fi fora do contexto normal de primeiro acesso.
- Em ambientes sensíveis, monitore anomalias de deauth via IDS de rede sem fio (WIDS) — o volume de pacotes de desassociação forjados é estatisticamente muito diferente do tráfego de gestão normal.

---

## 2. Bluetooth Low Energy: o ataque que não precisa de clique

Enquanto o Wi-Fi exige reconexão da vítima, o BLE tem um problema mais sutil: os canais de *advertising* (37, 38 e 39) são abertos por design, para permitir pareamento rápido.

O ataque conhecido como **"AppleJuice"** (nome popular no ecossistema Marauder/Bruce) inunda esses canais com pacotes forjados que imitam anúncios legítimos de AirPods, Apple TV ou acessórios Windows/Android. O resultado é uma cascata de pop-ups de pareamento no sistema da vítima — sem nenhuma ação do usuário, um verdadeiro ataque *zero-click* de negação de serviço na experiência.

A Apple mitigou parcialmente o problema no iOS 17.2, introduzindo atrasos que impedem o travamento visual completo do sistema, mas a poluição do espectro continua drenando bateria e gerando incômodo. Windows (via Swift Pair) e o ecossistema Android/Samsung sofrem de variações do mesmo problema — todos compartilham a mesma causa raiz: priorizar conveniência de pareamento sobre autenticação prévia do emissor.

#### Defesa prática:
- Desative o pareamento rápido automático (Swift Pair, Nearby Share) em ambientes onde isso não é operacionalmente necessário — é um recurso de conveniência, não de segurança.
- Mantenha sistemas operacionais atualizados; os patches de mitigação (como o do iOS 17.2) reduzem o impacto mesmo sem eliminar a causa raiz.
- Em ambientes corporativos de alta sensibilidade, considere políticas de MDM (Mobile Device Management) que restrinjam a superfície de pareamento BLE de dispositivos gerenciados.

---

## 3. RFID/NFC: o problema é o protocolo, não a ferramenta

Aqui a história é mais antiga e mais didática. Cartões de baixa frequência (125 kHz, como EM4100 e HID Prox) simplesmente transmitem um identificador único (UID) sem nenhuma camada criptográfica. Um Flipper Zero, um Proxmark3 ou até um CYD com módulo apropriado lê esse UID em segundos, à distância de poucos centímetros, e pode reemiti-lo à vontade — não existe "quebra" técnica alguma, porque nunca houve trava para quebrar.

Cartões de alta frequência (13,56 MHz) tentaram resolver isso com criptografia, mas o Mifare Classic usava um algoritmo proprietário chamado CRYPTO1 que pesquisadores (Nohl e Plotz, 2007) mostraram ser fundamentalmente fraco — décadas antes de dispositivos de bolso popularizarem o ataque. A resposta correta da indústria não foi esconder a falha, foi migrar para protocolos com AES real: Mifare Plus e, principalmente, Mifare DESFire, que resistem à clonagem de campo mesmo com equipamento de laboratório como um Proxmark3 completo.

#### Defesa prática:
- Se sua empresa ainda usa crachás de 125 kHz ou Mifare Classic, o problema não é o Flipper Zero na mão de alguém mal-intencionado — é a arquitetura do controle de acesso. Migrar para Mifare DESFire (ou equivalente com AES) elimina a clonagem trivial, independentemente de qual ferramenta o atacante carrega.
- Combine credencial física com um segundo fator (PIN, biometria) em áreas críticas — isso neutraliza qualquer clonagem de UID, mesmo que ela ocorra.

---

## 4. BadUSB: o vetor físico mais antigo do catálogo

O ataque não depende de nenhuma vulnerabilidade de software: ele explora o fato de que sistemas operacionais confiam cegamente na especificação HID (Human Interface Device). Um dispositivo — pendrive Rubber Ducky, Flipper Zero em modo BadUSB, ou até um Picocalc programado para isso — se apresenta ao computador como teclado. O sistema não pergunta "isso é um pendrive disfarçado?"; ele simplesmente executa o queo "teclado" digitar, a velocidades muito acima do que um humano consegue, o suficiente para abrir um terminal, baixar um payload e apagar rastros em poucos segundos.

#### Defesa prática:
- Implemente whitelisting de dispositivos USB por assinatura de hardware em endpoints sensíveis (via GPO no Windows, `udev` rules no Linux, ou soluções de DLP dedicadas).
- Desative portas USB fisicamente acessíveis em máquinas de recepção, quiosques e áreas sem supervisão constante.
- Treine a equipe: a regra mais simples e mais eficaz continua sendo "nunca conecte um pendrive desconhecido", inclusive — especialmente — um que "alguém deixou caído no estacionamento".

---

## 5. Sub-GHz e o mito do "roubo de carro instantâneo"

Este é o vetor mais mal compreendido pela imprensa e por legisladores.

### O ataque de repetição simples (Replay)
Sistemas antigos e baratos — portões de garagem obsoletos, cancelas industriais — transmitem sempre o mesmo código fixo em OOK/ASK. Gravar esse sinal com um Flipper Zero (ou qualquer rádio Sub-GHz) e reproduzi-lo depois abre o portão, porque o receptor não distingue sinal genuíno de gravação. Esse ataque de fato funciona, mas apenas contra equipamentos legados sem código dinâmico.

### Rolling codes: por que carros modernos não caem nisso
A indústria automotiva resolveu esse problema décadas atrás com códigos que mudam (Rolling Code), tipicamente via o algoritmo KeeLoq em chips como o Microchip HCS301. Cada transmissão consome um contador sincronizado por HMAC; repetir uma gravação antiga é rejeitado, porque o receptor já espera apenas o próximo valor da sequência. Um Flipper Zero simplesmente não consegue destravar um carro moderno gravando e reproduzindo o sinal do controle — essa parte da histeria de mídia está tecnicamente errada.

### RollJam: o verdadeiro ataque a rolling codes
Para de fato burlar um código rolante em campo, é preciso um rádio full-duplex: bloquear (jam) o sinal genuíno enquanto captura o código que a vítima acabou de emitir sem sucesso, guardando-o para uso posterior. Isso exige potência de transmissão muito acima dos 0 dBm que um CC1101 (usado pelo Flipper Zero e pela maioria desses dispositivos) entrega, e equipamento dedicado de bloqueio — nada que caiba dentro de um dispositivo de bolso com transceptor half-duplex.

### RollBack: a exceção real e documentada
Existe, sim, uma falha real e catalogada (CVE-2022-37418, CVE-2022-37305, CVE-2022-36945 — pesquisa apresentada na Black Hat USA 2022) em receptores RKE (Remote Keyless Entry) de alguns modelos Nissan, Kia e Hyundai. Nesse caso, basta capturar de dois a cinco sinais válidos consecutivos (sem precisar de jamming, e sem limite de tempo entre captura e uso) para forçar o contador do veículo a "voltar no tempo" e aceitar códigos antigos novamente. É uma falha real de implementação — mas está na lógica de ressincronização do carro, não em nenhuma capacidade do dispositivo que captura o sinal.

### O que realmente rouba carros keyless
Furtos organizados de veículos com partida sem chave dependem quase sempre de ataques de relé: dois rádios de alta potência, um perto do carro e outro perto da chave (às vezes do lado de dentro de casa, captando o sinal através da parede), retransmitindo a comunicação em tempo real para enganar o veículo fazendo-o pensar que a chave está próxima. Isso não tem nenhuma relação com um Flipper Zero ou qualquer dispositivo half-duplex de bolso — exige equipamento caro e dedicado.

#### Defesa prática:
- Se você administra portões, cancelas ou alarmes de prédio ainda baseados em código fixo OOK/ASK, a solução não é "proibir rádios" — é trocar o receptor por um com rolling code real. É mais barato que parece e resolve o problema pela raiz.
- Para veículos, uma bolsa de bloqueio de RF (Faraday) para a chave keyless neutraliza tanto ataques de relé quanto qualquer captura oportunista de sinal.
- Fabricantes de RKE deveriam adicionar validação de *timestamp*, não apenas de contador — é exatamente a mitigação que os próprios pesquisadores do RollBack sugeriram e que ainda não é padrão de mercado.

---

## O episódio regulatório: quando o pânico mirou a ferramenta errada

Vale registrar como esse mal-entendido técnico virou política pública, porque é um caso de estudo em si.

Em fevereiro de 2024, em meio a uma onda de furtos de veículos keyless no Canadá, o Ministro da Inovação, Ciência e Indústria, François-Philippe Champagne, anunciou publicamente a intenção de banir a venda e importação do Flipper Zero, atribuindo-lhe diretamente a alta de furtos. A Electronic Frontier Foundation e a própria comunidade técnica reagiram apontando exatamente o que descrevi acima: o transceptor half-duplex e a baixa potência do dispositivo o tornam fisicamente incapaz de executar os ataques de relé responsáveis pela esmagadora maioria desses furtos. O governo canadense recuou meses depois, redirecionando o foco regulatório para equipamentos de relé de fato usados por quadrilhas organizadas.

No Brasil, entre 2023 e 2024, a Anatel e a Receita Federal apreenderam mais de 340 unidades do dispositivo com base no artigo 162 da Lei Geral de Telecomunicações, por falta de homologação. Diferente do caso canadense, aqui a base legal era mais administrativa (homologação de equipamento de rádio) do que uma acusação direta de facilitar crimes — mas o efeito prático foi o mesmo: pesquisadores e estudantes de segurança tiveram dificuldade de importar uma ferramenta legítima de estudo.

Esse mesmo estrangulamento aduaneiro é, em boa parte, o que motivou o nascimento do *High Boy* — o projeto 100% open-hardware brasileiro que arrecadou mais de US$ 600 mil no Kickstarter (partindo de uma meta de US$ 7 mil) entre novembro de 2025 e janeiro de 2026, criado por um pequeno grupo de estudantes brasileiros como resposta direta à impossibilidade de importar dispositivos equivalentes legalmente. A empresa por trás dele, a High Code, deixa explícito no material do projeto que o firmware exclui deliberadamente funções de jamming e força bruta, posicionando o produto como ferramenta educacional — um contraponto interessante ao histórico de pânico regulatório que cercou seu antecessor.

Já a PayPal, em 2022, bloqueou unilateralmente US$ 1,3 milhão em fundos da Flipper Devices sob alegações vagas de risco de uso malicioso — um caso que ilustra como o atrito regulatório e financeiro em torno dessas ferramentas muitas vezes nasce de percepção pública, não de análise técnica de risco real.

O padrão que se repete em todos esses episódios: o alvo do pânico regulatório raramente é o vetor de risco real. Isso não isenta as ferramentas de escrutínio — mas mostra por que decisões de segurança, sejam elas de política pública ou de arquitetura corporativa, precisam ser guiadas por como o protocolo funciona, não por qual dispositivo apareceu num vídeo viral.

---

## Mentalidade defensiva: o resumo que fica

Se há uma lição unificadora em todos os vetores acima, é esta: essas ferramentas não criaram vulnerabilidades — elas apenas tornaram baratíssimo explorar vulnerabilidades que a indústria já conhecia e escolheu não corrigir. A postura defensiva correta não é combater o dispositivo, é fechar a lacuna estrutural:

1. Substitua credenciais estáticas por criptografia real — de RFID de 125 kHz para Mifare DESFire, de portões com código fixo para rolling code de verdade.
2. Force protocolos modernos onde eles existem — WPA3 com 802.11w torna a desautenticação forjada inofensiva; isso já está disponível na maioria do hardware comercial atual, só precisa ser ativado.
3. Trate a camada física como superfície de ataque real — whitelisting de USB, controle de acesso a portas físicas e políticas de MDM para Bluetooth não são "extras", são parte do perímetro.
4. Audite com as mesmas ferramentas que um atacante usaria — a melhor forma de saber se sua infraestrutura resiste a um Flipper Zero, um Cardputer ou um Proxmark3 é testá-la com um, dentro de um programa formal e autorizado de Red Team.

No fim das contas, o hardware de bolso não mudou o que é possível hackear. Mudou quem consegue fazer isso — e essa é, precisamente, a razão pela qual a defesa não pode mais depender de obscuridade. Ela precisa depender de criptografia de verdade, aplicada de forma consistente, em toda a superfície física e sem fio de uma organização.
