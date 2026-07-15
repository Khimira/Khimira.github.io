---
title: "Resolvendo Small Trouble da CyLab"
ctf: "Small Trouble - CyLab Security Academy"
category: "Cryptography"
summary: >
  Explorando RSA com o Ataque de Wiener.
difficulty: "Intermediate"
points: 200
solved: true
readTime: "16 min"
date: 2026-07-15
tags: ["cryptography", "reverse-engineering", "ctf"]
featured: false
---

Ao procurar um CTF (Capture The Flag) hoje eu queria algo que lidasse com ambas das minhas duas categorias favoritas de CTF, criptografia e engenharia reversa, logo me deparei com Small Trouble da CyLab Security Academy, que surpresa eu tive ao ver que o programa que gerava a criptografia não era um binário, mas um script simples em python de 25 linhas (e com comentários!), baixei ambos o programa e a mensagem cifrada.

## Reconhecimento

### A Mensagem Cifrada

A primeira coisa que fiz foi abrir a mensagem cifrada (message.txt), como esperado, nada mais era do que números sem nexo aparente, divididos em três grupos, *n*, *e* e por último *c*, indicando uma provável criptografia RSA.

Na criptografia RSA, *n*, o módulo, é o resultado da multiplicação de dois números primos grandes, *e*, o expoente público, é um número escolhido para compor a chave pública, sendo usado junto com o módulo para transformar a mensagem original em texto cifrado, que é chamado de *c*, que é gerado a partir de uma operação matemática que envolve o texto orignal, o expoente público e o módulo.

### O Programa

Após fazer o reconhecimento inicial da mensagem, decidi por analisar o código que a gerava, para minha surpresa, o script estava comentado, primeiro, analisei quais pacotes estavam sendo importados.

```python

from Crypto.Util.number import getPrime, inverse, bytes_to_long
import random


```

O script importava os módulos *getPrime*, *inverse* e *bytes_to_long* do pacote **Crypto.Util.number** e o pacote **random**, para entender o programa, precisei entender o que cada pacote e módulo fazia:

- **Crypto.Util.number**: Fornece funções utilitárias matemáticas essenciais para algoritmos de criptografia, incluindo:
  - ***getPrime***: Este módulo serve para gerar números primos aleatórios e criptograficamente seguros (utilizando de uma fonte de entropia do sistema) com um número específico de bits.
  - ***inverse***: O módulo *inverse* serve para calcular o inverso multiplicativo modular de um número, sendo amplamente utilizado em algoritmos de criptografia de chave pública (como o RSA, minha primeira suposição), sendo utilizada para calcular a chave privada a partir de uma chave pública e do totiente de Euler (processo chamado de inverso modular).
  - ***bytes_to_long***: Esta função serve para converter uma sequência de bytes (texto ou dados binários) em um número inteiro grande.
- ***random***: Este pacote serve para gerar números **pseudoaleatórios** e executar ações baseadas no acaso ou probabilidade, sendo essencial para simulações estatísticas e senhas aleatórias.

Após a análise dos pacotes importados, segui para a leitura do código.

```python

# Generate two large primes (1048 bits each)
p = getPrime(1048)
q = getPrime(1048)
n = p * q
phi = (p - 1) * (q - 1)

```

Como explicitado pelo comentário, as primeiras duas linhas geram os númmeros primos aleatórios com 1048 bits cada, logo depois, na terceira e quarta linha, esses números primos são utilizados para gerar o módulo (chamado de *n*), e *phi*, uma variável que será utilizada na função *inverse* no bloco seguinte.

```python

# compute d
d = getPrime(256)

# Compute the public exponent
e = inverse(d, phi)

```

Podemos ver que ele chama e calcula uma váriavel *d*, que também é utilizada como a chave privada da criptografia RSA (tudo no código aponta nessa direção), o interessante aqui, é que *d* é calculada com apenas 256 bits, que é muito pequeno considerando o módulo n de 2096 bits (multiplicação dos dois primos de 1048 bits), vamos guardar esta informação. Logo após calcular *d* o código calcula também o expoente público (variável *e*) através da função *inverse*.

```python

# Encrypt a flag
flag = b'picoCTF{...}'
m = bytes_to_long(flag)
c = pow(m, e, n)

```

Nesta parte do código a flag (o objetivo do desafio) é cifrado, primeiro utilizando a função *bytes_to_long*, transformando o texto puro em um número inteiro e logo depois, calculando o texto criptografado através da função *pow*, onde *m* é o texto transformado em número, *e* é o expoente e por fim *n* é o módulo.

```python

# Output for the challenge
with open("message.txt", "w") as f:
    f.write(f"n = {n}\n")
    f.write(f"e = {e}\n")
    f.write(f"c = {c}\n")

```
  
  Por fim, o programa escreve o módulo, o expoente público e a mensagem criptografada no arquivo *message.txt*.
  
## A Vulnerabilidade

Teoricamente, a mensagem está segura por ter sido gerada por processos pseudoaleatórios do sistema, mas por sabermos como foi feita e, principalmente, o número de bits de cada número primo, e a quantidade de bits da chave privada *d*, podemos realizar um *Ataque de Wiener*.

Em um RSA seguro, *d* deve ser um número na mesma magnitude do módulo n, Michael Wiener provou que, se *d* for pequeno demais em relação a *n*, é possível quebrar o RSA.

O ataque funciona calculando as frações contínuas da razão entre o expoente público *e* e o módulo *n* para encontrar os valores originais e recuperar a chave privada.

## Exploração

Após entneder a vulnerabilidade do desafio, abri minha IDE de Python para escrever o programa que descriptografou a mensagem, comecei pelo básico, importei os pacotes necessários:

```python

import owiener
from Crypto.Util.number import long_to_bytes

```

Onde o pacote *owiener* realiza o ataque e a função *long_to_bytes* converte o número de volta para texto legível.

Declarei as variáveis *n*, *e* e *c* com os valores encontrados na "message.txt".

```python

n = # Módulo
e = # Expoente público
c = # Mensagem criptografada

```

Fiz o ataque, declarando no terminal para monitoramento de progresso:

```python

print("[*] Iniciando o Ataque de Wiener.")

# Tenta recuperar o expoente privado 'd' usando o módulo owiener
d = owiener.attack(e, n)

```

E por fim criei um processo de decisão no programa, caso o ataque desse errado, ele simplesmente iria avisar e parar o programa, e caso desse certo, iria transformar de volta em texto a mensagem criptografada.

```python

if d is not None:
    print(f"[+] Expoente privado d encontrado: {d}")
    
    # Descriptografa a mensagem usando a fórmula m = c^d mod n
    m = pow(c, d, n)
    
    # Converte o número longo de volta para texto legível
    flag = long_to_bytes(m).decode('utf-8', errors='ignore')
    
    print(f"\n[+] Flag: {flag}")
else:
    print("[-] Falha. O ataque de Wiener não conseguiu encontrar 'd'.")

```

## A Flag

Com a flag capturada, enviei para a CyLab e recebi meus 200 pontos, aprendi e me diverti bastante com este CTF, mas a lição que fica é, ao lidar com criptografia, sempre confira quais ataques funcionam para aquele tipo de encriptação e como mitigar eles, caso a senha privada *d* não fosse tão pequena, o ataque de Wiener não funcionaria e a mensagem estaria para sempre apenas com quem a escreveu.

P.S.: Por razões éticas decidi por não publicar a flag, apenas os métodos de resolução, caso queira testar a solução, o desafio Small Trouble pode ser encontrado no site learn.cylabacademy.org na barra de pesquisa de desafios.
